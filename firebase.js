import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc,
  collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// A API key do Firebase e publica por design - necessaria no front-end.
// A seguranca real e feita pelas Firebase Security Rules no console do Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyACFKTkl9hni4OolOLjMdZgNpKs8QN6lvw",
  authDomain: "tang-nfc.firebaseapp.com",
  projectId: "tang-nfc",
  storageBucket: "tang-nfc.firebasestorage.app",
  messagingSenderId: "257508461118",
  appId: "1:257508461118:web:0a824daf95946739c29f6f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export async function savePet(userId, petData, petId = null) {
  try {
    const petsRef = collection(db, "users", userId, "pets");
    if (petId) {
      await setDoc(doc(petsRef, petId), petData, { merge: true });
      return petId;
    } else {
      const ref = await addDoc(petsRef, petData);
      return ref.id;
    }
  } catch (err) {
    console.error("[savePet]", err);
    throw new Error("Nao foi possivel salvar o pet. Verifique sua conexao e tente novamente.");
  }
}

export async function getPetBySlug(slug) {
  try {
    const [userId, petId] = slug.split("_");
    if (!userId || !petId) return null;
    const snap = await getDoc(doc(db, "users", userId, "pets", petId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("[getPetBySlug]", err);
    throw new Error("Nao foi possivel carregar os dados do pet.");
  }
}

export async function getUserPets(userId) {
  try {
    const snap = await getDocs(collection(db, "users", userId, "pets"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[getUserPets]", err);
    throw new Error("Nao foi possivel carregar seus pets. Verifique sua conexao.");
  }
}

export async function deletePet(userId, petId) {
  try {
    const { deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await deleteDoc(doc(db, "users", userId, "pets", petId));
  } catch (err) {
    console.error("[deletePet]", err);
    throw new Error("Nao foi possivel excluir o pet. Tente novamente.");
  }
}

export async function incrementScan(userId, petId) {
  try {
    const { updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await updateDoc(doc(db, "users", userId, "pets", petId), {
      scanCount: increment(1),
      lastScannedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn("[incrementScan]", err);
  }
}

export { db, auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
