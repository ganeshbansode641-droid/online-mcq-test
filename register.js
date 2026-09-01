import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");


registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    try {

        message.innerHTML = "Creating your account...";

        // Create user in Firebase Authentication
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        // Save student information in Firestore
        await setDoc(doc(db, "students", user.uid), {

            name: name,
            email: email,
            uid: user.uid,
            createdAt: serverTimestamp()

        });


        message.innerHTML =
            "Registration Successful! Redirecting...";


        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);


    } catch (error) {

        console.error(error);

        message.innerHTML = error.message;

    }

});