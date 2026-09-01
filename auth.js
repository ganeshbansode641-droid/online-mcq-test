import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


// If student is already logged in
onAuthStateChanged(auth, (user) => {

    if (user) {
        window.location.href = "dashboard.html";
    }

});


// Login Form
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        message.style.color = "blue";
        message.textContent = "Logging in...";


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        message.style.color = "green";
        message.textContent = "Login Successful!";


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);


    } catch (error) {

        console.error(error);


        message.style.color = "red";


        if (error.code === "auth/invalid-credential") {

            message.textContent =
                "Invalid email or password!";

        } else {

            message.textContent =
                error.message;

        }

    }

});