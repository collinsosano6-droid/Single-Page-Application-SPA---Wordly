

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

  event.preventDefault(); // prevents default 

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


// 4. SHOWING RESULTS: turn the API data into HTML

// Shows a plain message (used for hints and errors)
function showMessage(text, isError) {
  let cssClass = "message";
  if (isError) {
    cssClass = "message error";
  }
  resultsSection.innerHTML = "<p class=\"" + cssClass + "\">" + escapeHtml(text) + "</p>";
}

// Builds the card for one word
function showWord(entry) {
  // ----- Pronunciation: find the first written pronunciation and the first audio file -----
  let phoneticText = entry.phonetic || ""; // "||" means "or use this if the left side is empty"
  let audioUrl = "";

  // A "for" loop visits each item in a list one at a time
  const phonetics = entry.phonetics || [];
  for (let i = 0; i < phonetics.length; i++) {
    if (phoneticText === "" && phonetics[i].text) {
      phoneticText = phonetics[i].text;
    }
    if (audioUrl === "" && phonetics[i].audio) {
      audioUrl = phonetics[i].audio;
    }
  }

  // ----- Start building the HTML for the card -----
  let html = "<article class=\"card\">";
  html += "<h2 class=\"word\">" + escapeHtml(entry.word) + "</h2>";

  // Fallback: if there is no pronunciation, say so
  if (phoneticText !== "") {
    html += "<span class=\"phonetic\">" + escapeHtml(phoneticText) + "</span>";
  } else {
    html += "<span class=\"phonetic\">Pronunciation not available</span>";
  }

  // Only show the play button if there is an audio file
  if (audioUrl !== "") {
    html += "<button id=\"audio-button\" type=\"button\" data-audio=\"" + escapeHtml(audioUrl) + "\">&#9654; Play</button>";
  } else {
    html += "<p class=\"note\">No audio available for this word.</p>";
  }

  // ----- One block for each meaning (noun, verb, adjective...) -----
  const meanings = entry.meanings || [];
  for (let i = 0; i < meanings.length; i++) {
    html += buildMeaning(meanings[i]);
  }

  html += "</article>";

  // Put the finished HTML on the page
  resultsSection.innerHTML = html;
}

// Builds the HTML for one meaning
function buildMeaning(meaning) {
  let html = "<section class=\"meaning\">";
  html += "<h3 class=\"part-of-speech\">" + escapeHtml(meaning.partOfSpeech) + "</h3>";

  // The definitions, as a numbered list
  html += "<ol>";
  const definitions = meaning.definitions || [];
  for (let i = 0; i < definitions.length; i++) {
    html += "<li>" + escapeHtml(definitions[i].definition);

    // Some definitions have an example sentence, some don't
    if (definitions[i].example) {
      html += "<span class=\"example\">\"" + escapeHtml(definitions[i].example) + "\"</span>";
    }
    html += "</li>";
  }
  html += "</ol>";

  // Synonyms may be listed for the whole meaning or inside each definition,
  // so we collect them all in one list, skipping duplicates.
  const synonyms = [];
  const meaningSynonyms = meaning.synonyms || [];
  for (let i = 0; i < meaningSynonyms.length; i++) {
    synonyms.push(meaningSynonyms[i]);
  }
  for (let i = 0; i < definitions.length; i++) {
    const defSynonyms = definitions[i].synonyms || [];
    for (let j = 0; j < defSynonyms.length; j++) {
      if (synonyms.includes(defSynonyms[j]) === false) {
        synonyms.push(defSynonyms[j]);
      }
    }
  }

  // Fallback: show synonym buttons if we have some, otherwise a short note
  if (synonyms.length > 0) {
    html += "<div class=\"synonyms\">Synonyms: ";
    // Show at most 8 so the list doesn't get too long
    for (let i = 0; i < synonyms.length && i < 8; i++) {
      html += "<button type=\"button\" class=\"chip\" data-word=\"" + escapeHtml(synonyms[i]) + "\">" + escapeHtml(synonyms[i]) + "</button>";
    }
    html += "</div>";
  } else {
    html += "<p class=\"note\">No synonyms listed.</p>";
  }

  html += "</section>";
  return html;
}



// ---------------------------------------------------------------
// 5. AUDIO
// ---------------------------------------------------------------

function playAudio(url) {
  const sound = new Audio(url); // create an audio player for the file
  sound.play();                 // start playing it
}

// ---------------------------------------------------------------
// 6. SAFETY HELPER
// ---------------------------------------------------------------

// Before we put text from the internet into our page as HTML, we replace special
// characters like < and > so they can't be treated as code.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}