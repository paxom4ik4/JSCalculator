class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear = () => {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
  };

  delete = () => {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  };

  appendNumber = (number) => {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  };

  chooseOperation = (operation) => {
    if (operation === "exp") {
      if (this.currentOperand === "") return;
      if (this.currentOperand !== "" && this.previousOperand !== "") {
        this.compute();
      }
      this.operation = "exp";
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    } else {
      if (this.currentOperand === "") return;
      if (this.currentOperand !== "" && this.previousOperand !== "") {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    }
  };

  compute = () => {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    let length = current.length;
    length = current.length > prev.length ? current.length : prev.length;
    switch (this.operation) {
      case "+":
        computation = (prev * 10 + current * 10) / 10;
        break;
      case "-":
        computation = (prev * 10 - current * 10) / 10;
        break;
      case "*":
        computation = (prev * 10 * current * 10) / 100;
        break;
      case "÷":
        if (current === 0) {
          this.currentOperandTextElement.innerText = "Error";
          this.previousOperandTextElement.innerText = "";
          this.readyToReset = true;
          this.operation = undefined;
        } else {
          computation = (((prev * 10) / current) * 10) / 100;
        }
        break;
      case "exp":
        computation = Math.pow(prev, current);
        break;
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  };

  getDisplayNumber = (number) => {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  };

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }

  sqare = () => {
    let result;
    if (this.currentOperand === "") {
      return;
    } else if (this.previousOperand !== "") {
      return;
    } else {
      const current = parseFloat(this.currentOperand);
      if (current >= 0) {
        result = Math.sqrt(current);
      } else {
        this.currentOperandTextElement.innerText = "Error";
        this.readyToReset = true;
        this.operation = undefined;
      }
    }
    this.currentOperand = result;
    this.currentOperandTextElement.innerText = this.getDisplayNumber(result);
    this.readyToReset = true;
    this.operation = undefined;
  };

  change = () => {
    if (this.currentOperand === "") {
      return;
    } else {
      let current = parseFloat(this.currentOperand);
      this.currentOperand = current * -1;
    }
  };
}

const squareData = document.querySelector("[data-square]");
const expData = document.querySelector("[data-exponentiation]");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const changeButton = document.querySelector("[data-change]");
const previousOperandTextElement = document.querySelector(
  "[data-second-screen]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-screen]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset
    ) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

squareData.addEventListener("click", () => {
  calculator.sqare();
});

expData.addEventListener("click", () => {
  calculator.chooseOperation("exp");
  calculator.updateDisplay();
});

changeButton.addEventListener("click", () => {
  calculator.change();
  calculator.updateDisplay();
});

const calc = document.querySelector(".calculator");
const extraData = document.querySelectorAll(".extra-data");
const extraButton = document.querySelector(".extra-button");
const allButtons = document.querySelectorAll("button");
extraButton.addEventListener("click", () => {
  if (extraButton.classList.contains("extra-button-active")) {
    allButtons.forEach((elem) => elem.classList.add("change-mode"));
    setTimeout(() => {
      allButtons.forEach((elem) => elem.classList.remove("change-mode"));
    }, 500);
    const hintButton = document.createElement("div");
    hintButton.innerHTML = `<i class="fas fa-info"></i>`;
    hintButton.title =
      "Чтобы отобразить дополнительные кнопки, нажмите на стрелочку в правом нижнем углу калькулятора";
    hintButton.classList.add("hint");
    calc.appendChild(hintButton);
    extraData.forEach((elem) => {
      extraButton.classList.remove("extra-button-active");
      deleteButton.classList.remove("zero-button");
      elem.classList.add("button-hide");
      calc.classList.remove("extra-data-calc");
    });
  } else {
    allButtons.forEach((elem) => elem.classList.add("change-mode"));
    setTimeout(() => {
      allButtons.forEach((elem) => elem.classList.remove("change-mode"));
    }, 500);
    const hintButton = document.querySelector(".hint");
    hintButton.remove();
    extraData.forEach((elem) => {
      hintButton.remove();
      extraButton.classList.add("extra-button-active");
      deleteButton.classList.add("zero-button");
      elem.classList.remove("button-hide");
      calc.classList.add("extra-data-calc");
    });
  }
});
const startScreen = document.querySelector(".start-screen");
const continueButton = document.querySelector(".continue-button");
continueButton.addEventListener("click", () => {
  startScreen.classList.add("easy-start");
  calc.classList.add("calc-start");
  setTimeout(() => {
    startScreen.remove();
  }, 990);
});
