// ============================================================
// FRENZY CHEATS - FIREBASE.JS
// Firebase Authentication + Firestore
// ============================================================

// Firebase configuration
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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Make globally available
window.firebaseApp = firebase.app();
window.auth = auth;
window.db = db;


// ============================================================
// ADMIN LOGIN
// ============================================================

async function adminLogin(email, password) {

  email = String(email || "").trim();
  password = String(password || "");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  return await auth.signInWithEmailAndPassword(
    email,
    password
  );
}


// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout() {

  await auth.signOut();

  window.location.reload();

}


// ============================================================
// AUTH STATE
// ============================================================

function checkAdminLogin(callback) {

  return auth.onAuthStateChanged(
    user => {

      if (typeof callback === "function") {
        callback(user);
      }

    }
  );

}


// ============================================================
// GET APK LIST
// ============================================================

async function getAllAPKs() {

  const snapshot = await db
    .collection("apks")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => ({

    id: doc.id,

    ...doc.data()

  }));

}


// ============================================================
// ADD APK
// ============================================================

async function addAPK(data) {

  if (!auth.currentUser) {
    throw new Error(
      "You must be logged in as admin."
    );
  }

  return await db
    .collection("apks")
    .add({

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
        Array.isArray(data.features)
          ? data.features
          : [],

      published:
        data.published === true,

      featured:
        data.featured === true,

      downloadCount:
        0,

      createdAt:
        firebase.firestore.FieldValue.serverTimestamp(),

      updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    });

}


// ============================================================
// UPDATE APK
// ============================================================

async function updateAPK(id, data) {

  if (!auth.currentUser) {
    throw new Error(
      "You must be logged in as admin."
    );
  }

  return await db
    .collection("apks")
    .doc(id)
    .update({

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
        Array.isArray(data.features)
          ? data.features
          : [],

      published:
        data.published === true,

      featured:
        data.featured === true,

      updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    });

}


// ============================================================
// DELETE APK
// ============================================================

async function deleteAPK(id) {

  if (!auth.currentUser) {
    throw new Error(
      "You must be logged in as admin."
    );
  }

  return await db
    .collection("apks")
    .doc(id)
    .delete();

}


// ============================================================
// DOWNLOAD COUNTER
// ============================================================

async function trackDownload(id) {

  return await db
    .collection("apks")
    .doc(id)
    .update({

      downloadCount:
        firebase.firestore.FieldValue.increment(1)

    });

}


// ============================================================
// GLOBAL EXPORTS
// ============================================================

window.adminLogin =
  adminLogin;

window.adminLogout =
  adminLogout;

window.checkAdminLogin =
  checkAdminLogin;

window.getAllAPKs =
  getAllAPKs;

window.addAPK =
  addAPK;

window.updateAPK =
  updateAPK;

window.deleteAPK =
  deleteAPK;

window.trackDownload =
  trackDownload;
