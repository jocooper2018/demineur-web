import type Position from "../interfaces/Position";
import type { TileState } from "../types/tileTypes";
import DefaultTexture from "../assets/tile-default.png";
import Open0Texture from "../assets/tile-open-0.png";
import Open1Texture from "../assets/tile-open-1.png";
import Open2Texture from "../assets/tile-open-2.png";
import Open3Texture from "../assets/tile-open-3.png";
import Open4Texture from "../assets/tile-open-4.png";
import Open5Texture from "../assets/tile-open-5.png";
import Open6Texture from "../assets/tile-open-6.png";
import Open7Texture from "../assets/tile-open-7.png";
import Open8Texture from "../assets/tile-open-8.png";
import FlagTexture from "../assets/tile-flag.png";
import FlagNotSureTexture from "../assets/tile-flag-not-sure.png";
import NoMineTexture from "../assets/tile-flag-no-mine.png";
import MineTexture from "../assets/tile-mine.png";
import MineBoomTexture from "../assets/tile-mine-boom.png";
import type Minefield from "./Minefield";

export default class Tile {
  private _minefield: Minefield;
  private _mine: boolean;
  private _state: TileState;
  private _position: Position;

  constructor(minefield: Minefield, position: Position, mine: boolean) {
    this._minefield = minefield;
    this._position = position;
    this._mine = mine;
    this._state = "DEFAULT";
  }

  public get minefield(): Minefield {
    return this._minefield;
  }

  public get position(): Position {
    return this._position;
  }

  public get mine(): boolean {
    return this._mine;
  }

  public get state(): TileState {
    return this._state;
  }
  private set state(value: TileState) {
    this._state = value;
  }

  public get numberOfMineAround(): number {
    if (this.mine) {
      return 0;
    }
    return this.minefield.getNumberOfMineAround(this.position);
  }

  public open(): void {
    if (this.minefield.isGameOver) return;
    this.state = "OPEN";
    if (this.mine) {
      this.minefield.gameOver();
    }
    this.minefield.render();
  }

  public render(): HTMLElement {
    const div = document.createElement("div");
    div.id = `tile-${this.position.x}-${this.position.y}`;
    div.className = `tile ${this.state.toLowerCase()}`;
    div.onclick = () => this.open();
    
    let texture: string = DefaultTexture;
    let alt: string = "";

    if (this.minefield.isGameOver && this.mine && this.state === "DEFAULT") {
      texture = MineTexture;
      alt = "Mine";
    } else if (
      this.minefield.isGameOver &&
      !this.mine &&
      (this.state === "FLAG" || this.state === "FLAG-NOT-SURE")
    ) {
      texture = NoMineTexture;
      alt = "There were no mines here.";
    } else if (this.state === "DEFAULT") {
      texture = DefaultTexture;
      alt = "Unexplored";
    } else if (this.state === "FLAG") {
      texture = FlagTexture;
      alt = "Flag";
    } else if (this.state === "FLAG-NOT-SURE") {
      texture = FlagNotSureTexture;
      alt = "There may be a mine.";
    } else if (this.mine) {
      texture = MineBoomTexture;
      alt = "A mine exploded here.";
    } else if (this.numberOfMineAround === 0) {
      texture = Open0Texture;
      alt = "No mines nearby.";
    } else if (this.numberOfMineAround === 1) {
      texture = Open1Texture;
      alt = "1 mine nearby.";
    } else if (this.numberOfMineAround === 2) {
      texture = Open2Texture;
      alt = "2 mines nearby.";
    } else if (this.numberOfMineAround === 3) {
      texture = Open3Texture;
      alt = "3 mines nearby.";
    } else if (this.numberOfMineAround === 4) {
      texture = Open4Texture;
      alt = "4 mines nearby.";
    } else if (this.numberOfMineAround === 5) {
      texture = Open5Texture;
      alt = "5 mines nearby.";
    } else if (this.numberOfMineAround === 6) {
      texture = Open6Texture;
      alt = "6 mines nearby.";
    } else if (this.numberOfMineAround === 7) {
      texture = Open7Texture;
      alt = "7 mines nearby.";
    } else if (this.numberOfMineAround === 8) {
      texture = Open8Texture;
      alt = "8 mines nearby.";
    }
    const img = document.createElement("img");
    img.src = texture;
    img.alt = alt;
    img.title = alt;
    div.appendChild(img);
    return div;
  }
}
