import { messages } from './messages.js';
import { words }  from './words.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let userLang = 'pt-BR'; // This could be determined by a user setting or browser language

function updateTexts() {
  document.getElementById("wordDisplay").textContent = messages[userLang].goodLuck;
  document.getElementById("startButton").textContent = messages[userLang].startButtonText;
  document.getElementById("wrong").querySelector('img').alt = messages[userLang].wrongImageAlt;
  document.getElementById("correct").querySelector('img').alt = messages[userLang].correctImageAlt;

  // Update other static texts similarly
}

updateTexts();

if (!SpeechRecognition) {
  alert("Speech recognition not available. Please use Google Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  recognition.continuous = false; // Automatically stop after capturing a phrase

  let isListening = false;

  function pickNewWord() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById("wordDisplay").textContent = randomWord;
  }

  recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    const displayedWord = document.getElementById("wordDisplay").textContent.toLowerCase().trim();
    const feedbackElement = document.getElementById("feedback");
    const correct = document.getElementById("correct");
    const wrong = document.getElementById("wrong");
    const startButton = document.getElementById("startButton");
    feedbackElement.style.display = "block";

    if (spokenWord === displayedWord) {
      feedbackElement.textContent = messages[userLang].congrats + spokenWord.toUpperCase();
      correct.style.display = "block";
      wrong.style.display = "none";
      startButton.textContent = messages[userLang].nextWord;
    } else {
      feedbackElement.textContent = messages[userLang].tryAgain + spokenWord.toUpperCase();
      correct.style.display = "none";
      wrong.style.display = "block";
      startButton.textContent = messages[userLang].nextWord;
    }
    isListening = false;    
  };

  recognition.onerror = function(event) {
    alert(`Error occurred in recognition: ${event.error}`);
  };

  document.getElementById("startButton").addEventListener('click', function() {
    if (isListening) {
      recognition.stop();
      this.textContent = messages[userLang].startSpeaking;
    } else {
      recognition.start();
      this.textContent = messages[userLang].speakAndWait;
      document.getElementById("wrong").style.display = "none";
      document.getElementById("correct").style.display = "none";
      document.getElementById("feedback").textContent = "";
      document.getElementById("feedback").style.display = "none";
    }
    isListening = !isListening;
    pickNewWord();
  });
}
