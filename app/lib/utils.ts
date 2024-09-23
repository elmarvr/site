export function runIfFn<TArgs extends any[], TResult>(
  maybeFn: TResult | ((...args: TArgs) => TResult),
  ...args: TArgs
) {
  return isFunction(maybeFn) ? maybeFn(...args) : maybeFn;
}

export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}
