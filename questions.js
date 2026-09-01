import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const selectedSubjectText =
    document.getElementById("selectedSubject");

const difficultyButtons =
    document.querySelectorAll(".difficulty-btn");


// Check Login
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";
        return;
    }

    // Get selected subject
    const selectedSubject =
        localStorage.getItem("selectedSubject");


    if (!selectedSubject) {

        window.location.href = "dashboard.html";
        return;
    }


    // Display selected subject
    selectedSubjectText.innerHTML =
        "<strong>Selected Subject:</strong> " +
        selectedSubject;

});


// Difficulty Selection
difficultyButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedDifficulty =
            button.dataset.level;


        // Save selected difficulty
        localStorage.setItem(
            "selectedDifficulty",
            selectedDifficulty
        );


        // Go to Test Page
        window.location.href = "test.html";

    });

});