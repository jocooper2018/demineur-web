export function formatWithLeadingZero(n: number): string {
  return n.toString().padStart(2, "0");
}
