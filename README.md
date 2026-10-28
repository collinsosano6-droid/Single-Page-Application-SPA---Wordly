# Single-Page-Application-SPA---Wordly

# Word Lookup

A simple dictionary web app. Type an English word and see its **pronunciation**, **definitions**, and **synonyms**. You can also click a button to **hear the word** spoken.

It is built with only three languages (no frameworks, nothing to install):

- **HTML** for the structure of the page
- **CSS** for the colors and layout
- **JavaScript** for the behavior

The word data comes from the free [Free Dictionary API](https://dictionaryapi.dev/). You don't need an account or an API key.

---

## What it can do

- Search for any English word
- Show the written pronunciation (for example `/ˈhæpi/`)
- Play an audio recording of the word, when one exists
- Show definitions grouped by part of speech (noun, verb, adjective, ...)
- Show example sentences, when the dictionary has them
- Show synonyms as buttons. Click one to look up that word.
- Show friendly messages instead of breaking when:
  - the search box is empty
  - the input has numbers or symbols
  - the word isn't in the dictionary
  - the internet is down
  - a word has no audio, no pronunciation, or no synonyms

---

## Project files

```
dictionary-beginner/
├── index.html    ← the page structure (header, search form, results area, footer)
├── style.css     ← the design (colors, spacing, animations)
├── script.js     ← the code that talks to the API and shows the results
└── README.md     ← this file
```

All three of `index.html`, `style.css`, and `script.js` must stay **in the same folder**, because `index.html` loads the other two by name.

---

## How to run it

1. Download or copy the folder to your computer.
2. Double-click `index.html`. It opens in your web browser.
3. Type a word (try `happy`) and press **Enter** or click **Look up**.

You need an internet connection, because the app asks the dictionary API for each word.

### If searches don't work when you double-click the file

Some browsers block requests from pages opened straight from a folder. If that happens, run a tiny local web server:

1. Open a terminal or command prompt inside the project folder.
2. Run one of these:
   - Mac or Linux: `python3 -m http.server`
   - Windows: `python -m http.server`
3. Open `http://localhost:8000` in your browser.

(If you use VS Code, the **Live Server** extension does the same job.)

---

## How it works

When you search for a word, this happens:

1. **You submit the form.** JavaScript listens for the form's `submit` event and stops the page from reloading.
2. **The input is checked.** An empty box or a word with numbers or symbols gets an error message instead.
3. **The app asks the API.** The `API_URL` in `script.js` has a `<word>` placeholder. The code swaps in your word and calls `fetch()`:

   ```
   https://api.dictionaryapi.dev/api/v2/entries/en/happy
   ```

4. **The API answers with JSON**, which is a list of information about the word.
5. **The code builds HTML** from that data (word, pronunciation, meanings, synonyms) and puts it into the results area on the page.

### What each file does

| File | Language | Job |
|---|---|---|
| `index.html` | HTML | Defines the header, search form, results area, and footer |
| `style.css` | CSS | Makes it look good: gradient banner, white result card, hover effects, footer, phone layout |
| `script.js` | JavaScript | Handles searching, error messages, audio, and displaying results |

### The main functions in `script.js`

| Function | What it does |
|---|---|
| `searchWord()` | Checks the input, calls the API, and handles errors |
| `showWord()` | Builds the result card for one word |
| `buildMeaning()` | Builds one noun/verb/adjective section with its definitions and synonyms |
| `showMessage()` | Shows a plain message such as "Looking up..." or an error |
| `playAudio()` | Plays the pronunciation sound |
| `escapeHtml()` | Makes text from the internet safe to put on the page |

---

## Make it your own

**Change the colors.** Open `style.css` and edit the variables at the very top:

```css
:root {
  --navy: #14213d;
  --blue: #2b4bff;
  ...
}
```

For example, change `--blue` to `#0f9d58` for a green theme.

**Change the text.** Edit the title, tagline, and footer text in `index.html`.

**Show more synonyms.** In `script.js`, find `i < 8` in the synonym loop and change `8` to a bigger number.

---

## Known limits

- Only **single words** work. Two-word entries like "ice cream" are rejected.
- Only the **first entry** the API returns for a word is shown.
- If you start a new search while a slow one is still loading, the slow one may replace your newer result.
- Some words have no audio or no synonyms. The app tells you instead of showing an empty space.
- The API is a free service run by someone else, so it can be slow, change, or go offline.

---

## Ideas to practice with

- Add a "recent searches" list
- Add antonyms next to the synonyms
- Add a dark mode with `@media (prefers-color-scheme: dark)`
- Allow two-word searches
- Add a loading spinner while the app waits for the API

---

## Credits

- Word data: [Free Dictionary API](https://dictionaryapi.dev/), which gets its definitions from [Wiktionary](https://en.wiktionary.org/) (licensed CC BY-SA)