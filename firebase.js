// ============================================================
// FRENZY CHEATS - FIREBASE CONFIG
// ============================================================

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
// INITIALIZE FIREBASE
// ============================================================

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


// ============================================================
// GLOBAL FIREBASE INSTANCES
// IMPORTANT: Do NOT use variable name "auth"
// This avoids "Cannot access auth before initialization"
// ============================================================

const frenzyAuth = firebase.auth();
const frenzyDB = firebase.firestore();


// Make globally available

window.frenzyAuth = frenzyAuth;
window.frenzyDB = frenzyDB;


// ============================================================
// ADMIN LOGIN
// ============================================================

window.adminLogin = async function(email, password) {

    if (!email || !password) {
        throw new Error(
            "Please enter email and password."
        );
    }

    return await frenzyAuth
        .signInWithEmailAndPassword(
            email.trim(),
            password
        );

};


// ============================================================
// ADMIN LOGOUT
// ============================================================

window.adminLogout = async function() {

    await frenzyAuth.signOut();

    window.location.reload();

};


// ============================================================
// AUTH STATE
// ============================================================

window.checkAdminLogin = function(callback) {

    return frenzyAuth.onAuthStateChanged(
        callback
    );

};


// ============================================================
// GET ALL APKs
// ============================================================

window.getAllAPKs = async function() {

    const snapshot = await frenzyDB
        .collection("apks")
        .orderBy(
            "createdAt",
            "desc"
        )
        .get();

    return snapshot.docs.map(
        doc => ({

            id: doc.id,

            ...doc.data()

        })
    );

};


// ============================================================
// ADD APK
// ============================================================

window.addAPK = async function(data) {

    if (!frenzyAuth.currentUser) {

        throw new Error(
            "Admin login required."
        );

    }

    return await frenzyDB
        .collection("apks")
        .add({

            name:
                data.name || "",

            version:
                data.version || "",

            category:
                data.category || "Android",

            badge:
                data.badge || "AVAILABLE",

            logoUrl:
                data.logoUrl || "",

            downloadUrl:
                data.downloadUrl || "",

            description:
                data.description || "",

            shortDescription:
                data.shortDescription || "",

            features:
                Array.isArray(data.features)
                    ? data.features
                    : [],

            published:
                data.published === true,

            downloadCount:
                0,

            createdAt:
                firebase.firestore
                .FieldValue
                .serverTimestamp(),

            updatedAt:
                firebase.firestore
                .FieldValue
                .serverTimestamp()

        });

};


// ============================================================
// UPDATE APK
// ============================================================

window.updateAPK = async function(
    id,
    data
) {

    if (!frenzyAuth.currentUser) {

        throw new Error(
            "Admin login required."
        );

    }

    return await frenzyDB
        .collection("apks")
        .doc(id)
        .update({

            ...data,

            updatedAt:
                firebase.firestore
                .FieldValue
                .serverTimestamp()

        });

};


// ============================================================
// DELETE APK
// ============================================================

window.deleteAPK = async function(id) {

    if (!frenzyAuth.currentUser) {

        throw new Error(
            "Admin login required."
        );

    }

    return await frenzyDB
        .collection("apks")
        .doc(id)
        .delete();

};


// ============================================================
// DOWNLOAD COUNTER
// ============================================================

window.increaseDownloadCount =
async function(id) {

    return await frenzyDB
        .collection("apks")
        .doc(id)
        .update({

            downloadCount:
                firebase.firestore
                .FieldValue
                .increment(1)

        });

};
