export function getArrayIndexOfFirstDifferentElement(arr1: any[], arr2: any[]): number {
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return i;
      }
    }

    return -1;
  }

  const size = Math.min(arr1.length, arr2.length);

  for (let i = 0; i < size; i++) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }

  return size;
}
