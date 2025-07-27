import type Position from "../interfaces/Position";
import { randomPosition } from "../utils/random";
import Tile from "./Tile";

export default class Minefield {
  private _htmlElement: HTMLDivElement;
  private _tiles: Tile[][];
  private _isGameOver: boolean;
  private _firstClick: boolean;

  constructor(htmlElement: HTMLDivElement) {
    this._htmlElement = htmlElement;
    this._tiles = [];
    this._isGameOver = false;
    this._firstClick = true;
  }

  public get htmlElement(): HTMLDivElement {
    return this._htmlElement;
  }

  private get tiles(): Tile[][] {
    return this._tiles;
  }
  private set tiles(value: Tile[][]) {
    this._tiles = value;
  }

  public get isGameOver(): boolean {
    return this._isGameOver;
  }
  private set isGameOver(value: boolean) {
    this._isGameOver = value;
  }

  public get firstClick(): boolean {
    return this._firstClick;
  }
  private set firstClick(value: boolean) {
    this._firstClick = value;
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

    this.isGameOver = false;
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
    this.render();
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

  public gameOver(): void {
    this.isGameOver = true;
  }

  public getNumberOfMineAround(position: Position): number {
    let numberOfMineAround = 0;
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
          numberOfMineAround++;
        }
      }
    }
    return numberOfMineAround;
  }

  public render(): void {
    this.htmlElement.innerHTML = "";
    this.htmlElement.className = this.isGameOver ? "game-over" : "";
    for (const tileLine of this.tiles) {
      const htmlTileLine = document.createElement("div");
      htmlTileLine.className = "tile-line";
      for (const tile of tileLine) {
        htmlTileLine.appendChild(tile.render());
      }
      this.htmlElement.appendChild(htmlTileLine);
    }
  }
}
