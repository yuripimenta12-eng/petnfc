// ============================================================
//  firebase.js — Configuração central do Firebase
//  Cole suas credenciais do Firebase Console aqui
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ⬇️  SUBSTITUA pelos valores do seu projeto no Firebase Console
//     (Configurações do projeto → Seus apps → Configuração do SDK)
const firebaseConfig = {
  apiKey:            "AIzaSyACFKTkl9hni4OolOLjMdZgNpKs8QN6lvw",
  authDomain:        "tang-nfc.firebaseapp.com",
  projectId:         "tang-nfc",
  storageBucket:     "tang-nfc.firebasestorage.app",
  messagingSenderId: "257508461118",
  appId:             "1:257508461118:web:0a824daf95946739c29f6f"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── Helpers ─────────────────────────────────────────────────

/** Salva ou atualiza os dados de um pet.
 *  Se petId for null, cria um novo documento com ID automático.
 *  Retorna o petId (string). */
export async function savePet(userId, petData, petId = null) {
  const petsRef = collection(db, "users", userId, "pets");
  if (petId) {
    await setDoc(doc(petsRef, petId), petData, { merge: true });
    return petId;
  } else {
    const ref = await addDoc(petsRef, petData);
    return ref.id;
  }
}

/** Lê os dados de um pet pelo ID público (slug = userId_petId). */
export async function getPetBySlug(slug) {
  // slug formato: "{userId}_{petId}"
  const [userId, petId] = slug.split("_");
  if (!userId || !petId) return null;
  const snap = await getDoc(doc(db, "users", userId, "pets", petId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Lê todos os pets de um usuário. */
export async function getUserPets(userId) {
  const { getDocs } = await import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
  const snap = await getDocs(collection(db, "users", userId, "pets"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export { db, auth, onAuthStateChanged, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, signOut };
