export function fillArray(value: number, count: number): number[] {
  const arr: number[] = [];

  for (let i = 0; i < count; i++) {
    arr.push(value);
  }

  return arr;
}
