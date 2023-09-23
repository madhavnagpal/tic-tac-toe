console.log("Hey Welcome to Tic Tac Toe👋");

const musicAudio = new Audio("music.mp3");
const turnAudio = new Audio("ting.mp3");
const gameOverAudio = new Audio("gameover.mp3");

// Using event delegation to capture event on all box, by applying event to common ancestor parent
const container = document.querySelector(".container");
const infoNode = document.querySelector(".info");
const resetButton = document.getElementById("reset");
const winningImage = document.querySelector(".excitedImg");
const lineNode = document.querySelector(".line");

// Application states
let currentTurn = "X";
let isGameOver = false;
const audioQueue = []; // Audio queue to manage audio playback

container.addEventListener("click", playGame);
resetButton.addEventListener("click", resetGame);

function changeTurn(clickedBox) {
  clickedBox.querySelector(".boxText").innerText = currentTurn;
  clickedBox.classList.add("pointerEventsNone");
  currentTurn = currentTurn === "X" ? "0" : "X";
  infoNode.innerText = "Turn for " + currentTurn;
}

const winningPatterns = [
  [0, 1, 2, 0, 45, 0],
  [3, 4, 5, 0, 135, 0],
  [6, 7, 8, 0, 225, 0],
  [0, 3, 6, -90, 135, -90],
  [1, 4, 7, 0, 135, -90],
  [2, 5, 8, 90, 135, -90],
  [0, 4, 8, 0, 135, 45],
  [2, 4, 6, 0, 135, -45],
];

function checkWin() {
  const boxTexts = document.getElementsByClassName("boxText");
  winningPatterns.forEach((winningPattern) => {
    const [
      firstWinningPosition,
      secondWinningPosition,
      thirdWinningPosition,
      translateX,
      translateY,
      rotate,
    ] = winningPattern;
    const firstWinningPositionText = boxTexts[firstWinningPosition].innerText;
    const secondWinningPositionText = boxTexts[secondWinningPosition].innerText;
    const thenWinningPositionText = boxTexts[thirdWinningPosition].innerText;
    if (
      firstWinningPositionText === secondWinningPositionText &&
      secondWinningPositionText === thenWinningPositionText &&
      firstWinningPositionText !== ""
    ) {
      // all three winning positions have same thing and not blank
      infoNode.innerText = firstWinningPositionText + " Won";
      container.removeEventListener("click", playGame);
      container.classList.add("pointerEventsNone");
      winningImage.style.width = "200px";
      isGameOver = true;
      lineNode.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
      lineNode.style.display = "block";
    }
  });
}

function playGame(event) {
  // container is clicked but not on box
  const box = event.target.closest(".box");
  if (!box) return;

  // if box is disabled, then no click
  if (box.classList.contains("pointerEventsNone")) return;

  changeTurn(box);
  checkWin();

  // Push the turnAudio to the audio queue
  //   audioQueue.push(turnAudio);

  // Check if audio is currently playing; if not, play the next audio in the queue
  //   if (audioQueue.length === 1) {
  //     playNextAudio();
  //   }
  turnAudio.play();
}

/*
    if used turnAudio.play() on change turn, then if clicked quickly
    some plays were not heard
    so used this approach of queue,
    this also has a catch, sound playes after some time, (if you click very fast)
    systme might feel slow, then might be better to throttle

    TODO: check how playstore game handles this

*/
function playNextAudio() {
  if (audioQueue.length > 0) {
    const audio = audioQueue[0];
    audio.play();
    audio.onended = function () {
      // Remove the finished audio from the queue
      audioQueue.shift();
      // Play the next audio in the queue, if any
      if (audioQueue.length > 0) {
        playNextAudio();
      }
    };
  }
}

function resetGame() {
  if (isGameOver) {
    container.addEventListener("click", playGame);
    isGameOver = false;
  }
  container.classList.remove("pointerEventsNone");
  winningImage.style.width = "0px";

  const boxes = document.getElementsByClassName("box");

  Array.from(boxes).forEach((box) => {
    box.classList.remove("pointerEventsNone");
    box.querySelector(".boxText").innerText = "";
  });
  currentTurn = "X";
  infoNode.innerText = "Turn for X";
  lineNode.style.transform = "";
  lineNode.style.display = "none";
}
