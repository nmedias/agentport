// Shared TS helper types — exported (not declared globally): ambient `declare global`
// stops at each tsconfig project boundary, vite-plugin-dts drops static .d.ts files
// from dist, and a global name used in a public signature would emit as a dangling
// reference for consumers. Explicit exports survive the declaration build.

/** Expands a composed/mapped type in hovers and emitted signatures. */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
