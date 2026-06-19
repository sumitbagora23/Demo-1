import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔻 REPLACE THESE PLACEHOLDER VALUES with your own Firebase project config.
const firebaseConfig = {
  apiKey: "AIzaSyCUVqO-X5x94wdK2Pl-jHeMDNnVLS88BXk",
  authDomain: "fir-1-4783f.firebaseapp.com",
  projectId: "fir-1-4783f",
  storageBucket: "fir-1-4783f.firebasestorage.app",
  messagingSenderId: "467832081996",
  appId: "1:467832081996:web:db58a3b51ab09feed56ee9",
  measurementId: "G-1TY0WN09HF"
};

const COLLECTION_NAME = "inquiries";

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Treat the unedited placeholder as "not configured" so app.js can warn clearly.
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

/**
 * Save one inquiry to Firestore. Returns { success, id }.
 * Exposed on window so the classic-script app.js can call it.
 */
window.ckSaveInquiry = async function saveInquiry(data) {
  if (!isConfigured) {
    throw new Error(
      "Firebase is not configured yet. Add your firebaseConfig keys in firebase-init.js."
    );
  }

  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    inquiry_type: data.inquiry_type,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone || null,
    details: data.details,
    created_at: serverTimestamp(),
    user_agent: navigator.userAgent
  });

  return { success: true, id: ref.id };
};

// Let app.js know Firebase is ready (in case it loads first).
window.ckFirebaseReady = true;
window.dispatchEvent(new Event("ck-firebase-ready"));
