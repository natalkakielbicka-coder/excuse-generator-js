"use strict";

// Etap 1: w kolejnym kroku zapiszemy tutaj dane pojedynczej wymówki.
// Na razie interfejs jest celowo statyczny — najpierw poznajemy strukturę projektu.

const excuses = [
  {
    id: 1,
    text: "Na localhost działało, ale produkcja wyczuła strach.",
    category: "Produkcja",
  },
  {
    id: 2,
    text: "To nie jest błąd. To nieudokumentowana funkcja.",
    category: "Kod",
  },
  {
    id: 3,
    text: "Działało, zanim ktoś zrobił aktualizację.",
    category: "Aktualizacja",
  },
  {
    id: 4,
    text: "Cache jeszcze nie zaakceptował nowej rzeczywistości.",
    category: "Cache",
  },
  {
    id: 5,
    text: "To prawdopodobnie przez retrogradację Merkurego w repozytorium.",
    category: "Git",
  },
];

let availableExcuses = [...excuses];

const excuseNumber = document.querySelector("#excuse-number");
const excuseCategory = document.querySelector("#excuse-category");
const excuseText = document.querySelector("#excuse-text");
const drawButton = document.querySelector("#draw-button");
const copyButton = document.querySelector("#copy-button");
const copyMessage = document.querySelector("#copy-message");

function displayExcuse(excuse) {
  excuseNumber.textContent = `Wymówka #${String(excuse.id).padStart(2, "0")}`;
  excuseCategory.textContent = `Kategoria: ${excuse.category}`;
  excuseText.textContent = excuse.text;
}

let copyMessageTimeoutId;

function hideCopyMessage() {
  clearTimeout(copyMessageTimeoutId);
  copyMessage.textContent = "";
}

function drawExcuse() {
  hideCopyMessage();

  if (availableExcuses.length === 0) {
    availableExcuses = [...excuses];
  }

  const randomIndex = Math.floor(Math.random() * availableExcuses.length);

  const removedExcuses = availableExcuses.splice(randomIndex, 1);
  const randomExcuse = removedExcuses[0];

  displayExcuse(randomExcuse);
}

function showCopyMessage(message) {
  copyMessage.textContent = message;

  clearTimeout(copyMessageTimeoutId);

  copyMessageTimeoutId = setTimeout(hideCopyMessage, 3000);
}

async function copyExcuse() {
  try {
    await navigator.clipboard.writeText(excuseText.textContent);

    showCopyMessage("Wymówka została skopiowana!");
  } catch (error) {
    showCopyMessage("Nie udało się skopiować wymówki.");

    console.error(error);
  }
}

drawButton.addEventListener("click", drawExcuse);
copyButton.addEventListener("click", copyExcuse);

drawExcuse();
