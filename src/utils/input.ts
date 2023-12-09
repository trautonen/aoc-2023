import * as fs from 'fs'
import * as path from 'path'

export const isTest = (): boolean => {
  return process.env['TEST']?.toLowerCase() === 'true'
}

export const loadInput = (url: string): string => {
  const dir = new URL('.', url).pathname
  const file = isTest() ? 'example.txt' : 'input.txt'
  return fs.readFileSync(path.join(dir, file), { encoding: 'utf-8' }).trim()
}

/**
 * @returns [line]
 */
export const parseLines = (data: string): string[] => {
  return data.split(/\n/).map(line => line.trim())
}

/**
 * @returns [number]
 */
export const parseIntegers = (data: string, separator?: RegExp): number[] => {
  const splitter = separator ?? /\s+/
  const matcher = new RegExp(`^(?:${splitter.source})?(.*?)(?:${splitter.source})?$`)
  const match = data.match(matcher)
  if (match && match[1]) {
    return match[1].split(splitter).map(d => {
      const value = parseInt(d, 10)
      if (Number.isNaN(value)) {
        throw new Error(`${d} is not a number`)
      }
      return value
    })
  }
  throw new Error('Invalid input')
}

export const matchGroups = (data: string, regex: RegExp): Record<string, string> => {
  const matches = data.matchAll(new RegExp(regex.source, 'g'))
  const result: Record<string, string> = {}
  for (const match of matches) {
    if (match.groups) {
      for (const [group, value] of Object.entries(match.groups)) {
        if (value) {
          if (result[group]) {
            throw new Error(`Group ${group} already exists`)
          }
          result[group] = value
        }
      }
    }
  }
  return result
}

export const log = <T>(data: T): T => {
  console.dir(data, { colors: true, breakLength: 140, depth: 8 })
  console.log('\n')
  return data
}

export const notEmpty = (data: string): boolean => {
  return data.trim().length > 0
}

export const sum = (a: number, b: number): number => {
  return a + b
}

export const multiply = (a: number, b: number): number => {
  return a * b
}

export const plus =
  (n: number) =>
  (a: number): number => {
    return a + n
  }

export const minus =
  (n: number) =>
  (a: number): number => {
    return a - n
  }

export const min = (a: number, b: number): number => {
  return Math.min(a, b)
}

export const max = (a: number, b: number): number => {
  return Math.max(a, b)
}

export const first = <T>(items: T[]): T => {
  return items[0]!
}

export const last = <T>(items: T[]): T => {
  return items[items.length - 1]!
}

export const reverse = <T>(items: T[]): T[] => {
  return items.toReversed()
}

export const asc = <T extends number | string>(a: T, b: T): number => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

export const toAsc =
  <I, T extends number | string>(fn: (input: I) => T) =>
  (a: I, b: I): number => {
    return asc(fn(a), fn(b))
  }

export const desc = <T extends number | string>(a: T, b: T): number => {
  return asc(a, b) * -1
}

export const toDesc =
  <I, T extends number | string>(fn: (input: I) => T) =>
  (a: I, b: I): number => {
    return desc(fn(a), fn(b))
  }

export const gcd = (...values: number[]): number => {
  const _gcd = (x: number, y: number): number => (y === 0 ? x : _gcd(y, x % y))
  return [...values].reduce((a, b) => _gcd(a, b))
}

export const lcm = (...values: number[]): number => {
  const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y)
  return [...values].reduce((a, b) => _lcm(a, b))
}

export const objectFromEntries = <const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] }
}
