import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  collection, addDoc, getDocs,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACFKTkl9hni4OolOLjMdZgNpKs8QN6lvw",
  authDomain: "tang-nfc.firebaseapp.com",
  projectId: "tang-nfc",
  storageBucket: "tang-nfc.firebasestorage.app",
  messagingSenderId: "257508461118",
  appId: "1:257508461118:web:0a824daf95946739c29f6f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail };

export async function savePet(userId, petData, petId = null) {
  const col = collection(db, "users", userId, "pets");
  if (petId) {
    await setDoc(doc(col, petId), petData, { merge: true });
    return petId;
  } else {
    const ref = await addDoc(col, petData);
    return ref.id;
  }
}

export async function getUserPets(userId) {
  const col = collection(db, "users", userId, "pets");
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deletePet(userId, petId) {
  await setDoc(doc(db, "users", userId, "pets", petId), { deleted: true }, { merge: true });
}

export async function getPetBySlug(slug) {
  const parts = slug.split("_");
  if (parts.length < 2) return null;
  const userId = parts[0];
  const petId = parts.slice(1).join("_");
  const ref = doc(db, "users", userId, "pets", petId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function incrementScan(userId, petId) {
  const now = new Date().toISOString();
  try {
    await addDoc(collection(db, "scans"), { userId, petId, scannedAt: now });
  } catch (e) {
    console.warn("[incrementScan] scans:", e.message);
  }
  try {
    const petRef = doc(db, "users", userId, "pets", petId);
    await updateDoc(petRef, { scanCount: increment(1), lastScannedAt: now });
  } catch (e) {
    console.warn("[incrementScan] updateDoc:", e.message);
  }
}
