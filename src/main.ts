import "./style.css";
import Minefield from "./classes/Minefield";
import Timer from "./classes/Timer";
import ScoreBoard from "./classes/ScoreBoard";

const minefieldHtmlElement = document.getElementById(
  "minefield"
) as HTMLDivElement;
const timer = document.getElementById("timer") as HTMLDivElement;
const numberOfMinesRemainingIndicator = document.getElementById(
  "number-of-mines-remaining"
) as HTMLElement;
const newGameButton = document.getElementById(
  "new-game-button"
) as HTMLButtonElement;
const newGameMobileButton = document.getElementById(
  "new-game-mobile-button"
) as HTMLButtonElement;
const minefieldContainer = document.getElementById(
  "minefield-container"
) as HTMLDivElement;
const newGameSection = document.getElementById(
  "new-game-section"
) as HTMLElement;
const difficultySelect = document.getElementById(
  "difficulty-select"
) as HTMLSelectElement;
const widthInput = document.getElementById("width-input") as HTMLInputElement;
const heightInput = document.getElementById("height-input") as HTMLInputElement;
const numberOfMinesInput = document.getElementById(
  "number-of-mines-input"
) as HTMLInputElement;
const scoreBoardList = document.querySelector(
  "#score-board ul"
) as HTMLUListElement;

const minefield: Minefield = new Minefield(
  minefieldHtmlElement,
  minefieldContainer,
  new Timer(timer),
  numberOfMinesRemainingIndicator,
  new ScoreBoard(scoreBoardList)
);

type InputType =
  | "NONE"
  | "DIFFICULTY-SELECT"
  | "WIDTH-INPUT"
  | "HEIGHT-INPUT"
  | "NUMBER-OF-MINES-INPUT";

let inputType: InputType = "NONE";

const updateInputs = (_inputType: InputType) => {
  if (inputType === "NONE") {
    inputType = _inputType;
    if (
      numberOfMinesInput.value === "1" ||
      Number(numberOfMinesInput.value) ===
        Number(widthInput.value) * Number(heightInput.value) - 9
    ) {
      difficultySelect.value = "none";
    } else if (
      Number(numberOfMinesInput.value) /
        (Number(widthInput.value) * Number(heightInput.value)) <
      0.15625
    ) {
      difficultySelect.value = "easy";
    } else if (
      Number(numberOfMinesInput.value) /
        (Number(widthInput.value) * Number(heightInput.value)) <
      0.21875
    ) {
      difficultySelect.value = "medium";
    } else if (
      Number(numberOfMinesInput.value) /
        (Number(widthInput.value) * Number(heightInput.value)) <
      0.375
    ) {
      difficultySelect.value = "hard";
    } else {
      difficultySelect.value = "impossible";
    }
    inputType = "NONE";
  }
  numberOfMinesInput.max = `${
    Number(widthInput.value) * Number(heightInput.value) - 9
  }`;
};

difficultySelect.oninput = () => {
  if (inputType === "NONE") {
    inputType = "DIFFICULTY-SELECT";
    switch (difficultySelect.value) {
      case "none":
        widthInput.value = "8";
        heightInput.value = "8";
        numberOfMinesInput.value = "1";
        break;
      case "easy":
        widthInput.value = "8";
        heightInput.value = "8";
        numberOfMinesInput.value = "8";
        break;
      case "medium":
        widthInput.value = "16";
        heightInput.value = "16";
        numberOfMinesInput.value = "48";
        break;
      case "hard":
        widthInput.value = "32";
        heightInput.value = "32";
        numberOfMinesInput.value = "256";
        break;
      case "impossible":
        widthInput.value = "32";
        heightInput.value = "32";
        numberOfMinesInput.value = "512";
        break;
      default:
        break;
    }
    inputType = "NONE";
  }
  numberOfMinesInput.max = `${
    Number(widthInput.value) * Number(heightInput.value) - 9
  }`;
};
widthInput.oninput = () => {
  updateInputs("WIDTH-INPUT");
};
heightInput.oninput = () => {
  updateInputs("HEIGHT-INPUT");
};
numberOfMinesInput.oninput = () => {
  updateInputs("NUMBER-OF-MINES-INPUT");
};

const newGame = () => {
  const width: number = Number(widthInput.value);
  const height: number = Number(heightInput.value);
  const numberOfMines: number = Number(numberOfMinesInput.value);
  if (
    Number.isNaN(width) ||
    Number.isNaN(height) ||
    Number.isNaN(numberOfMines)
  ) {
    console.error("NaN");
    return;
  }
  try {
    minefield.newGame(width, height, numberOfMines);
    newGameSection.classList.remove("open");
  } catch (error) {
    if (error instanceof Error && error.message === "To much mines") {
      alert("Error: To much mines");
    }
  }
};

newGameButton.onclick = () => newGame();

newGame();

window.addEventListener("resize", () => {
  minefield.resize();
});

newGameMobileButton.onclick = () => {
  if (newGameSection.classList.contains("open")) {
    newGameSection.classList.remove("open");
  } else {
    newGameSection.classList.add("open");
  }
};
