import { loadInput, parseIntegers, parseLines, sum } from '../utils/input'
import { ExperimentalIterator } from '../utils/iterator'

process.env['TEST'] = 'false'

export const parseHistory = (data: string): number[] => {
  return parseIntegers(data)
}

export const extrapolate = (values: number[]): number => {
  const differences = new ExperimentalIterator(values)
    .zip(new ExperimentalIterator(values).drop(1))
    .map(([a, b]) => b - a)
    .toArray()
  if (differences.every(difference => difference === 0)) {
    return values.at(-1)!
  }
  return values.at(-1)! + extrapolate(differences)
}

export const solve = (): number => {
  return new ExperimentalIterator(parseLines(loadInput(import.meta.url)))
    .map(parseHistory)
    .map(extrapolate)
    .reduce(sum, 0)
}
