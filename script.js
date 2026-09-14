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
  {
    id: 6,
    text: "Kod jest dobry, tylko środowisko nie współpracuje.",
    category: "Produkcja",
  },
  {
    id: 7,
    text: "Ten fragment był już taki, kiedy otworzyłem projekt.",
    category: "Kod",
  },
  {
    id: 8,
    text: "Git twierdzi, że nie ma konfliktu, więc mu wierzę.",
    category: "Git",
  },
  {
    id: 9,
    text: "Po wyczyszczeniu cache powinno działać. Prawdopodobnie.",
    category: "Cache",
  },
  {
    id: 10,
    text: "Aktualizacja naprawiła błąd, dodając dwa nowe.",
    category: "Aktualizacja",
  },
  {
    id: 11,
    text: "To działa asynchronicznie. Bardzo asynchronicznie.",
    category: "Kod",
  },
  {
    id: 12,
    text: "Produkcja ma inne poczucie humoru niż środowisko testowe.",
    category: "Produkcja",
  },
  {
    id: 13,
    text: "Commit był poprawny, zanim został zmergowany.",
    category: "Git",
  },
  {
    id: 14,
    text: "Przeglądarka pamięta poprzednią wersję lepiej niż ja.",
    category: "Cache",
  },
  {
    id: 15,
    text: "Dokumentacja nie przewidziała tak kreatywnego użycia.",
    category: "Kod",
  },
];

console.log(excuses.length);
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
let lastDrawnExcuseId = null;

function hideCopyMessage() {
  clearTimeout(copyMessageTimeoutId);
  copyMessage.textContent = "";
}

function drawExcuse() {
  hideCopyMessage();

  if (availableExcuses.length === 0) {
    availableExcuses = [...excuses];
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * availableExcuses.length);
  } while (
    availableExcuses.length > 1 &&
    availableExcuses[randomIndex].id === lastDrawnExcuseId
  );

  const [randomExcuse] = availableExcuses.splice(randomIndex, 1);

  lastDrawnExcuseId = randomExcuse.id;

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
