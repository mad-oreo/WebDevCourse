let input = "0";
let prevInput = "";
let operator = "";

// Function to update display
const resultDisplay = document.querySelector('.result');
function updateDisplay() {
    resultDisplay.textContent = input;
}

// Event listener to handle number click event
const buttons = document.querySelectorAll('.num-btn, .zero-btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
       if (input === '0') {
        input = button.textContent;
       } 
       else {
        input += button.textContent;
       }
       updateDisplay();
    });
});

// Event listener to handle operation click event
const opButtons = document.querySelectorAll('.div-btn, .multi-btn, .sub-btn, .add-btn');
opButtons.forEach(opButton => {
    opButton.addEventListener('click', () => {
        if (prevInput && input) {
            calculate();
        }
        operator = opButton.textContent;
        prevInput = input;
        input = '';
    });
});

// Event listener to handle equals click event
const equalButton = document.querySelectorAll('.equal-btn');
equalButton.forEach(equalBtn => { 
    equalBtn.addEventListener('click', () => {
        if (prevInput && input) {
            calculate();
        }
        operator = '';
    });
});

// Event listener for clear click event
const clearButton = document.querySelectorAll('.clear-btn');
clearButton.forEach(clrButton => {
    clrButton.addEventListener('click', () => {
        input = '0';
        prevInput = '';
        operator = '';
        updateDisplay();
    });
})

// Event listener for back click event
const backButton = document.querySelectorAll('.back-btn');
backButton.forEach(backBtn => {
    backBtn.addEventListener('click', () => {
       input = input.slice(0, -1) || '0';
       updateDisplay();
    });
});

// Calculate function
function calculate() {
    let result;
    const current = parseFloat(input);
    const prev = parseFloat(prevInput);

    if (isNaN(prev) || isNaN(current)) {return;}

    if (current === '0' || prev === '0') {return;}

    if (operator === '+') {
        result = prev + current;
    }
    else if (operator === '-') {
        result = prev - current;
    }
    else if (operator === 'x') {
        result = prev * current;
    }
    else {
        result = prev / current;
    }

    input = result.toString();
    prevInput = '';
    updateDisplay();
}