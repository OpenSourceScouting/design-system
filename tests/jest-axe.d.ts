/**
 * jest-axe ships a Jest matcher whose type augmentation targets jest's
 * `Matchers` interface, not Vitest's `Assertion`. Bridge it so
 * `expect(...).toHaveNoViolations()` typechecks under Vitest.
 */
import "vitest";

interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
