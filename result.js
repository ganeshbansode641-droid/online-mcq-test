import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const scoreElement = document.getElementById("score");

const wrongElement = document.getElementById("wrong");

const percentageElement = document.getElementById("percentage");

const reviewContainer =
    document.getElementById("reviewContainer");

const newTestBtn =
    document.getElementById("newTestBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// Check whether student is logged in

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    await loadResult(user);

});


// Load Test Result

async function loadResult(user) {

    const savedAnswers =
        localStorage.getItem("testQuestions");


    if (!savedAnswers) {

        window.location.href =
            "dashboard.html";

        return;
    }


    const userAnswers =
        JSON.parse(savedAnswers);


    let correctCount = 0;

    let wrongCount = 0;


    reviewContainer.innerHTML = "";


    userAnswers.forEach(
        (item, index) => {

            const question =
                item.question;

            const selectedAnswer =
                item.selectedAnswer;

            const correctAnswer =
                question.answer;


            const isCorrect =
                selectedAnswer === correctAnswer;


            if (isCorrect) {

                correctCount++;

            } else {

                wrongCount++;

            }


            const reviewDiv =
                document.createElement("div");

            reviewDiv.classList.add(
                "review-question"
            );


            let userAnswerText;


            if (
                selectedAnswer === null ||
                selectedAnswer === undefined
            ) {

                userAnswerText =
                    "Not Answered";

            } else {

                userAnswerText =
                    question.options[
                        selectedAnswer
                    ];

            }


            const correctAnswerText =
                question.options[
                    correctAnswer
                ];


            reviewDiv.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${question.question}
                </h3>

                <p class="user-answer">

                    Your Answer:

                    <span class="${
                        isCorrect
                            ? "correct-answer"
                            : "wrong-answer"
                    }">

                        ${userAnswerText}

                    </span>

                </p>

                <p class="correct-answer">

                    Correct Answer:

                    ${correctAnswerText}

                </p>

            `;


            reviewContainer.appendChild(
                reviewDiv
            );

        }
    );


    // Calculate total questions

    const totalQuestions =
        userAnswers.length;


    // Calculate percentage

    const percentage =
        totalQuestions > 0

            ? (
                correctCount /
                totalQuestions
            ) * 100

            : 0;


    // Display Result

    scoreElement.textContent =
        correctCount;


    wrongElement.textContent =
        wrongCount;


    percentageElement.textContent =
        percentage.toFixed(2) + "%";


    // Get selected subject and difficulty

    const selectedSubject =
        localStorage.getItem(
            "selectedSubject"
        ) || "Not Selected";


    const selectedDifficulty =
        localStorage.getItem(
            "selectedDifficulty"
        ) || "Not Selected";


    // Prevent duplicate result saving

    const resultSaved =
        localStorage.getItem(
            "resultSaved"
        );


    if (!resultSaved) {

        try {

            await addDoc(
                collection(db, "results"),
                {

                    userId:
                        user.uid,

                    email:
                        user.email,

                    subject:
                        selectedSubject,

                    difficulty:
                        selectedDifficulty,

                    totalQuestions:
                        totalQuestions,

                    correctAnswers:
                        correctCount,

                    wrongAnswers:
                        wrongCount,

                    percentage:
                        Number(
                            percentage.toFixed(2)
                        ),

                    createdAt:
                        serverTimestamp()

                }
            );


            // Mark result as saved

            localStorage.setItem(
                "resultSaved",
                "true"
            );


            console.log(
                "Result saved successfully!"
            );

        } catch (error) {

            console.error(
                "Error saving result:",
                error
            );

        }

    }

}


// Take Another Test

newTestBtn.addEventListener(
    "click",
    () => {


        // Remove previous test data

        localStorage.removeItem(
            "testQuestions"
        );

        localStorage.removeItem(
            "selectedSubject"
        );

        localStorage.removeItem(
            "selectedDifficulty"
        );

        localStorage.removeItem(
            "resultSaved"
        );


        window.location.href =
            "dashboard.html";

    }
);


// Logout

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);


            localStorage.clear();


            alert(
                "Logout Successful!"
            );


            window.location.href =
                "index.html";


        } catch (error) {

            alert(
                "Logout Error: " +
                error.message
            );

        }

    }
);