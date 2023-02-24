"use strict";
document.querySelector(".draw-button").addEventListener("click", fetchDeck);
document.querySelector(".play-again").addEventListener("click", playAgain);

function fetchDeck() {
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
    DrawCards(deckId);
   })
   .catch((err) => console.log(err));
 } else {
  const cardDeck = localStorage.getItem("deck");
  // console.log(cardDeck);
  DrawCards(cardDeck);
 }
}

function DrawCards(deckId) {
 const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

 fetch(url)
  .then((res) => (res.ok ? res.json() : new Error("something went wrong"))) // parse response as JSON
  .then((data) => {
   //  console.log(data.remaining);
   if (data.remaining === 0) {
    endGame();
   } else {
    displayCards(data);
    convertCardValues(data);
   }
  })
  .catch((err) => {
   console.log(`error ${err}`);
  });
}

function displayCards(data) {
 document.querySelector(".draw-button").innerHTML = "draw cards";
 document.querySelector("#game").classList.remove("hidden");
 const cpuCard = data.cards[0].image;
 const myCard = data.cards[1].image;
 //  console.log(cpuCard, myCard);
 document.querySelector(".cpu-card").src = cpuCard;
 document.querySelector(".my-card").src = myCard;
}

function convertCardValues(data) {
 const cpuCard = data.cards[0].value;
 const myCard = data.cards[1].value;
 let cpuCardValue = Number(cpuCard),
  myCardValue = Number(myCard);
 if (cpuCard === "JACK") cpuCardValue = 11;
 if (cpuCard === "QUEEN") cpuCardValue = 12;
 if (cpuCard === "KING") cpuCardValue = 13;
 if (cpuCard === "ACE") cpuCardValue = 14;
 if (myCard === "JACK") myCardValue = 11;
 if (myCard === "QUEEN") myCardValue = 12;
 if (myCard === "KING") myCardValue = 13;
 if (myCard === "ACE") myCardValue = 14;
 //  console.log(cpuCardValue, myCardValue);
 displayRoundWinner(cpuCardValue, myCardValue);
}

function displayRoundWinner(cpuCard, myCard) {
 let cpuScore = document.querySelector(".cpu-current");
 let myScore = document.querySelector(".my-current");
 let addToCpuScore = Number(localStorage.getItem("cpuScoreVal"));
 let addToMyScore = Number(localStorage.getItem("myScoreVal"));

 if (cpuCard > myCard) {
  addToCpuScore++;
  cpuScore.innerHTML = addToCpuScore;
  localStorage.setItem("cpuScoreVal", addToCpuScore);
 } else if (cpuCard < myCard) {
  addToMyScore++;
  myScore.innerHTML = addToMyScore;
  localStorage.setItem("myScoreVal", addToMyScore);
 }
 //  console.log(cpuScore, myScore);
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
