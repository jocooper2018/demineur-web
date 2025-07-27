import "./style.css";
import Minefield from "./classes/Minefield";

const minefieldHtmlElement = document.getElementById(
  "minefield"
) as HTMLDivElement;

const minefield: Minefield = new Minefield(minefieldHtmlElement);

minefield.newGame(8, 8, 8);
