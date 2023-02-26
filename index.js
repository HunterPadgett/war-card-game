"use strict";
document.querySelector(".draw-button").addEventListener("click", fetchDeck);
document.querySelector(".play-again").addEventListener("click", playAgain);
document.addEventListener("DOMContentLoaded", loadHighscores);

function fetchDeck() {
 document.querySelector(".my-war-card").classList.remove("show");
 document.querySelector(".cpu-war-card").classList.remove("show");
 document.querySelector(".text-area").classList.remove("show");
 let deckId = "";

 if (!localStorage.getItem("deck")) {
  fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
   .then((res) => (res.ok ? res.json() : new Error("something went wrong")))
   .then((data) => {
    deckId = data.deck_id;
    localStorage.setItem("deck", deckId);
    localStorage.setItem("cpuScoreVal", 0);
    localStorage.setItem("myScoreVal", 0);
    document.querySelector(".cpu-current").textContent = "0";
    document.querySelector(".my-current").textContent = "0";
    drawCards(deckId);
   })
   .catch((err) => console.log(err));
 } else {
  const cardDeck = localStorage.getItem("deck");
  // console.log(cardDeck);
  drawCards(cardDeck);
 }
}

function drawCards(deckId) {
 const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

 fetch(url)
  .then((res) => (res.ok ? res.json() : new Error("something went wrong"))) // parse response as JSON
  .then((data) => {
   //  console.log(data.remaining);
   if (data.remaining === 0) {
    endGame();
   } else {
    displayCards(data);
   }
  })
  .catch((err) => {
   console.log(`error ${err}`);
  });
}

function displayCards(data) {
 //  const cards = data.cards;
 const cpuCard = data.cards[0];
 const myCard = data.cards[1];
 document.querySelector(".draw-button").innerHTML = "draw cards";
 document.querySelector("#game").classList.remove("hidden");
 document.querySelector(".current-scores").classList.remove("hidden");
 document.querySelector(".cpu-card").src = cpuCard.image;
 document.querySelector(".my-card").src = myCard.image;
 convertCardValues(cpuCard, myCard);
}

function convertCardValues(cpuCard, myCard) {
 const cpuCardCheck = cpuCard.value;
 const myCardCheck = myCard.value;
 let cpuCardValue = Number(cpuCard.value),
  myCardValue = Number(myCard.value);
 if (cpuCardCheck === "JACK") cpuCardValue = 11;
 if (cpuCardCheck === "QUEEN") cpuCardValue = 12;
 if (cpuCardCheck === "KING") cpuCardValue = 13;
 if (cpuCardCheck === "ACE") cpuCardValue = 14;
 if (myCardCheck === "JACK") myCardValue = 11;
 if (myCardCheck === "QUEEN") myCardValue = 12;
 if (myCardCheck === "KING") myCardValue = 13;
 if (myCardCheck === "ACE") myCardValue = 14;
 displayRoundWinner(cpuCardValue, myCardValue);
}

function displayRoundWinner(cpuCardValue, myCardValue) {
 let cpuScore = document.querySelector(".cpu-current");
 let myScore = document.querySelector(".my-current");
 let addToCpuScore = Number(localStorage.getItem("cpuScoreVal"));
 let addToMyScore = Number(localStorage.getItem("myScoreVal"));

 if (cpuCardValue > myCardValue) {
  addToCpuScore++;
  cpuScore.innerHTML = addToCpuScore;
  localStorage.setItem("cpuScoreVal", addToCpuScore);
 } else if (cpuCardValue < myCardValue) {
  addToMyScore++;
  myScore.innerHTML = addToMyScore;
  localStorage.setItem("myScoreVal", addToMyScore);
 } else {
  war();
 }
}

function war() {
 const deckId = localStorage.getItem("deck");
 const myWarDraw = document.querySelector(".my-war-card");
 const cpuWarDraw = document.querySelector(".cpu-war-card");

 document.querySelector(".text-area").classList.add("show");

 setTimeout(() => {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
   .then((res) => (res.ok ? res.json() : new Error("something went wrong"))) // parse response as JSON
   .then((data) => {
    console.log(data);
    // myWarDraw.classList.remove("really-hidden");
    // cpuWarDraw.classList.remove("really-hidden");
    myWarDraw.classList.add("show");
    cpuWarDraw.classList.add("show");
    myWarDraw.src = data.cards[0].image;
    cpuWarDraw.src = data.cards[1].image;
    convertCardValues(data.cards[1], data.cards[0]);
   })
   .catch((err) => {
    console.log(`error ${err}`);
   });
 }, 500);
}

function endGame() {
 const winner = document.querySelector(".game-winner");
 const mySection = document.querySelector(".display");
 mySection.style.position = "relative";
 mySection.style.top = "180px";
 winner.classList.remove("really-hidden");
 document.querySelector(".draw-button").classList.add("hidden");
 document.querySelector(".play-again").classList.remove("really-hidden");
 document.querySelector(".game").classList.add("hidden");
 const cpuScore = Number(localStorage.getItem("cpuScoreVal"));
 const myScore = Number(localStorage.getItem("myScoreVal"));

 if (cpuScore > myScore) {
  winner.textContent = "YOU LOST";
  storeLose();
 } else if (cpuScore < myScore) {
  winner.textContent = "YOU WON";
  storeWin();
 } else {
  winner.textContent = "TIE GAME";
 }

 localStorage.removeItem("deck");
 localStorage.setItem("cpuScoreVal", 0);
 localStorage.setItem("myScoreVal", 0);
}

function storeLose() {
 const totalLoses = document.querySelector(".total-loses");
 if (!localStorage.getItem("myLoses")) {
  localStorage.setItem("myLoses", 1);
  let MylosesVal = Number(localStorage.getItem("myLoses"));
  totalLoses.innerHTML = MylosesVal;
 } else {
  let MylosesVal = Number(localStorage.getItem("myLoses"));
  MylosesVal++;
  totalLoses.innerHTML = MylosesVal;
  localStorage.setItem("myLoses", MylosesVal);
 }
}

function storeWin() {
 const totalWins = document.querySelector(".total-wins");
 if (!localStorage.getItem("myWins")) {
  localStorage.setItem("myWins", 1);
  let MyWinsVal = Number(localStorage.getItem("myWins"));
  totalWins.innerHTML = MyWinsVal;
 } else {
  let MyWinsVal = Number(localStorage.getItem("myWins"));
  MyWinsVal++;
  totalWins.innerHTML = MyWinsVal;
  localStorage.setItem("myWins", MyWinsVal);
 }
}

function playAgain() {
 const mySection = document.querySelector(".display");
 document.querySelector(".game-winner").classList.add("really-hidden");
 document.querySelector(".play-again").classList.add("really-hidden");
 document.querySelector(".draw-button").classList.remove("hidden");
 mySection.style.position = "";
 mySection.style.top = "";
 fetchDeck();
}

function loadHighscores() {
 const totalLoses = document.querySelector(".total-loses");
 const totalWins = document.querySelector(".total-wins");
 document.querySelector(".current-scores").classList.add("hidden");

 if (localStorage.getItem("myLoses")) {
  let MylosesVal = Number(localStorage.getItem("myLoses"));
  totalLoses.innerHTML = MylosesVal;
 }

 if (localStorage.getItem("myLoses")) {
  let MyWinsVal = Number(localStorage.getItem("myWins"));
  totalWins.innerHTML = MyWinsVal;
 }
}
