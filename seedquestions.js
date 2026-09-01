import { db } from "./js/firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { questionBank } from "./js/questionBank.js";


const status = document.getElementById("status");


async function uploadQuestions() {

    try {

        if (!db) {
            throw new Error("Firestore database not initialized!");
        }

        if (!questionBank || questionBank.length === 0) {
            throw new Error("Question Bank is empty!");
        }

        status.innerHTML =
            "Found " + questionBank.length + " questions. Starting upload...";


        for (let i = 0; i < questionBank.length; i++) {

            await addDoc(
                collection(db, "questions"),
                questionBank[i]
            );

            status.innerHTML =
                "Uploading Question " +
                (i + 1) +
                " of " +
                questionBank.length;
        }


        status.innerHTML =
            "🎉 SUCCESS! All " +
            questionBank.length +
            " Questions Uploaded Successfully!";

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "❌ ERROR: " + error.message;
    }
}


uploadQuestions();