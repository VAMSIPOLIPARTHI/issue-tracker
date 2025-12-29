import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        location.href = "dashboard.html";
    } catch (e) {
        alert("Login failed: " + e.message);
        console.error(e);
    }
};

window.signup = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        location.href = "dashboard.html";
    } catch (e) {
        alert("Signup failed: " + e.message);
        console.error(e);
    }
};

window.logout = async () => {
    try {
        await signOut(auth);
        location.href = "index.html";
    } catch (e) {
        console.error(e);
    }
};

export function protect() {
    onAuthStateChanged(auth, user => {
        if (!user) location.href = "index.html";
    });
}

// Toggle Button Text Logic
const radios = document.getElementsByName("auth-toggle");
const submitBtnSpan = document.querySelector("#auth-form button[type='submit'] span");

if (radios.length > 0 && submitBtnSpan) {
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "Sign Up") {
                submitBtnSpan.innerText = "Sign Up";
            } else {
                submitBtnSpan.innerText = "Sign In";
            }
        });
    });
}
