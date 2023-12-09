function* generator<T>(values: T[] | Iterator<T>): Generator<T> {
  const iterator = Array.isArray(values) ? values.values() : values
  let result = iterator.next()
  while (!result.done) {
    yield result.value
    result = iterator.next()
  }
}

export class ExperimentalIterator<T> implements IterableIterator<T> {
  private iterator: Generator<T>

  constructor(values: T[] | IterableIterator<T>) {
    this.iterator = generator(values)
  }

  [Symbol.iterator](): ExperimentalIterator<T> {
    return new ExperimentalIterator(this.iterator)
  }

  next(): IteratorResult<T> {
    return this.iterator.next()
  }

  flatMap<R>(fn: (value: T) => R[] | Iterator<R>): ExperimentalIterator<R> {
    const iter = this.iterator
    const gen = function* () {
      let result = iter.next()
      while (!result.done) {
        yield* generator(fn(result.value))
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  map<R>(fn: (value: T) => R): ExperimentalIterator<R> {
    const iter = this.iterator
    const gen = function* () {
      let result = iter.next()
      while (!result.done) {
        yield fn(result.value)
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  collect<R>(fn: (rolling: R, value: T) => R, initial: R): ExperimentalIterator<[R, T]> {
    const iter = this.iterator
    const gen = function* () {
      let r = initial
      let result = iter.next()
      while (!result.done) {
        const value = result.value
        const n = fn(r, value)
        const yielded: [R, T] = [n, value]
        yield yielded
        r = n
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  take(n: number): ExperimentalIterator<T> {
    const iter = this.iterator
    const gen = function* () {
      let c = 0
      let result = iter.next()
      while (c < n && !result.done) {
        yield result.value
        c = c + 1
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  takeWhile(predicate: (value: T) => boolean, inclusive: boolean = false): ExperimentalIterator<T> {
    const iter = this.iterator
    const gen = function* () {
      let result = iter.next()
      while (!result.done && predicate(result.value)) {
        yield result.value
        result = iter.next()
      }
      if (!result.done && inclusive) {
        yield result.value
      }
    }
    return new ExperimentalIterator(gen())
  }

  drop(n: number): ExperimentalIterator<T> {
    const iter = this.iterator
    const gen = function* () {
      let c = 0
      let result = iter.next()
      while (!result.done) {
        if (c > n) {
          yield result.value
        } else {
          c = c + 1
        }
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  filter(predicate: (value: T) => boolean): ExperimentalIterator<T> {
    const iter = this.iterator
    const gen = function* () {
      let result = iter.next()
      while (!result.done) {
        if (predicate(result.value)) {
          yield result.value
        }
        result = iter.next()
      }
    }
    return new ExperimentalIterator(gen())
  }

  every(predicate: (value: T) => boolean): boolean {
    let result = this.iterator.next()
    while (!result.done) {
      if (!predicate(result.value)) {
        return false
      }
      result = this.iterator.next()
    }
    return true
  }

  some(predicate: (value: T) => boolean): boolean {
    let result = this.iterator.next()
    while (!result.done) {
      if (predicate(result.value)) {
        return true
      }
      result = this.iterator.next()
    }
    return false
  }

  reduce<R>(fn: (accumulator: R, value: T) => R, initial: R): R {
    let a = initial
    let result = this.iterator.next()
    while (!result.done) {
      a = fn(a, result.value)
      result = this.iterator.next()
    }
    return a
  }

  first(): T {
    const result = this.iterator.next()
    if (result.done) {
      throw new Error('Iterator is already done')
    }
    return result.value
  }

  last(): T {
    let result = this.iterator.next()
    while (!result.done) {
      const value = result.value
      result = this.iterator.next()
      if (result.done) {
        return value
      }
    }
    throw new Error('Iterator is already done')
  }

  toArray(): T[] {
    return Array.from(this.iterator)
  }

  toMap<K extends PropertyKey>(fn: (value: T) => K): Map<K, T> {
    return new Map(this.map(value => [fn(value), value]))
  }

  static loop<T>(values: T[] | IterableIterator<T>): ExperimentalIterator<T> {
    const entries = Array.from(values)
    const gen = function* () {
      let i = 0
      while (true) {
        yield entries[i % entries.length]!
        i = i + 1
      }
    }
    return new ExperimentalIterator(gen())
  }
}
