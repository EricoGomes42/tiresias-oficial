import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0879858478",
  appId: "1:170482660072:web:bc6cb0f3add83c4f0c4f5d",
  apiKey: "AIzaSyAr0AB4Yy88vQqSr4zwxfb3MFkMATntbcU",
  authDomain: "gen-lang-client-0879858478.firebaseapp.com",
  storageBucket: "gen-lang-client-0879858478.firebasestorage.app",
  messagingSenderId: "170482660072",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-67ba0678-921e-4e69-a1f1-8d0659a2b4c0");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create/update user document in Firestore rules
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    console.log("Signed in as:", user.email);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

window.signOutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out failed:", error);
  }
};

onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById("loginBtn");
  if (user) {
    if (loginBtn) {
      loginBtn.innerText = "Sign Out";
      loginBtn.onclick = window.signOutFirebase;
    }
  } else {
    if (loginBtn) {
      loginBtn.innerText = "Login with Google";
      loginBtn.onclick = window.signInWithGoogle;
    }
  }
});
