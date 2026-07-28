// ============================================================
// FRENZY CHEATS APK HUB - FIREBASE CONFIG
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyCSJFYHI20c4XBf4JNaTsRHNQbHbd63hoc",
  authDomain: "frenzy-apks.firebaseapp.com",
  projectId: "frenzy-apks",
  storageBucket: "frenzy-apks.firebasestorage.app",
  messagingSenderId: "670031638962",
  appId: "G-ZJ0KG1T3W4"
};


// ============================================================
// FIREBASE IMPORTS
// ============================================================

import {
  initializeApp
} from
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
  increment,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL
} from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);


// ============================================================
// AUTH
// ============================================================

export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};


// ============================================================
// APK - GET PUBLISHED
// ============================================================

export async function getPublishedAPKs() {

  const q = query(
    collection(db, "apks"),
    where(
      "published",
      "==",
      true
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
// APK - GET ALL
// ============================================================

export async function getAllAPKs() {

  const q = query(
    collection(db, "apks"),
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
// APK - GET SINGLE
// ============================================================

export async function getAPK(id) {

  const snap =
    await getDoc(
      doc(
        db,
        "apks",
        id
      )
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
// APK - ADD
// ============================================================

export async function addAPK(data) {

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

      ...data,

      downloadCount: 0,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp()

    }
  );

}


// ============================================================
// APK - UPDATE
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

      ...data,

      updatedAt:
        serverTimestamp()

    }
  );

}


// ============================================================
// APK - DELETE
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
// DIRECT APK UPLOAD
// PC FILE → FIREBASE STORAGE → DOWNLOAD URL
// ============================================================

export async function uploadAPK(
  file,
  folder = "apk-files",
  onProgress = null
) {

  // Admin login check
  if (!auth.currentUser) {

    throw new Error(
      "Admin login required before uploading APK."
    );

  }


  // File check
  if (!file) {

    throw new Error(
      "Please select an APK file."
    );

  }


  // APK extension check
  if (
    !file.name
      .toLowerCase()
      .endsWith(".apk")
  ) {

    throw new Error(
      "Only .apk files are allowed."
    );

  }


  // Maximum 500 MB
  const maxSize =
    500 * 1024 * 1024;

  if (
    file.size >
    maxSize
  ) {

    throw new Error(
      "APK file must be smaller than 500 MB."
    );

  }


  // Safe file name
  const safeName =
    file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    );


  // Unique storage path
  const filePath =
    `${folder}/${Date.now()}-${safeName}`;


  // Firebase Storage reference
  const storageRef =
    ref(
      storage,
      filePath
    );


  // Resumable upload
  const uploadTask =
    uploadBytesResumable(
      storageRef,
      file,
      {
        contentType:
          "application/vnd.android.package-archive"
      }
    );


  // Return download URL after upload
  return new Promise(
    (
      resolve,
      reject
    ) => {

      uploadTask.on(

        "state_changed",

        snapshot => {

          const progress =
            (
              snapshot.bytesTransferred /
              snapshot.totalBytes
            ) * 100;


          if (
            typeof onProgress ===
            "function"
          ) {

            onProgress(
              progress
            );

          }

        },


        error => {

          console.error(
            "APK Upload Error:",
            error
          );

          reject(
            error
          );

        },


        async () => {

          try {

            const downloadUrl =
              await getDownloadURL(
                uploadTask.snapshot.ref
              );


            resolve(
              downloadUrl
            );

          }
          catch(error) {

            reject(
              error
            );

          }

        }

      );

    }
  );

}


// ============================================================
// UPLOAD IMAGE
// ============================================================

export async function uploadImage(
  file,
  folder = "apk-images"
) {

  if (!auth.currentUser) {

    throw new Error(
      "Admin login required."
    );

  }


  if (!file) {

    throw new Error(
      "No file selected."
    );

  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Only image files are allowed."
    );

  }


  const safeName =
    file.name.replace(
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

  if (!auth.currentUser) {

    throw new Error(
      "Admin login required."
    );

  }


  const urls = [];


  for (
    const file of files
  ) {

    const url =
      await uploadImage(
        file,
        "screenshots"
      );


    urls.push(
      url
    );

  }


  return urls;

}


// ============================================================
// DOWNLOAD TRACKING
// ============================================================

export async function trackDownload(
  apkId
) {

  const apkRef =
    doc(
      db,
      "apks",
      apkId
    );


  await updateDoc(
    apkRef,
    {

      downloadCount:
        increment(1),

      lastDownloadAt:
        serverTimestamp()

    }
  );


  await addDoc(
    collection(
      db,
      "downloads"
    ),
    {

      apkId,

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
      .slice(
        0,
        10
      );


  const visitorRef =
    doc(
      db,
      "analytics",
      "main"
    );


  const todayRef =
    doc(
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

  const snap =
    await getDoc(
      doc(
        db,
        "analytics",
        "main"
      )
    );


  if (
    !snap.exists()
  ) {

    return {
      totalVisitors: 0
    };

  }


  return snap.data();

}
