import type Position from "../interfaces/Position";

export const randomPosition = (width: number, height: number): Position => {
  return {
    x: randInt(0, width - 1),
    y: randInt(0, height - 1),
  };
};

export const randInt = (start: number, end: number): number => {
  if (start > end) throw new Error("start > end");
  start = Math.round(start);
  end = Math.round(end);
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

export const randFloat = (start: number, end: number): number => {
  if (start > end) throw new Error("start > end");
  return Math.random() * (end - start) + start;
};
