import { loadInput, parseLines, sum } from '../utils/input'
import { Hand, Labels, compareHands, compareRounds, parseRound } from './part1'

process.env['TEST'] = 'false'

export const toSortedCountsByLabelWithJoker =
  <C extends Labels>(labels: C) =>
  (hand: Hand<C>): number[] => {
    const counts = labels.map(label => hand.filter(card => card === label).length)
    const jokerCounts = counts.at(-1)!
    const labelCounts = counts.slice(0, -1).toSorted((a, b) => b - a)
    labelCounts[0] = labelCounts[0]! + jokerCounts
    return labelCounts
  }

export const solve = (): number => {
  const labels = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'] as const
  return parseLines(loadInput(import.meta.url))
    .map(parseRound(labels))
    .toSorted(compareRounds(compareHands(labels, toSortedCountsByLabelWithJoker(labels))))
    .map((hand, rank) => hand.bid * (rank + 1))
    .reduce(sum)
}
