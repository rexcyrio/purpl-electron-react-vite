import { AssertionError } from "../exceptions/exceptions";

export function assertTrue(value: any) {
  if (value !== true) {
    throw new AssertionError();
  }
}

export function assertNotNullNotUndefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new AssertionError();
  }
}
