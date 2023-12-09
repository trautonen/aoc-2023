import { loadInput, log, parseLines, reverse, sum } from '../utils/input'
import { ExperimentalIterator } from '../utils/iterator'
import { extrapolate, parseHistory } from './part1'

process.env['TEST'] = 'false'

export const solve = (): number => {
  return new ExperimentalIterator(parseLines(loadInput(import.meta.url)))
    .map(parseHistory)
    .map(reverse)
    .map(extrapolate)
    .reduce(sum, 0)
}
