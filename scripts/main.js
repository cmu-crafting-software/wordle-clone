import("./dictionary.js");

// Make guess
const WORD_GUESS = WORDS[Math.round(Math.random() * WORDS.length - 1)];
console.log("HINT: the correct answer is: ", WORD_GUESS);

// Constants
const MatchResult = {
  GUESSED_WORD: 1,
  IS_NOT_IN_DICTIONARY: 2,
  WORD_NOT_EXIST: 3,
};

const WordEnum = {
  CORRECT: 1,
  ALMOST: 2,
  INCORRECT: 3,
};
const { CORRECT, ALMOST, INCORRECT } = WordEnum;

// HTML elements

const collection = document.querySelectorAll("#collection-row");
const messege = document.querySelector(".messege");
const virtualKeyboard = document.querySelector(".virtual-keyboard");

// Global state
let charArray = ["", "", "", "", ""];
let currentCharIdx = 0;
let guessCount = 0;

function isWord(word, dictionary) {
  return dictionary.includes(word);
}

function checkLetter(letters, word_guess) {
  const guess = word_guess;
  let arrIndex = 0;
  const arr = [...letters];
  const map = [INCORRECT, INCORRECT, INCORRECT, INCORRECT, INCORRECT];
  do {
    for (let i = 0; i <= 5; i++) {
      if (guess[arrIndex] === arr[i]) {
        if (arrIndex === i) {
          arr[i] = "";
          map[i] = CORRECT;
          continue;
        } else {
          map[i] = ALMOST;
          continue;
        }
      }
    }
    arrIndex++;
  } while (arrIndex <= 4);

  return map;
}

function matchWord(word, dictionary, word_guess) {
  if (word === word_guess) {
    return MatchResult.GUESSED_WORD;
  } else if (isWord(word, dictionary)) {
    return MatchResult.IS_IN_DICTIONARY;
  } else {
    return MatchResult.IS_NOT_IN_DICTIONARY;
  }
}

function addLetter(data) {
  if (currentCharIdx < 5) {
    charArray[currentCharIdx] = data.key;
    collection[0].children[guessCount].children[currentCharIdx].innerText =
      charArray[currentCharIdx].toUpperCase();
    collection[0].children[guessCount].children[currentCharIdx].classList.add(
      "new-border"
    );
    currentCharIdx++;
  }
}

function removeLetter() {
  if (currentCharIdx != -1) {
    // Handle when the cursor goes out of the word range (i.e. after entering the last char)
    currentCharIdx = currentCharIdx === 5 ? 4 : currentCharIdx;
    collection[0].children[guessCount].children[
      currentCharIdx
    ].classList.remove("new-border");
    charArray[currentCharIdx] = "";
    collection[0].children[guessCount].children[currentCharIdx].textContent =
      charArray[currentCharIdx];
    currentCharIdx != 0 ? currentCharIdx-- : (currentCharIdx = 0);
  }
}

function renderResult(e) {
  const guess = charArray.join("");
  const guessResult = matchWord(guess, WORDS, WORD_GUESS);

  // Check if is the correct word
  if (!(charArray[4] === "")) {
    if (guessResult === MatchResult.GUESSED_WORD) {
      for (let i = 0; i < 5; i++) {
        collection[0].children[guessCount].children[i].classList.remove(
          "new-border"
        );
        collection[0].children[guessCount].children[i].classList.add("correct");
      }
      messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You win <br/>
                <button  onclick=location.reload() class='bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;

      guessCount = 7;
      currentCharIdx = 0;
    }

    // check if is in the dictionary and check every word
    if (guessResult === MatchResult.IS_IN_DICTIONARY) {
      const result = checkLetter(guess, WORD_GUESS);
      result.forEach((value, index) => {
        if (value === CORRECT) {
          collection[0].children[guessCount].children[index].classList.remove(
            "new-border"
          );
          collection[0].children[guessCount].children[index].classList.add(
            "correct"
          );
        }
        if (value === ALMOST) {
          collection[0].children[guessCount].children[index].classList.remove(
            "new-border"
          );
          collection[0].children[guessCount].children[index].classList.add(
            "almostCorrect"
          );
        }
        if (value === INCORRECT) {
          collection[0].children[guessCount].children[index].classList.remove(
            "new-border"
          );
          collection[0].children[guessCount].children[index].classList.add(
            "incorrect"
          );
        }
      });
      charArray = ["", "", "", "", ""];
      guessCount != 7 ? guessCount++ : null;
      currentCharIdx = 0;
    }

    // is not in the dictionary and show some messege
    if (guessResult === MatchResult.IS_NOT_IN_DICTIONARY) {
      messege.innerHTML = `<p class="bg-black border border-green-600 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">Not in word list</p>`;
      setTimeout(() => {
        messege.innerHTML = ``;
      }, 3000);
    }

    if (guessCount === 6) {
      messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You lost <br/>
                <span class="text-white">WORD: <b>${WORD_GUESS.toUpperCase()}</b><span/><br/>
                <button onclick=location.reload() class='restar  bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;
    }
  }
}

// Event handlers

function handleKeyPress(e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    addLetter(e);
  } else if (e.key === "Enter") {
    renderResult();
  } else if (e.key === "Backspace") {
    removeLetter();
  }
}

function virtualToKeyCode(e) {
  if (e.target.id === "enter") {
    return {
      keyCode: 13,
      key: "Enter",
    };
  } else if (e.target.id === "delete") {
    return {
      keyCode: 08,
      key: "Backspace",
    };
  } else {
    return {
      keyCode: e.target.innerHTML.charCodeAt(),
      key: String.fromCharCode(e.target.innerHTML.charCodeAt()).toLowerCase(),
    };
  }
}

// virtual keyabord
window.addEventListener("keydown", (e) => {
  handleKeyPress(e);
});

// Virtual: top row
virtualKeyboard.children[0].addEventListener("click", (e) => {
  handleKeyPress(virtualToKeyCode(e));
});
// Virtual: middle row
virtualKeyboard.children[1].addEventListener("click", (e) => {
  handleKeyPress(virtualToKeyCode(e));
});
// Virtual: bottom row
virtualKeyboard.children[2].addEventListener("click", (e) => {
  handleKeyPress(virtualToKeyCode(e));
});
