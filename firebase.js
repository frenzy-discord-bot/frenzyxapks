// ============================================================
// FRENZY CHEATS - FIREBASE.JS
// SINGLE INITIALIZATION
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
// FIREBASE INITIALIZATION - ONLY ONCE
// ============================================================

if (typeof firebase === "undefined") {
    throw new Error(
        "Firebase SDK load nahi hua. Firebase SDK ko firebase.js se pehle load karo."
    );
}

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}


// ============================================================
// FIREBASE SERVICES
// ============================================================

const db = firebase.firestore();

const frenzyAuth = firebase.auth();


// ============================================================
// ADMIN LOGIN
// ============================================================

async function adminLogin(email, password) {

    email = String(email || "").trim();
    password = String(password || "");

    if (!email || !password) {
        throw new Error("Email aur password required hai.");
    }

    return await frenzyAuth.signInWithEmailAndPassword(
        email,
        password
    );
}


// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout() {

    return await frenzyAuth.signOut();

}


// ============================================================
// ADD APK
// ============================================================

async function addAPK(data) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Please login as admin first.");
    }

    return await db
        .collection("apks")
        .add({

            name: data.name || "",

            version: data.version || "",

            category:
                data.category || "Android",

            badge:
                data.badge || "AVAILABLE",

            logoUrl:
                data.logoUrl || "",

            downloadUrl:
                data.downloadUrl || "",

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

            downloadCount: 0,

            createdAt:
                firebase.firestore.FieldValue
                    .serverTimestamp(),

            updatedAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        });

}


// ============================================================
// UPDATE APK
// ============================================================

async function updateAPK(id, data) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Please login as admin first.");
    }

    return await db
        .collection("apks")
        .doc(id)
        .update({

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

            updatedAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        });

}


// ============================================================
// DELETE APK
// ============================================================

async function deleteAPK(id) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Please login as admin first.");
    }

    return await db
        .collection("apks")
        .doc(id)
        .delete();

}


// ============================================================
// GET ALL APKs - ADMIN
// ============================================================

async function getAllAPKs() {

    if (!frenzyAuth.currentUser) {
        throw new Error("Please login as admin first.");
    }

    const snapshot = await db
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

}


// ============================================================
// GET PUBLISHED APKs - PUBLIC WEBSITE
// ============================================================

async function getPublishedAPKs() {

    const snapshot = await db
        .collection("apks")
        .where(
            "published",
            "==",
            true
        )
        .get();

    const apps =
        snapshot.docs.map(
            doc => ({

                id: doc.id,

                ...doc.data()

            })
        );

    apps.sort(
        (a, b) => {

            const aTime =
                a.createdAt &&
                typeof a.createdAt.toMillis ===
                "function"

                    ? a.createdAt.toMillis()

                    : 0;

            const bTime =
                b.createdAt &&
                typeof b.createdAt.toMillis ===
                "function"

                    ? b.createdAt.toMillis()

                    : 0;

            return bTime - aTime;

        }
    );

    return apps;

}


// ============================================================
// DOWNLOAD COUNTER
// ============================================================

async function trackAPKDownload(id) {

    try {

        await db
            .collection("apks")
            .doc(id)
            .update({

                downloadCount:
                    firebase.firestore.FieldValue
                        .increment(1)

            });

    }

    catch (error) {

        console.error(
            "Download counter error:",
            error
        );

    }

}
