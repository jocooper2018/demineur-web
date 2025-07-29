import type Position from "../interfaces/Position";
import { randomPosition } from "../utils/random";
import { remToPx, sleep } from "../utils/utils";
import Tile from "./Tile";
import type Timer from "./Timer";

export default class Minefield {
  private _htmlElement: HTMLElement;
  private _container: HTMLElement;
  private _timer: Timer;
  private _tiles: Tile[][];
  private _isGameOver: boolean;
  private _won: boolean;
  private _firstClick: boolean;
  private _numberOfMinesRemainingIndicator: HTMLElement;

  constructor(
    htmlElement: HTMLElement,
    container: HTMLElement,
    timer: Timer,
    numberOfMinesRemainingIndicator: HTMLElement
  ) {
    this._htmlElement = htmlElement;
    this._container = container;
    this._tiles = [];
    this._isGameOver = false;
    this._won = false;
    this._firstClick = true;
    this._timer = timer;
    this._numberOfMinesRemainingIndicator = numberOfMinesRemainingIndicator;
  }

  public get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  public get container(): HTMLElement {
    return this._container;
  }

  public get timer(): Timer {
    return this._timer;
  }

  public get numberOfMinesRemainingIndicator(): HTMLElement {
    return this._numberOfMinesRemainingIndicator;
  }

  private get tiles(): Tile[][] {
    return this._tiles;
  }
  private set tiles(value: Tile[][]) {
    this._tiles = value;
  }

  public get width(): number {
    return this.tiles[0].length;
  }

  public get height(): number {
    return this.tiles.length;
  }

  public get isGameOver(): boolean {
    return this._isGameOver;
  }
  private set isGameOver(value: boolean) {
    this._isGameOver = value;
  }

  public get won(): boolean {
    return this._won;
  }
  private set won(value: boolean) {
    this._won = value;
  }

  public get firstClick(): boolean {
    return this._firstClick;
  }
  private set firstClick(value: boolean) {
    if (this.firstClick && !value) {
      this.timer.start();
    }
    this._firstClick = value;
  }

  public get numberOfMinesRemaining(): number {
    let numberOfMines: number = 0;
    let numberOfFlags: number = 0;
    for (const tileLine of this.tiles) {
      for (const tile of tileLine) {
        if (tile.state === "FLAG") {
          numberOfFlags++;
        }
        if (tile.mine) {
          numberOfMines++;
        }
      }
    }
    return numberOfMines - numberOfFlags;
  }

  public newGame(width: number, height: number, mineNumber: number): void {
    if (mineNumber > width * height - 9) {
      throw new Error("To much mine");
    }
    const minesPositions: Position[] = [];
    for (let i = 0; i < mineNumber; i++) {
      let position: Position;
      let ok: boolean;
      do {
        ok = true;
        position = randomPosition(width, height);
        for (const pos of minesPositions) {
          if (pos.x === position.x && pos.y === position.y) {
            ok = false;
            break;
          }
        }
      } while (!ok);
      minesPositions.push(position);
    }
    this.timer.reset();
    this.isGameOver = false;
    this.won = false;
    this.firstClick = true;
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      const line: Tile[] = [];
      for (let x = 0; x < width; x++) {
        let isMine = false;
        for (const pos of minesPositions) {
          if (pos.x === x && pos.y === y) {
            isMine = true;
            break;
          }
        }
        line.push(new Tile(this, { x, y }, isMine));
      }
      this._tiles.push(line);
    }
    this.htmlElement.innerHTML = "";
    for (const tileLine of this.tiles) {
      const htmlTileLine = document.createElement("div");
      htmlTileLine.className = "tile-line";
      for (const tile of tileLine) {
        htmlTileLine.appendChild(tile.htmlElement);
      }
      this.htmlElement.appendChild(htmlTileLine);
    }
    this.updateNumberOfMinesRemainingIndicator();
    this.render();
    (async () => {
      sleep(0);
      this.resize(this.container.clientWidth, this.container.clientHeight);
    })();
  }

  public updateNumberOfMinesRemainingIndicator(): void {
    this.numberOfMinesRemainingIndicator.innerText =
      this.numberOfMinesRemaining.toString();
  }

  public handleFirstClick(position: Position) {
    this.firstClick = false;
    let numberOfMineRemoved: number = 0;
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        if (
          x < 0 ||
          y < 0 ||
          x > this.tiles[0].length - 1 ||
          y > this.tiles.length - 1
        ) {
          continue;
        }
        if (this.tiles[y][x].mine) {
          numberOfMineRemoved++;
          this.tiles[y][x].mine = false;
        }
      }
    }
    for (let i = 0; i < numberOfMineRemoved; i++) {
      let position2: Position;
      let ok: boolean;
      do {
        ok = true;
        position2 = randomPosition(this.tiles[0].length, this.tiles.length);
        if (
          (position2.x >= position.x - 1 &&
            position2.x <= position.x + 1 &&
            position2.y >= position.y - 1 &&
            position2.y <= position.y + 1) ||
          this.tiles[position2.y][position2.x].mine
        ) {
          ok = false;
        }
      } while (!ok);
      this.tiles[position2.y][position2.x].mine = true;
    }
  }

  public gameOver(won: boolean): void {
    this.timer.stop();
    this.isGameOver = true;
    this.won = won;
    this.render();
  }

  public checkIfItsAWin(): void {
    if (this.isGameOver) return;
    let numberOfMines: number = 0;
    let numberOfUnexcavatedTiles: number = 0;
    for (const tileLine of this.tiles) {
      for (const tile of tileLine) {
        if (tile.state !== "OPEN") {
          numberOfUnexcavatedTiles++;
        }
        if (tile.mine) {
          numberOfMines++;
        }
      }
    }
    if (numberOfMines === numberOfUnexcavatedTiles) {
      this.gameOver(true);
    }
  }

  public getNumberOfMinesAround(position: Position): number {
    let numberOfMinesAround = 0;
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        if (
          (x === position.x && y === position.y) ||
          x < 0 ||
          y < 0 ||
          x > this.tiles[0].length - 1 ||
          y > this.tiles.length - 1
        ) {
          continue;
        }
        if (this.tiles[y][x].mine) {
          numberOfMinesAround++;
        }
      }
    }
    return numberOfMinesAround;
  }

  public getNumberOfFlagsAround(position: Position): number {
    let numberOfFlagsAround = 0;
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        if (
          (x === position.x && y === position.y) ||
          x < 0 ||
          y < 0 ||
          x > this.tiles[0].length - 1 ||
          y > this.tiles.length - 1
        ) {
          continue;
        }
        if (this.tiles[y][x].state === "FLAG") {
          numberOfFlagsAround++;
        }
      }
    }
    return numberOfFlagsAround;
  }

  public getNumberOfUnexploredTilesAround(position: Position): number {
    let numberOfUnexploredTilesAround = 0;
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        if (
          (x === position.x && y === position.y) ||
          x < 0 ||
          y < 0 ||
          x > this.tiles[0].length - 1 ||
          y > this.tiles.length - 1
        ) {
          continue;
        }
        if (this.tiles[y][x].state === "DEFAULT") {
          numberOfUnexploredTilesAround++;
        }
      }
    }
    return numberOfUnexploredTilesAround;
  }

  public openAdjacentTiles(position: Position): void {
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        if (
          (x === position.x && y === position.y) ||
          x < 0 ||
          y < 0 ||
          x > this.tiles[0].length - 1 ||
          y > this.tiles.length - 1 ||
          this.tiles[y][x].state !== "DEFAULT"
        ) {
          continue;
        }
        this.tiles[y][x].open();
      }
    }
  }

  public closeAllOtherPopup(position: Position): void {
    for (const tileLine of this.tiles) {
      for (const tile of tileLine) {
        if (tile.position.x === position.x && tile.position.y === position.y) {
          continue;
        }
        tile.closePopup();
      }
    }
  }

  public render(): void {
    this.htmlElement.className = this.isGameOver ? "game-over" : "";
    for (const tileLine of this.tiles) {
      for (const tile of tileLine) {
        tile.render();
      }
    }
  }

  public resize(containerWidth: number, containerHeight: number) {
    const containerRatio: number = containerWidth / containerHeight;
    const minefieldRatio: number = this.width / this.height;
    if (containerRatio > minefieldRatio) {
      this.htmlElement.style = `--tile-size: ${
        containerHeight / this.height - remToPx(5) / this.height
      }px;`;
    } else {
      this.htmlElement.style = `--tile-size: ${
        containerWidth / this.width - remToPx(5) / this.width
      }px;`;
    }
  }
}
