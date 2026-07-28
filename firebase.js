// ============================================================
// FRENZY CHEATS - FIREBASE.JS
// Firebase Storage NOT USED
// Firebase Auth + Firestore ONLY
// ============================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  increment,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIG
// Replace these values with your Firebase project config
// ============================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSJFYHI20c4XBf4JNaTsRHNQbHbd63hoc",
  authDomain: "frenzy-apks.firebaseapp.com",
  databaseURL: "https://frenzy-apks-default-rtdb.firebaseio.com",
  projectId: "frenzy-apks",
  storageBucket: "frenzy-apks.firebasestorage.app",
  messagingSenderId: "670031638962",
  appId: "1:670031638962:web:75f7a606daa653283774ab",
  measurementId: "G-ZJ0KG1T3W4"
};


// ============================================================
// INITIALIZE
// ============================================================

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


// ============================================================
// AUTH EXPORTS
// ============================================================

export {
  auth,
  db,

  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};


// ============================================================
// ADMIN LOGIN
// ============================================================

export async function adminLogin(
  email,
  password
) {

  if (!email || !password) {
    throw new Error(
      "Email and password are required."
    );
  }

  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

}


// ============================================================
// ADMIN LOGOUT
// ============================================================

export async function adminLogout() {

  await signOut(auth);

}


// ============================================================
// GET ALL APKs
// ============================================================

export async function getAllAPKs() {

  const q = query(
    collection(
      db,
      "apks"
    ),
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    item => ({

      id: item.id,

      ...item.data()

    })
  );

}


// ============================================================
// GET PUBLISHED APKs
// ============================================================

export async function getPublishedAPKs() {

  const q = query(
    collection(
      db,
      "apks"
    ),
    orderBy(
      "createdAt",
      "desc"
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs
    .map(
      item => ({

        id: item.id,

        ...item.data()

      })
    )
    .filter(
      item =>
        item.published === true
    );

}


// ============================================================
// ADD APK
// ============================================================

export async function addAPK(
  data
) {

  if (!auth.currentUser) {

    throw new Error(
      "Admin login required."
    );

  }

  return await addDoc(
    collection(
      db,
      "apks"
    ),
    {

      name:
        data.name || "",

      category:
        data.category || "Android",

      version:
        data.version || "",

      logoUrl:
        data.logoUrl || "",

      downloadUrl:
        data.downloadUrl || "",

      telegramUrl:
        data.telegramUrl || "",

      compatibility:
        data.compatibility || "",

      badge:
        data.badge || "",

      shortDescription:
        data.shortDescription || "",

      description:
        data.description || "",

      features:
        Array.isArray(
          data.features
        )
          ? data.features
          : [],

      published:
        data.published === true,

      featured:
        data.featured === true,

      downloadCount:
        0,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()

    }
  );

}


// ============================================================
// UPDATE APK
// ============================================================

export async function updateAPK(
  id,
  data
) {

  if (!auth.currentUser) {

    throw new Error(
      "Admin login required."
    );

  }

  return await updateDoc(
    doc(
      db,
      "apks",
      id
    ),
    {

      name:
        data.name || "",

      category:
        data.category || "Android",

      version:
        data.version || "",

      logoUrl:
        data.logoUrl || "",

      downloadUrl:
        data.downloadUrl || "",

      telegramUrl:
        data.telegramUrl || "",

      compatibility:
        data.compatibility || "",

      badge:
        data.badge || "",

      shortDescription:
        data.shortDescription || "",

      description:
        data.description || "",

      features:
        Array.isArray(
          data.features
        )
          ? data.features
          : [],

      published:
        data.published === true,

      featured:
        data.featured === true,

      updatedAt:
        serverTimestamp()

    }
  );

}


// ============================================================
// DELETE APK
// ============================================================

export async function deleteAPK(
  id
) {

  if (!auth.currentUser) {

    throw new Error(
      "Admin login required."
    );

  }

  return await deleteDoc(
    doc(
      db,
      "apks",
      id
    )
  );

}


// ============================================================
// INCREASE DOWNLOAD COUNT
// ============================================================

export async function trackDownload(
  id
) {

  return await updateDoc(
    doc(
      db,
      "apks",
      id
    ),
    {

      downloadCount:
        increment(1)

    }
  );

}
