import "./style.css";
import Minefield from "./classes/Minefield";
import Timer from "./classes/Timer";

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
const minefieldContainer = document.getElementById(
  "minefield-container"
) as HTMLDivElement;

const minefield: Minefield = new Minefield(
  minefieldHtmlElement,
  minefieldContainer,
  new Timer(timer),
  numberOfMinesRemainingIndicator
);

newGameButton.onclick = () => minefield.newGame(8, 8, 8);

minefield.newGame(16, 16, 32);

window.addEventListener("resize", () => {
  minefield.resize(
    minefieldContainer.clientWidth,
    minefieldContainer.clientHeight
  );
});
