import { loadInput, matchGroups, parseIntegers, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export type Card = {
  numbers: number[]
  winning: number[]
  matches: number[]
}

export const cardMatcher = /Card\s+\d+:\s+(?<numbersText>[0-9 ]+)\s+\|\s+(?<winningText>[0-9 ]+)/

export const countPoints = (card: Card): number => {
  const { matches } = card
  return matches.length === 0 ? 0 : Math.pow(2, matches.length - 1)
}

export const parseCard = (data: string): Card => {
  const { numbersText, winningText } = matchGroups(data, cardMatcher)
  const numbers = parseIntegers(numbersText!)
  const winning = parseIntegers(winningText!)
  const matches = numbers.filter(n => winning.includes(n))

  return {
    numbers,
    winning,
    matches,
  }
}

export const solve = (): number => {
  return parseLines(loadInput(__dirname)).map(parseCard).map(countPoints).reduce(sum)
}
