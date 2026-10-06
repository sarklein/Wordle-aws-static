var wordArr = ["poops", "rocks", "juice", "roses", "child", "chick", "lists", "chips",
  "wrist", "chase", "whips", "shoes", "sorry", "prowl", "piece", "chess", "moose", "loose",
  "stick", "video", "spool", "cereal", "grade", "stars", "viper", "snake", "light",
  "penny", "hands", "shark"];

// arrow function: picks a random word from wordArr and lowercases it.
// Math.floor()rounds down 
var getWord = () => wordArr[Math.floor(Math.random() * wordArr.length)].toLowerCase();

// Sets answer for the CURRENT game
var answer = getWord();
console.log(answer);

//Tracks which row the players next guess will be for
var currentRow = 0;

//Builds one row of five empty cells
function createWord(row) {
  var rowcall = '<div class="row">';

  for (let col = 0; col < 5; col++) {
    var position = "r" + row + "c" + col; //Builds an id for each cell
    rowcall += '<div class="cell" id="' + position + '"></div>';
  }

  rowcall += '</div>';

  document.getElementById("board").innerHTML += rowcall;
}

//Builds the six rows on the board
for (let i = 0; i < 6; i++) {
  createWord(i);
}

//Keyboard layout on screen
var keyRows = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM"
];

//Builds the on screen keyboard from keyRows, gets called again on restart for a rebuild cleaning up colors
function createKeys() {
  var keyboard = " ";
//Outer Loop that passes 3 times, once for each row on keyboard creating a class
  keyRows.forEach(function(row) {
    keyboard += '<div class="key-row">';

//Inner loop, one pass per letter within each row
//row.split turns the string of letters into single chars
    row.split("").forEach(function(letter) {

      //Gives each key a id "keyA" in order to reference for correct color assignment
      keyboard += '<div class="perKey" id="key' + letter + '">' + letter + '</div>';
    });
    keyboard += '</div>';
  });

  document.getElementById("Keyboard").innerHTML = keyboard;
}
createKeys();

//Compares a guessed word against the answer and returns each letters status (correct, no in word, wrong place)
//Checks each letters status if it has been used or not and handles duplicate letters
function letterUse(word, answer) {
  var letterUpdate = new Array(word.length); //slot for each letter to be given a status
  var answerBox = answer.split(""); //letters that have not been used
  var wordLetter = word.split(""); //guessed word split into individual letters

  //Pass one: comparing letter slots
  wordLetter.forEach(function(letter, i) {
    if (letter == answer[i]) {
      letterUpdate[i] = "correct";
      answerBox[i] = null; //letter was used, therefore can't be matched again
    }
  });

  //Pass two: for anthing that wasn't given a "correct status," it checks what's left in the answerBox
  wordLetter.forEach(function(letter, i) {
    if (letterUpdate[i]) return; //letter was marked correct in pass one so SKIP

  //indexOf returns position of letter in the answerBox or -1 if it's not there anymore
    var answerIndex = answerBox.indexOf(letter);
    if (answerIndex !== -1) {
      letterUpdate[i] = "wrong place";
      answerBox[answerIndex] = null;
    } else {
      letterUpdate[i] = "not in word";
    }
  });

  return letterUpdate; 
}

// checks with the dictionary API whether a word is real... EXTRA CREDIT
function Wordcheck(word) {
  return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    .then(response => {
    console.log("status 200 or 404:", response.status);
    return response.ok;
    })
    .catch(error => {
      console.log("API error", error);
      return true;
    });
}

document.getElementById("submit").onclick = function() {
  var word = document.getElementById("word").value.toLowerCase();

  if (word.length != 5) {
    alert("Error, your word is not 5 letters long, try again");
    return;
  }

  //Function that relies on the API call result in .then() callback to check if word is valid or not
  Wordcheck(word).then(function(valid) {
    if (!valid) {
      alert("Error, '" + word + "' is not a valid word, try again please");
      return;
    }

    var message = "";
    var letterUpdate = letterUse(word, answer); 

    // Loops through each letter and fills in the cell color on the board 
    // Colors the matching keyboard key, and posts the letter update alert message
      word.split("").forEach(function(letter, i) {
      var status = letterUpdate[i]; 
      var cellSpot = "r" + currentRow + "c" + i;
      var cell = document.getElementById(cellSpot);
      cell.innerHTML = letter; 

      var keyLetter = document.getElementById("key" + letter.toUpperCase());

      if (status == "correct") {
        message += letter + ": correct\n";
        cell.classList.add("correct");
        keyLetter.classList.remove("wrong-place", "not-in-word");
        keyLetter.classList.add("correct");

      } else if (status == "wrong place") {
        message += letter + ": wrong place\n";
        cell.classList.add("wrong-place");

      //Only color the key if it isn't already marked correct
        if (!keyLetter.classList.contains("correct")) {
          keyLetter.classList.add("wrong-place");
        }

      } else {
        message += letter + ": not-in-word\n";
        cell.classList.add("not-in-word");

        //Only color purple if key is not yet correct or in the wrong place
        if (!keyLetter.classList.contains("correct") && !keyLetter.classList.contains("wrong-place")) {
          keyLetter.classList.add("not-in-word");
        }
      }
    });

    alert(message); //shows status of each 5 letters per guess

    if (word == answer) {
      alert("You Win: " + answer + " is correct!");
      document.getElementById("restart").style.display = "inline-block";
      return;
    }

    currentRow++;

    if (currentRow == 6 && word != answer) {
      alert("Game Over- the correct word is: " + answer);
      document.getElementById("restart").style.display = "inline-block";
    }
  }); 
};

document.getElementById("restart").onclick = function() {
  document.getElementById("board").innerHTML = ""; //Clean the old board 

  currentRow = 0; //start at row 0 for new game
  answer = getWord(); //chooses new random answer

  for (let i = 0; i < 6; i++) {
    createWord(i); //rebuilds  6 empty rows
  }

  createKeys(); //rebuilds the keyboard cleaned
  document.getElementById("word").value = ""; //clears user textbox
  document.getElementById("restart").style.display = "none"; //hides restart button until game ends
};











