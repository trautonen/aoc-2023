import { loadInput, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export const parseCalibrationValue = (data: string): number => {
  const firstDigit = data.match(/^\D*(\d)/)?.[1]
  const lastDigit = data.match(/(\d)\D*$/)?.[1]
  return parseInt(firstDigit! + lastDigit!, 10)
}

export const solve = (): number => {
  return parseLines(loadInput(import.meta.url))
    .map(parseCalibrationValue)
    .reduce(sum)
}
