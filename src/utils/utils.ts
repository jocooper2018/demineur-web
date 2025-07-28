const ROOT_FONT_SIZE = parseFloat(
  getComputedStyle(document.documentElement).fontSize
);

export const remToPx = (rem: number): number => {
  return rem * ROOT_FONT_SIZE;
};

export const getCssVariableValue = (variableName: string): string => {
  const root: HTMLElement = document.documentElement;
  const styles: CSSStyleDeclaration = getComputedStyle(root);
  return styles.getPropertyValue(variableName).trim();
};

/**
 *
 * @param time Time in milliseconds.
 */
export const sleep = async (time: number): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, time));
};
