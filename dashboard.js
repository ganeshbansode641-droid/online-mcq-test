import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const studentName = document.getElementById("studentName");
const subjectSelect = document.getElementById("subject");
const continueBtn = document.getElementById("continueBtn");
const logoutBtn = document.getElementById("logoutBtn");


// Check whether the student is logged in
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        // Get student information from Firestore
        const studentDoc = await getDoc(
            doc(db, "students", user.uid)
        );

        if (studentDoc.exists()) {
            const data = studentDoc.data();

            studentName.innerHTML =
                "Hello, <strong>" + data.name + "</strong> 👋";
        } else {
            studentName.innerHTML =
                "Hello, Student 👋";
        }

    } catch (error) {
        console.error("Error loading student:", error);
    }

});


// Continue button
continueBtn.addEventListener("click", () => {

    const selectedSubject = subjectSelect.value;

    if (selectedSubject === "") {
        alert("Please select a subject!");
        return;
    }

    // Save selected subject temporarily
    localStorage.setItem("selectedSubject", selectedSubject);

    // Go to difficulty page
    window.location.href = "difficulty.html";

});


// Logout button
logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        alert("Logout Successful!");

        window.location.href = "index.html";

    } catch (error) {

        alert("Logout Error: " + error.message);

    }

});