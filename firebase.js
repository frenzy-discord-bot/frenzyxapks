// ============================================================
// FRENZY CHEATS - FIREBASE.JS
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCSJFJHI20c4XBf4JNaTsRHNQbHbd63hoc",
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
// SERVICES
// ============================================================

const frenzyAuth = firebase.auth();

const db = firebase.firestore();

const storage = firebase.storage();


// ============================================================
// ADMIN LOGIN
// ============================================================

async function adminLogin(email, password) {

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    return await frenzyAuth.signInWithEmailAndPassword(
        email.trim(),
        password
    );
}


// ============================================================
// LOGOUT
// ============================================================

async function adminLogout() {
    await frenzyAuth.signOut();
}


// ============================================================
// ADD APK
// ============================================================

async function addAPK(data) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Admin login required.");
    }

    const apkData = {

        name: data.name || "",

        version: data.version || "",

        category: data.category || "Android",

        badge: data.badge || "AVAILABLE",

        logoUrl: data.logoUrl || "",

        downloadUrl: data.downloadUrl || "",

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
            firebase.firestore.FieldValue.serverTimestamp(),

        updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

    };

    const docRef = await db
        .collection("apks")
        .add(apkData);

    return docRef.id;
}


// ============================================================
// GET ALL APKs
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
// UPDATE APK
// ============================================================

async function updateAPK(id, data) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Admin login required.");
    }

    await db
        .collection("apks")
        .doc(id)
        .update({

            name: data.name || "",

            version: data.version || "",

            category: data.category || "Android",

            badge: data.badge || "AVAILABLE",

            logoUrl: data.logoUrl || "",

            downloadUrl: data.downloadUrl || "",

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
                firebase.firestore.FieldValue.serverTimestamp()

        });
}


// ============================================================
// DELETE APK
// ============================================================

async function deleteAPK(id) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Admin login required.");
    }

    await db
        .collection("apks")
        .doc(id)
        .delete();
}


// ============================================================
// UPLOAD LOGO TO FIREBASE STORAGE
// ============================================================

async function uploadAPKLogo(file) {

    if (!frenzyAuth.currentUser) {
        throw new Error("Admin login required.");
    }

    if (!file) {
        return "";
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5MB.");
    }

    const fileName =
        "apk-logos/" +
        Date.now() +
        "-" +
        file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

    const storageRef =
        storage.ref().child(fileName);

    await storageRef.put(file);

    const downloadURL =
        await storageRef.getDownloadURL();

    return downloadURL;
}


// ============================================================
// DOWNLOAD COUNT
// ============================================================

async function increaseDownloadCount(id) {

    try {

        await db
            .collection("apks")
            .doc(id)
            .update({

                downloadCount:
                    firebase.firestore.FieldValue.increment(1)

            });

    } catch (error) {

        console.error(
            "Download count error:",
            error
        );

    }
}
