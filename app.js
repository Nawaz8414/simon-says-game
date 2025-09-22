// --- DOM ELEMENT SELECTION ---
const welcomeScreen = document.querySelector("#welcome-screen");
const gameContainer = document.querySelector("#game-container");
const nameInput = document.querySelector("#name-input");
const startButton = document.querySelector("#start-button");
const gameTitle = document.querySelector("#game-container h1");
const restartBtn = document.querySelector("#restart-btn");
const mobileStartBtn = document.querySelector("#mobile-start-btn");
const instructions = document.querySelector("#instructions");

// Score elements
const currentHighScoreEl = document.querySelector("#current-high-score");
const allTimeScoreEl = document.querySelector("#all-time-score-value");

// --- GLOBAL VARIABLES ---
let userName = "";
let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "blue", "purple"];
let started = false;
let level = 0;
let h2 = document.querySelector("#game-container h2");

// High score variables
let currentPlayerHighScore = 0;
let allTimeHighScore = 0;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    allTimeHighScore = localStorage.getItem("simonHighScore") || 0;
    allTimeScoreEl.innerText = allTimeHighScore;
});


// --- WELCOME SCREEN LOGIC ---
startButton.addEventListener("click", () => {
    userName = nameInput.value;
    if (userName.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    currentPlayerHighScore = 0;
    currentHighScoreEl.innerText = 0;

    welcomeScreen.style.display = "none";
    gameContainer.style.display = "block";
    gameTitle.innerHTML = `Welcome, ${userName}!`;
    h2.classList.add("hidden"); // Hide level text until game starts
    document.body.style.backgroundImage = createWatermark(userName);

    // Add event listeners for starting the game
    document.addEventListener("keypress", startGame);
    restartBtn.addEventListener("click", startGame);
    mobileStartBtn.addEventListener("click", startGame);
});


// --- GAME LOGIC ---
function startGame() {
    if (started === false) {
        started = true;
        
        // Hide ALL start/restart prompts when the game begins
        restartBtn.classList.add("hidden");
        mobileStartBtn.classList.add("hidden");
        instructions.classList.add("hidden");

        h2.classList.remove("hidden"); // Show level text
        levelUp();
    }
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randBtn);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        // --- GAME OVER & SCORE HANDLING ---
        const finalScore = level - 1; 
        h2.innerHTML = `Game Over! Your score was <b>${finalScore}</b>`;
        
        // Only show the RESTART button, not the initial start button
        restartBtn.classList.remove("hidden");
        instructions.innerText = "Press any key to restart";
        instructions.classList.remove("hidden");

        // Update scores
        if (finalScore > currentPlayerHighScore) {
            currentPlayerHighScore = finalScore;
            currentHighScoreEl.innerText = currentPlayerHighScore;
        }
        if (finalScore > allTimeHighScore) {
            allTimeHighScore = finalScore;
            allTimeScoreEl.innerText = allTimeHighScore;
            localStorage.setItem("simonHighScore", allTimeHighScore);
        }

        // Visual feedback
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = "red";
        // The reset() call is now INSIDE the setTimeout to ensure it runs
        // after the background color has changed back to white.
        setTimeout(() => { 
            document.body.style.backgroundColor = "white"; 
            reset();
        }, 500);
    }
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    // This now correctly reapplies the watermark after the game over flash
    if (userName) {
        document.body.style.backgroundImage = createWatermark(userName);
    }
}


// --- HELPER & EVENT LISTENER FUNCTIONS ---
function createWatermark(text) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" transform="rotate(-30, 150, 75)" fill="rgba(0,0,0,0.08)" font-size="24" font-family="sans-serif">${text}</text></svg>`;
    const encodedSvg = window.btoa(svg);
    return `url("data:image/svg+xml;base64,${encodedSvg}")`;
}

function gameFlash(btn) {
    btn.classList.add("bright-flash");
    setTimeout(() => { btn.classList.remove("bright-flash"); }, 500);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => { btn.classList.remove("userflash"); }, 250);
}

function btnPress() {
    if (!started) return; 
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}
