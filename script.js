

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

// 3. SEARCHING: check the input, ask the API, show the answer

async function searchWord(typedText) {
  // Clean up the input: remove extra spaces and make it lowercase
  const word = typedText.trim().toLowerCase();

  // Check 1: did the user type anything?
  if (word === "") {
    showMessage("Please type a word first.", true);
    return; // stop here
  }

  // Check 2: only letters, hyphens, and apostrophes are allowed.
  // (This pattern is called a "regular expression".)
  const looksLikeAWord = /^[a-z'-]+$/.test(word);
  if (looksLikeAWord === false) {
    showMessage("Please use letters only (no spaces, numbers, or symbols).", true);
    return;
  }

  showMessage("Looking up...", false);

  // "try" runs code that might fail; "catch" handles the failure.
  try {
    // Build the real address by replacing "<word>" with the typed word.
    // encodeURIComponent makes sure the word is safe to put in a web address.
    const url = API_URL.replace("<word>", encodeURIComponent(word));
    const response = await fetch(url);

    // 404 means "not found"
    if (response.status === 404) {
      showMessage("Sorry, no definitions found for \"" + word + "\". Check the spelling or try another word.", true);
      return;
    }

    // Any other problem (for example a server error)
    if (response.ok === false) {
      showMessage("The dictionary had a problem. Please try again in a moment.", true);
      return;
    }

    // Turn the response into a JavaScript array of entries
    const data = await response.json();

    // A word can have several entries. We show the first one.
    showWord(data[0]);

  } catch (error) {
    // We land here if the internet is down
    showMessage("Could not reach the dictionary. Check your internet connection.", true);
  }
}



