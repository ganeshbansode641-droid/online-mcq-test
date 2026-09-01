import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { questionBank } from "./questionBank.js";


const subjectTitle = document.getElementById("subjectTitle");
const difficultyTitle = document.getElementById("difficultyTitle");
const timerElement = document.getElementById("timer");

const currentQuestionElement =
    document.getElementById("currentQuestion");

const totalQuestionsElement =
    document.getElementById("totalQuestions");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const nextBtn =
    document.getElementById("nextBtn");


let questions = [];
let currentQuestion = 0;
let selectedAnswer = null;
let userAnswers = [];
let timeLeft = 30;
let timerInterval;


// Shuffle Questions
function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


// Load Question
function loadQuestion() {

    clearInterval(timerInterval);

    timeLeft = 30;
    timerElement.textContent = timeLeft;

    selectedAnswer = null;

    const question =
        questions[currentQuestion];


    currentQuestionElement.textContent =
        currentQuestion + 1;

    totalQuestionsElement.textContent =
        questions.length;


    questionText.textContent =
        question.question;


    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const optionButton =
                document.createElement("button");

            optionButton.classList.add("option");

            optionButton.textContent =
                String.fromCharCode(65 + index) +
                ". " + option;


            optionButton.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".option")
                        .forEach(btn => {

                            btn.classList
                                .remove("selected");

                        });


                    optionButton.classList
                        .add("selected");


                    selectedAnswer = index;

                }
            );


            optionsContainer.appendChild(
                optionButton
            );

        }
    );


    startTimer();

}


// Start 30 Second Timer
function startTimer() {

    timerInterval =
        setInterval(() => {

            timeLeft--;

            timerElement.textContent =
                timeLeft;


            if (timeLeft <= 0) {

                clearInterval(timerInterval);

                saveAnswerAndNext();

            }

        }, 1000);

}


// Save Answer and Go Next
function saveAnswerAndNext() {

    userAnswers.push({

        question:
            questions[currentQuestion],

        selectedAnswer:
            selectedAnswer

    });


    currentQuestion++;


    if (
        currentQuestion < questions.length
    ) {

        loadQuestion();

    } else {

        submitTest();

    }

}


// Next Button
nextBtn.addEventListener(
    "click",
    () => {

        clearInterval(timerInterval);

        saveAnswerAndNext();

    }
);


// Submit Test
function submitTest() {

    clearInterval(timerInterval);


    localStorage.setItem(
        "testQuestions",
        JSON.stringify(userAnswers)
    );


    window.location.href =
        "result.html";

}


// Authentication and Test Start
onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }


        const selectedSubject =
            localStorage.getItem(
                "selectedSubject"
            );


        const selectedDifficulty =
            localStorage.getItem(
                "selectedDifficulty"
            );


        if (
            !selectedSubject ||
            !selectedDifficulty
        ) {

            window.location.href =
                "dashboard.html";

            return;

        }


        subjectTitle.textContent =
            selectedSubject;


        difficultyTitle.textContent =
            "Difficulty: " +
            selectedDifficulty;


        // Filter Questions
        questions =
            questionBank.filter(
                question =>
                    question.subject ===
                    selectedSubject &&

                    question.difficulty ===
                    selectedDifficulty
            );


        // Random Order
        questions =
            shuffleArray([...questions]);


        if (questions.length === 0) {

            alert(
                "Questions are not available for this Subject and Difficulty!"
            );

            window.location.href =
                "dashboard.html";

            return;

        }


        loadQuestion();

    }
);