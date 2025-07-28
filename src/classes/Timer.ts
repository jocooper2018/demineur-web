import { formatWithLeadingZero } from "../utils/format";

export default class Timer {
  private _htmlElement: HTMLElement;
  private _startTimestamp: number | null;
  private _endTimestamp: number | null;
  private _intervalId: number | null;

  constructor(htmlElement: HTMLElement) {
    this._htmlElement = htmlElement;
    this._startTimestamp = null;
    this._endTimestamp = null;
    this._intervalId = null;
  }

  public get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  public get startTimestamp(): number | null {
    return this._startTimestamp;
  }
  public set startTimestamp(value: number | null) {
    this._startTimestamp = value;
  }

  public get endTimestamp(): number | null {
    return this._endTimestamp;
  }
  public set endTimestamp(value: number | null) {
    this._endTimestamp = value;
  }

  private get intervalId(): number | null {
    return this._intervalId;
  }
  private set intervalId(value: number | null) {
    this._intervalId = value;
  }

  public get isActive(): boolean {
    return (this.startTimestamp === null) !== (this.endTimestamp === null);
  }

  public get elapsedTime(): number {
    if (this.startTimestamp === null) {
      return 0;
    }
    if (this.endTimestamp === null) {
      return new Date().getTime() - this.startTimestamp;
    }
    return this.endTimestamp - this.startTimestamp;
  }

  public start(): void {
    if (this.isActive) return;
    this.endTimestamp = null;
    this.startTimestamp = new Date().getTime();
    this.intervalId = setInterval(() => this.render(), 1000);
  }

  public stop(): void {
    if (!this.isActive) return;
    this.endTimestamp = new Date().getTime();
    this.intervalId && clearInterval(this.intervalId);
    this.intervalId = null;
  }

  public reset(): void {
    this.startTimestamp = null;
    this.endTimestamp = null;
    this.intervalId && clearInterval(this.intervalId);
    this.render();
  }

  public render(): void {
    this.htmlElement.innerHTML = this.toString();
  }

  public toString(): string {
    let seconds: number = Math.round((this.elapsedTime / 1000) % 60);
    let minutes: number = Math.floor(this.elapsedTime / 60000) % 60;
    let hours: number = Math.floor(this.elapsedTime / 3600000);
    return `${
      hours > 0 ? `${formatWithLeadingZero(hours)}:` : ""
    }${formatWithLeadingZero(minutes)}:${formatWithLeadingZero(seconds)}`;
  }
}
