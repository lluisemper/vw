export function getSearchDelay(items: number): number {
  if (items > 1000) return 500;
  if (items > 100) return 300;
  return 0;
}
