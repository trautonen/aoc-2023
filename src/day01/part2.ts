import { first, last, loadInput, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
export const numericMatcher = new RegExp(`(?=([0-9]|${numbers.join('|')}))`, 'g')

export const parseDigit = (value: string): number => {
  const digit = parseInt(value, 10)
  if (Number.isNaN(digit)) {
    return numbers.indexOf(value) + 1
  }
  return digit
}

export const parseCalibrationValue = (data: string): number => {
  const matches = [...data.matchAll(numericMatcher)].map(match => match[1]!).map(parseDigit)
  return parseInt('' + first(matches) + last(matches), 10)
}

export const solve = (): number => {
  return parseLines(loadInput(import.meta.url))
    .map(parseCalibrationValue)
    .reduce(sum)
}
