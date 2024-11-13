let currentRow = 0;
const inputs = document.querySelectorAll('.letter-box input');
const rowLength = 5;


// Handle input by automatically move to the next box
inputs.forEach((input, index) => {
    input.addEventListener('input', (event)=> {
        if (input.value.length === 1) {
            // Get the next box
            const nextInput = inputs[index + 1];
            if (nextInput && (index + 1) % rowLength !== 0) {
                // Move to the next row
                nextInput.focus();
            }
        }
    });
});

inputs.forEach((input, index) => {
    input.addEventListener('keydown', async (event) => {
        // To append to the next row and validate guess
        if (event.key === 'Enter') {
            const guessWord = AppendGuess();

            if (guessWord) {
                const dailyWord = await getDailyWord();
                checkWord(guessWord, dailyWord);
                highlightLetters(guessWord, dailyWord);
                
            }
        }

        // To delete the inputted letters
        if (event.key === 'Backspace' || event.key === 'Delete') {
            deleteGuess(event, index);
        }
    });
});

function AppendGuess() {
    const rowStart = currentRow * rowLength;
    const rowEnd = rowStart + rowLength;
    const currentRowInputs = Array.from(inputs).slice(rowStart, rowEnd);

    // Map each input value to a letter, then join them to form the word
    const guessWord = currentRowInputs.map(input => input.value).join('');
    return guessWord;
}

function deleteGuess(event, index) {
    event.preventDefault(); 
    // Remove the last character from the input field
    let currentBox = event.target;
    let previousBox = inputs[index - 1];
    if (currentBox.value === '' && previousBox) {
        previousBox.focus();
        previousBox.value = '';
    }
    else
        currentBox.value = '';
}


//Get word of the day
async function getDailyWord() {
    const GET_WORD = "https://words.dev-apis.com/word-of-the-day"
    const promise = await fetch(GET_WORD);
    const processedResponse = await promise.json();
    const word = processedResponse.word;

    console.log(word);

    return word;
}

// Check word entered is the WOTD
async function checkWord(guessWord, dailyWord) {

    if (guessWord === dailyWord) {
        console.log("You won!");
    }
    else {
        console.log("You lost!");
    }
}

function highlightLetters (guessWord, dailyWord) {
    const rowStartGreen = currentRow * rowLength;
    const rowEndGreen = rowStartGreen + rowLength;
    const currentRowInputs = Array.from(inputs).slice(rowStartGreen, rowEndGreen);
    console.log(currentRowInputs);

    //Check for green letters
    const unmatchedLetters = [];
    for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i] === dailyWord[i]) {
            currentRowInputs[i].classList.add('correct');
        }
        else {
            unmatchedLetters.push(dailyWord[i]);
        }
    }

    //Check for yellow letters and grey
    for (let i = 0; i < guessWord.length; i++) {
        if (!currentRowInputs[i].classList.contains('correct')) { //Skips already matched letters
            const letterIndex = unmatchedLetters.indexOf(guessWord[i]);
            if (letterIndex !== -1) {
                currentRowInputs[i].classList.add('unmatched');
                unmatchedLetters.splice(letterIndex, 1);
            }
            else 
                currentRowInputs[i].classList.add('incorrect');  
        }
    }
    
    //Go to the next row
    const isRowComplete = currentRowInputs.every(input => input.value !== '');
    if (isRowComplete) {
        currentRow++;

        const nextRowStart = currentRow * rowLength; // Get the first input of the next row
        if (nextRowStart < inputs.length) { // Make sure the next row exists
            inputs[nextRowStart].focus(); // Focus the first input of the next row
        }
    }
}

// Validate Entered Word
async function validateWord(word) {
    try {
        const response = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' //Indicate JSON data in the request
            },
            body: JSON.stringify({ word: word }) // Convert the word to JSON
            });

            const data = await response.json() //Parse the JSON response
            const isValid = data.validWord;

            console.log(`Is "${word}" a valid word?`, isValid); // Log the result
            return isValid; // Return the result to use elsewhere
    }
    catch {
        console.error("Error validating the word");
    }

}

// Function to determine only alphabet is entered
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

document.querySelector('.letter-box')
.addEventListener("keydown", function (event) {
    // uses the isLetter function from above
    if (!isLetter(event.key)) {
        event.preventDefault();
    }
});