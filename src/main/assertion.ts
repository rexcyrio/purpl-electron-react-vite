export class AssertionError extends Error {}

export function assertTrue(fn: () => boolean): void {
  if (fn() !== true) {
    throw new AssertionError();
  }
}

export async function assertTrueAsync(fn: () => Promise<boolean>): Promise<void> {
  if ((await fn()) !== true) {
    throw new AssertionError();
  }
}

export function assertFalse(fn: () => boolean): void {
  if (fn() !== false) {
    throw new AssertionError();
  }
}
