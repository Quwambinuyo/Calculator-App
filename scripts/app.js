// **Grab essential DOM elements**
const display = document.getElementById("calculate-input"); // The input display for the calculator
const buttons = document.querySelectorAll('input[type="button"]'); // All calculator buttons
const toggleButton = document.getElementById("toggleButton"); // Button to toggle themes
const body = document.body; // Reference to the body for theme changes

// **State variables**
let currentInput = ""; // Stores the current input from the user
let hasCalculated = false; // Tracks if the last action was a calculation

// **Button click event handlers**
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let value = e.target.value; // Get the value of the clicked button

    if (value === "DEL") {
      // **Handle backspace (DEL)**
      currentInput = currentInput.slice(0, -1); // Remove the last character
      display.value = currentInput; // Update the display
    } else if (value === "RESET") {
      // **Handle reset button**
      currentInput = ""; // Clear all input
      display.value = currentInput; // Update the display
    } else if (value === "=") {
      // **Handle calculation (equal button)**
      if (currentInput.trim() === "") {
        // Do nothing if input is empty
        display.value = "";
        currentInput = "";
      } else {
        try {
          const result = calculateLeftToRight(currentInput); // Perform left-to-right calculation
          display.value = result; // Show the result
          currentInput = result; // Update input with the result
          hasCalculated = true; // Set calculated state
        } catch (error) {
          // Handle any calculation errors
          display.value = "Syntax Error";
          currentInput = "";
          hasCalculated = false;
        }
      }
    } else {
      // **Handle number or operator buttons**
      if (hasCalculated) {
        // If last action was a calculation
        if (isNaN(value)) {
          // If the value is an operator, allow continuing calculation
          currentInput += value;
          hasCalculated = false;
        } else {
          // If the value is a number, reset input for a new calculation
          currentInput = value;
        }
      } else {
        currentInput += value; // Add button value to input
      }
      display.value = currentInput; // Update the display
    }
  });
});

// **Custom function to evaluate left-to-right calculation**
function calculateLeftToRight(input) {
  // Replace custom operators with standard ones
  let replacedOperators = input.replace(/x/g, "*").replace(/÷/g, "/");
  let tokens = replacedOperators.split(/([+\-*/])/); // Split into numbers and operators

  // Parse the first number as the initial result
  let result = parseFloat(tokens[0]);

  // Iterate through operators and numbers in sequence
  for (let i = 1; i < tokens.length; i += 2) {
    let operator = tokens[i]; // Current operator
    let nextNumber = parseFloat(tokens[i + 1]); // Next number

    // Check for invalid numbers
    if (isNaN(nextNumber)) {
      throw new Error("Invalid input");
    }

    // Perform the operation based on the operator
    switch (operator) {
      case "+":
        result += nextNumber;
        break;
      case "-":
        result -= nextNumber;
        break;
      case "*":
        result *= nextNumber;
        break;
      case "/":
        result /= nextNumber;
        break;
      default:
        throw new Error("Invalid operator");
    }
  }

  return String(result); // Return the result as a string
}

// **Theme toggle functionality**
document.addEventListener("DOMContentLoaded", () => {
  const toggleIndicator = document.querySelector(".toggle-indicator"); // Indicator for toggle switch
  let currentTheme = 0; // Tracks the current theme (0 = default, 1 = white, 2 = purple)

  // Retrieve theme from local storage on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== null) {
    currentTheme = parseInt(savedTheme, 10); // Parse saved theme index
    applyTheme(currentTheme); // Apply the saved theme
  }

  toggleButton.addEventListener("click", () => {
    // Cycle through themes
    currentTheme = (currentTheme + 1) % 3;

    // Apply the new theme and save it to local storage
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme); // Save the current theme
  });

  // **Helper function to apply themes**
  function applyTheme(themeIndex) {
    // Remove all theme classes before applying a new one
    body.classList.remove("default-theme", "white-theme", "purple-theme");

    // Apply the corresponding theme
    if (themeIndex === 0) {
      body.classList.add("default-theme");
      toggleIndicator.style.transform = "translateX(0)"; // Reset indicator position
    } else if (themeIndex === 1) {
      body.classList.add("white-theme");
      toggleIndicator.style.transform = "translateX(22px)"; // Move indicator to white theme
    } else if (themeIndex === 2) {
      body.classList.add("purple-theme");
      toggleIndicator.style.transform = "translateX(42px)"; // Move indicator to purple theme
    }
  }
});
