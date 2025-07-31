import type Timer from "./Timer";

export default class ScoreBoard {
  public static readonly LOCAL_STORAGE_ITEM_NAME: string =
    "demineur-web-scores";

  private _htmlElement: HTMLUListElement;

  constructor(htmlElement: HTMLUListElement) {
    this._htmlElement = htmlElement;
    this.render();
  }

  public get htmlElement(): HTMLUListElement {
    return this._htmlElement;
  }

  getScores(): string[] {
    const storedValue: string | null = window.localStorage.getItem(
      ScoreBoard.LOCAL_STORAGE_ITEM_NAME
    );
    let scores: string[];
    if (storedValue === null) {
      scores = [];
    } else {
      scores = JSON.parse(storedValue);
    }
    return scores;
  }

  saveScore(
    width: number,
    height: number,
    numberOfMines: number,
    timer: Timer
  ): void {
    const score: string = `${width}×${height}, ${numberOfMines} mines, ${timer.toString()}`;
    const scores = this.getScores();
    scores.push(score);
    window.localStorage.setItem(
      ScoreBoard.LOCAL_STORAGE_ITEM_NAME,
      JSON.stringify(scores)
    );
    this.render();
  }

  render(): void {
    this.htmlElement.innerHTML = "";
    const scores = this.getScores();
    for (const score of scores) {
      const li = document.createElement("li");
      li.innerText = score;
      this.htmlElement.appendChild(li);
    }
  }
}
