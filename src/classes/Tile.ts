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
import ShovelTexture from "../assets/tile-shovel.png";
import CrossTexture from "../assets/tile-cross.png";
import type Minefield from "./Minefield";

export default class Tile {
  private _minefield: Minefield;
  private _mine: boolean;
  private _state: TileState;
  private _position: Position;
  private _htmlElement: HTMLElement;
  private _isPopupOpen: boolean;

  constructor(minefield: Minefield, position: Position, mine: boolean) {
    this._minefield = minefield;
    this._position = position;
    this._mine = mine;
    this._state = "DEFAULT";
    this._htmlElement = document.createElement("div");
    this._htmlElement.id = `tile-${this.position.x}-${this.position.y}`;
    this._isPopupOpen = false;
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
  public set mine(value: boolean) {
    this._mine = value;
  }

  public get state(): TileState {
    return this._state;
  }
  private set state(value: TileState) {
    this._state = value;
  }

  public get isPopupOpen(): boolean {
    return this._isPopupOpen;
  }
  private set isPopupOpen(value: boolean) {
    this._isPopupOpen = value;
  }

  public get numberOfMinesAround(): number {
    if (this.mine) {
      return 0;
    }
    return this.minefield.getNumberOfMinesAround(this.position);
  }

  public get numberOfFlagsAround(): number {
    if (this.mine) {
      return 0;
    }
    return this.minefield.getNumberOfFlagsAround(this.position);
  }

  public get numberOfUnexploredTilesAround(): number {
    return this.minefield.getNumberOfUnexploredTilesAround(this.position);
  }

  public get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  private openPopup(): void {
    if (
      this.isPopupOpen ||
      this.minefield.isGameOver ||
      (this.state === "OPEN" && this.numberOfMinesAround === 0)
    ) {
      return;
    }
    this.minefield.closeAllOtherPopup(this.position);
    const popup = document.createElement("div");
    popup.className = "dig-popup";

    if (
      this.state === "DEFAULT" ||
      (this.state === "OPEN" && this.numberOfUnexploredTilesAround > 0)
    ) {
      const digButton = document.createElement("button");
      const digButtonImg = document.createElement("img");
      digButtonImg.src = ShovelTexture;
      digButtonImg.alt = "Dig";
      digButton.appendChild(digButtonImg);
      digButton.title = "Dig";
      digButton.onclick = () => this.open();
      popup.appendChild(digButton);
    }

    if (this.state !== "OPEN") {
      const flagButton = document.createElement("button");
      if (this.state === "FLAG") {
        const flagButtonImg = document.createElement("img");
        flagButtonImg.src = NoMineTexture;
        flagButtonImg.alt = "Remove the flag.";
        flagButton.appendChild(flagButtonImg);
        flagButton.title = "Remove the flag.";
        flagButton.onclick = () => {
          this.state = "DEFAULT";
          this.render();
        };
      } else {
        const flagButtonImg = document.createElement("img");
        flagButtonImg.src = FlagTexture;
        flagButtonImg.alt = "Put a flag here.";
        flagButton.appendChild(flagButtonImg);
        flagButton.title = "Put a flag here.";
        flagButton.onclick = () => {
          this.state = "FLAG";
          this.render();
        };
      }
      popup.appendChild(flagButton);

      const flagNotSureButton = document.createElement("button");
      if (this.state === "FLAG-NOT-SURE") {
        const flagButtonImg = document.createElement("img");
        flagButtonImg.src = NoMineTexture;
        flagButtonImg.alt = "Remove the flag.";
        flagNotSureButton.appendChild(flagButtonImg);
        flagNotSureButton.title = "Remove the flag.";
        flagNotSureButton.onclick = () => {
          this.state = "DEFAULT";
          this.render();
        };
      } else {
        const flagButtonImg = document.createElement("img");
        flagButtonImg.src = FlagNotSureTexture;
        flagButtonImg.alt = "Put a flag with a question mark here.";
        flagNotSureButton.appendChild(flagButtonImg);
        flagNotSureButton.title = "Put a flag with a question mark here.";
        flagNotSureButton.onclick = () => {
          this.state = "FLAG-NOT-SURE";
          this.render();
        };
      }
      popup.appendChild(flagNotSureButton);
    }

    const closeButton = document.createElement("button");
    const closeButtonImg = document.createElement("img");
    closeButtonImg.src = CrossTexture;
    closeButtonImg.alt = "Close popup";
    closeButton.appendChild(closeButtonImg);
    closeButton.title = "Close popup";
    closeButton.onclick = () => this.closePopup();
    popup.appendChild(closeButton);

    this.htmlElement.appendChild(popup);
    this.isPopupOpen = true;
  }

  public closePopup(): void {
    if (!this.isPopupOpen) return;
    this.render();
    this.isPopupOpen = false;
  }

  public open(): void {
    if (this.minefield.isGameOver) return;
    if (this.minefield.firstClick) {
      this.minefield.handleFirstClick(this.position);
    }
    this.state = "OPEN";
    if (this.mine) {
      this.minefield.gameOver();
    } else if (this.numberOfFlagsAround === this.numberOfMinesAround) {
      this.minefield.openAdjacentTiles(this.position);
    }
    this.minefield.render();
  }

  public render(): void {
    this.htmlElement.innerHTML = "";
    this.htmlElement.className = `tile ${this.state.toLowerCase()} ${
      this.state !== "OPEN" || this.numberOfUnexploredTilesAround > 0
        ? "can-dig"
        : ""
    }`;

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
    } else if (this.numberOfMinesAround === 0) {
      texture = Open0Texture;
      alt = "No mines nearby.";
    } else if (this.numberOfMinesAround === 1) {
      texture = Open1Texture;
      alt = "1 mine nearby.";
    } else if (this.numberOfMinesAround === 2) {
      texture = Open2Texture;
      alt = "2 mines nearby.";
    } else if (this.numberOfMinesAround === 3) {
      texture = Open3Texture;
      alt = "3 mines nearby.";
    } else if (this.numberOfMinesAround === 4) {
      texture = Open4Texture;
      alt = "4 mines nearby.";
    } else if (this.numberOfMinesAround === 5) {
      texture = Open5Texture;
      alt = "5 mines nearby.";
    } else if (this.numberOfMinesAround === 6) {
      texture = Open6Texture;
      alt = "6 mines nearby.";
    } else if (this.numberOfMinesAround === 7) {
      texture = Open7Texture;
      alt = "7 mines nearby.";
    } else if (this.numberOfMinesAround === 8) {
      texture = Open8Texture;
      alt = "8 mines nearby.";
    }
    const img = document.createElement("img");
    img.src = texture;
    img.alt = alt;
    img.title = alt;
    img.onclick = () => {
      if (this.minefield.firstClick) {
        this.open();
      } else {
        this.openPopup();
      }
    };
    this.htmlElement.appendChild(img);
  }
}
