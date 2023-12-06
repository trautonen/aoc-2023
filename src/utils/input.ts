import * as fs from 'fs'
import * as path from 'path'

export const isTest = (): boolean => {
  return process.env['TEST']?.toLowerCase() === 'true'
}

export const loadInput = (dir: string): string => {
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
export const parseIntegers = (data: string, separator: string | RegExp): number[] => {
  return data
    .trim()
    .split(separator)
    .map(d => {
      const value = parseInt(d, 10)
      if (Number.isNaN(value)) {
        throw new Error(`${d} is not a number`)
      }
      return value
    })
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

export const objectFromEntries = <const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] }
}
