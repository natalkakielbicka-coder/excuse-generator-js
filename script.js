"use strict";

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

let availableExcuses = [...excuses];
let activeCategory = "all";

const uniqueCategories = [...new Set(excuses.map((excuse) => excuse.category))];

const ACTIVE_CATEGORY_STORAGE_KEY = "activeCategory";
const LAST_EXCUSE_STORAGE_KEY = "lastExcuse";

const excuseNumber = document.querySelector("#excuse-number");
const excuseCategory = document.querySelector("#excuse-category");
const excuseText = document.querySelector("#excuse-text");
const drawButton = document.querySelector("#draw-button");
const copyButton = document.querySelector("#copy-button");
const copyMessage = document.querySelector("#copy-message");
const categoryFilter = document.querySelector("#category-filter");

uniqueCategories.forEach((category) => {
  const categoryOption = document.createElement("option");

  categoryOption.value = category;
  categoryOption.textContent = category;

  categoryFilter.append(categoryOption);
});

function getExcusesByCategory(category) {
  if (category === "all") {
    return [...excuses];
  }

  return excuses.filter((excuse) => excuse.category === category);
}

function restoreSavedCategory() {
  const savedCategory = localStorage.getItem(ACTIVE_CATEGORY_STORAGE_KEY);

  const isSavedCategoryValid =
    savedCategory === "all" || uniqueCategories.includes(savedCategory);

  if (!isSavedCategoryValid) {
    return;
  }

  activeCategory = savedCategory;
  categoryFilter.value = savedCategory;
  availableExcuses = getExcusesByCategory(savedCategory);
}

function restoreLastExcuse() {
  const savedExcuse = localStorage.getItem(LAST_EXCUSE_STORAGE_KEY);

  if (!savedExcuse) {
    return false;
  }

  let parsedExcuse;

  try {
    parsedExcuse = JSON.parse(savedExcuse);
  } catch (error) {
    localStorage.removeItem(LAST_EXCUSE_STORAGE_KEY);

    console.error("Nie udało się odczytać zapisanej wymówki.", error);

    return false;
  }

  const matchingExcuse = excuses.find(
    (excuse) => excuse.id === parsedExcuse.id,
  );

  if (!matchingExcuse) {
    return false;
  }

  const matchesActiveCategory =
    activeCategory === "all" || matchingExcuse.category === activeCategory;

  if (!matchesActiveCategory) {
    return false;
  }

  lastDrawnExcuseId = matchingExcuse.id;

  availableExcuses = availableExcuses.filter(
    (excuse) => excuse.id !== matchingExcuse.id,
  );

  displayExcuse(matchingExcuse);

  return true;
}

function handleCategoryChange(event) {
  const selectedCategory = event.target.value;

  activeCategory = selectedCategory;

  localStorage.setItem(ACTIVE_CATEGORY_STORAGE_KEY, activeCategory);

  availableExcuses = getExcusesByCategory(activeCategory);

  drawExcuse();
}

function displayExcuse(excuse) {
  excuseNumber.textContent = `Wymówka #${String(excuse.id).padStart(2, "0")}`;
  excuseCategory.textContent = `Kategoria: ${excuse.category}`;
  excuseText.textContent = excuse.text;

  excuseText.classList.add("is-changing");
}

function handleExcuseAnimationEnd() {
  excuseText.classList.remove("is-changing");
}

function handleKeyboardShortcut(event) {
  const pressedKey = event.key.toLowerCase();

  if (pressedKey !== "n") {
    return;
  }

  if (event.repeat) {
    return;
  }

  if (event.target.matches("input, textarea, select")) {
    return;
  }

  drawExcuse();
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
    availableExcuses = getExcusesByCategory(activeCategory);
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

  const serializedExcuse = JSON.stringify(randomExcuse);

  localStorage.setItem(LAST_EXCUSE_STORAGE_KEY, serializedExcuse);

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
categoryFilter.addEventListener("change", handleCategoryChange);
excuseText.addEventListener("animationend", handleExcuseAnimationEnd);
document.addEventListener("keydown", handleKeyboardShortcut);

restoreSavedCategory();

const wasLastExcuseRestored = restoreLastExcuse();

if (!wasLastExcuseRestored) {
  drawExcuse();
}
