import { loadInput, parseLines, plus, sum } from '../utils/input'
import { Card, parseCard } from './part1'

process.env['TEST'] = 'false'

export const findNumberOfWinningCards = (card: Card, index: number, cards: Card[]): number => {
  const { matches } = card
  const winningCards = matches
    .map((n, i) => {
      const winningCardIndex = index + 1 + i
      const winningCard = cards[winningCardIndex]
      if (!winningCard) {
        return 0
      }
      return findNumberOfWinningCards(winningCard, winningCardIndex, cards)
    })
    .reduce(sum, 0)
  return matches.length + winningCards
}

export const solve = (): number => {
  return parseLines(loadInput(__dirname)).map(parseCard).map(findNumberOfWinningCards).map(plus(1)).reduce(sum)
}
