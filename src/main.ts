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

const minefield: Minefield = new Minefield(
  minefieldHtmlElement,
  new Timer(timer),
  numberOfMinesRemainingIndicator
);

minefield.newGame(8, 8, 8);
