import { loadInput, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export type Labels = readonly string[]

export type Label<C extends Labels> = C[number]

export type Hand<C extends Labels> = [Label<C>, Label<C>, Label<C>, Label<C>, Label<C>]

export type Round<C extends Labels> = {
  hand: Hand<C>
  bid: number
}

export type CountByLabel<C extends Labels> = (hand: Hand<C>) => number[]

export type Comparator<T> = (a: T, b: T) => number

export const toSortedCountsByLabel =
  <C extends Labels>(labels: C) =>
  (hand: Hand<C>): number[] => {
    return labels.map(label => hand.filter(card => card === label).length).toSorted((a, b) => b - a)
  }

export const compareLabels =
  <C extends Labels>(labels: C) =>
  (left: Hand<C>, right: Hand<C>): number => {
    for (let i = 0; i < left.length; i++) {
      const leftLabelIndex = labels.indexOf(left[i]!)
      const rightLabelIndex = labels.indexOf(right[i]!)
      if (leftLabelIndex > rightLabelIndex) {
        return -1
      }
      if (leftLabelIndex < rightLabelIndex) {
        return 1
      }
    }
    return 0
  }

export const compareHands =
  <C extends Labels>(labels: C, counter: CountByLabel<C>) =>
  (left: Hand<C>, right: Hand<C>): number => {
    const leftSortedCounts = counter(left)
    const rightCountsByLabel = counter(right)
    if (leftSortedCounts[0]! > rightCountsByLabel[0]!) {
      return 1
    }
    if (leftSortedCounts[0]! < rightCountsByLabel[0]!) {
      return -1
    }
    if (leftSortedCounts[1]! > rightCountsByLabel[1]!) {
      return 1
    }
    if (leftSortedCounts[1]! < rightCountsByLabel[1]!) {
      return -1
    }
    return compareLabels(labels)(left, right)
  }

export const compareRounds =
  <C extends Labels>(comparator: Comparator<Hand<C>>) =>
  (left: Round<C>, right: Round<C>): number => {
    return comparator(left.hand, right.hand)
  }

export const isLabel =
  <C extends Labels>(labels: C) =>
  (value: string): value is Label<C> => {
    return labels.some(label => label === value)
  }

export const parseRound =
  <C extends Labels>(labels: C) =>
  (data: string): Round<C> => {
    const [cardsData, bidData] = data.split(/\s+/)
    const [c1, c2, c3, c4, c5] = cardsData!.split('').filter(isLabel(labels))
    return {
      hand: [c1!, c2!, c3!, c4!, c5!],
      bid: parseInt(bidData!, 10),
    }
  }

export const solve = (): number => {
  const labels = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
  return parseLines(loadInput(import.meta.url))
    .map(parseRound(labels))
    .toSorted(compareRounds(compareHands(labels, toSortedCountsByLabel(labels))))
    .map((hand, rank) => hand.bid * (rank + 1))
    .reduce(sum)
}
