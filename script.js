

//  Project expectations;
//     1. The user types a word and submits the form.
//     2. We ask the dictionary API for that word.
//     3. The API answers with data (JSON).
//     4. We manipulate the DOM from that data and show it on the page.

// 1. SETUP

// "<word>" is a placeholder: before each search we swap it for the word the user typed.
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/<word>";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsSection = document.getElementById("results");


// 2. EVENTS

// When the form is submitted (Enter key or button click)...
searchForm.addEventListener("submit", function (event) {

  event.preventDefault();

  searchWord(searchInput.value);
});

// The results change every search, so instead of adding listeners to each new
// button, we listen for clicks on the whole results section and check what was clicked.
resultsSection.addEventListener("click", function (event) {
  const clicked = event.target;

  // If a synonym button was clicked, search for that synonym
  if (clicked.classList.contains("chip")) {
    const synonym = clicked.dataset.word;
    searchInput.value = synonym;
    searchWord(synonym);
  }

  // If the play button was clicked, play the sound
  if (clicked.id === "audio-button") {
    playAudio(clicked.dataset.audio);
  }
});


