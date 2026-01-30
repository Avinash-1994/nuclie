export function identity<T>(value: T): T {
  return value;
}

export class Container<T> {
  constructor(private value: T) {}
  
  get(): T {
    return this.value;
  }
  
  map<U>(fn: (value: T) => U): Container<U> {
    return new Container(fn(this.value));
  }
}

export interface Result<T, E> {
  ok: boolean;
  value?: T;
  error?: E;
}

export function createResult<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}