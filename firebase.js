// ============================================================
// FRENZY CHEATS APK HUB - FIREBASE CONFIG
// ============================================================

// IMPORTANT:
// Replace these values with your Firebase Web App configuration.
// Firebase Console → Project Settings → Your Apps → Web App

export const firebaseConfig = {
  apiKey: "AIzaSyCSJFYHI20c4XBf4JNaTsRHNQbHbd63hoc",
  authDomain: "AIzaSyCSJFYHI20c4XBf4JNaTsRHNQbHbd63hoc",
  projectId: "frenzy-apks",
  storageBucket: "frenzy-apks.firebasestorage.app",
  messagingSenderId: "670031638962",
  appId: "G-ZJ0KG1T3W4"
};

// ============================================================
// FIREBASE IMPORTS
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
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  onSnapshot
} from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

// ============================================================
// INITIALIZE
// ============================================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ============================================================
// AUTH
// ============================================================

export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};

// ============================================================
// APK FUNCTIONS
// ============================================================

export async function getPublishedAPKs() {

  const q = query(
    collection(db, "apks"),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}


export async function getAllAPKs() {

  const q = query(
    collection(db, "apks"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}


export async function getAPK(id) {

  const snap = await getDoc(
    doc(db, "apks", id)
  );

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...snap.data()
  };
}


// ============================================================
// ADD APK
// ============================================================

export async function addAPK(data) {

  return await addDoc(
    collection(db, "apks"),
    {
      ...data,

      downloadCount: 0,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp()
    }
  );
}


// ============================================================
// UPDATE APK
// ============================================================

export async function updateAPK(id, data) {

  return await updateDoc(
    doc(db, "apks", id),
    {
      ...data,

      updatedAt: serverTimestamp()
    }
  );
}


// ============================================================
// DELETE APK
// ============================================================

export async function deleteAPK(id) {

  return await deleteDoc(
    doc(db, "apks", id)
  );
}


// ============================================================
// DOWNLOAD TRACKING
// ============================================================

export async function trackDownload(apkId) {

  const apkRef = doc(
    db,
    "apks",
    apkId
  );

  await updateDoc(
    apkRef,
    {
      downloadCount: increment(1),

      lastDownloadAt:
        serverTimestamp()
    }
  );

  await addDoc(
    collection(db, "downloads"),
    {
      apkId: apkId,

      createdAt:
        serverTimestamp()
    }
  );
}


// ============================================================
// VISITOR TRACKING
// ============================================================

export async function trackVisitor() {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const visitorRef = doc(
    db,
    "analytics",
    "main"
  );

  const todayRef = doc(
    db,
    "analytics",
    "days",
    "dates",
    today
  );

  await setDoc(
    visitorRef,
    {
      totalVisitors:
        increment(1),

      updatedAt:
        serverTimestamp()
    },
    {
      merge: true
    }
  );

  await setDoc(
    todayRef,
    {
      visitors:
        increment(1),

      date: today,

      updatedAt:
        serverTimestamp()
    },
    {
      merge: true
    }
  );
}


// ============================================================
// GET ANALYTICS
// ============================================================

export async function getAnalytics() {

  const snap = await getDoc(
    doc(
      db,
      "analytics",
      "main"
    )
  );

  if (!snap.exists()) {

    return {
      totalVisitors: 0
    };

  }

  return snap.data();
}


// ============================================================
// UPLOAD IMAGE
// ============================================================

export async function uploadImage(
  file,
  folder = "apk-images"
) {

  if (!file) {
    throw new Error(
      "No file selected"
    );
  }

  const safeName =
    file.name
      .replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

  const path =
    `${folder}/${Date.now()}-${safeName}`;

  const storageRef =
    ref(
      storage,
      path
    );

  await uploadBytes(
    storageRef,
    file
  );

  return await getDownloadURL(
    storageRef
  );
}


// ============================================================
// UPLOAD MULTIPLE SCREENSHOTS
// ============================================================

export async function uploadScreenshots(
  files
) {

  const urls = [];

  for (
    const file of files
  ) {

    const url =
      await uploadImage(
        file,
        "screenshots"
      );

    urls.push(url);

  }

  return urls;
}