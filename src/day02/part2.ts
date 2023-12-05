import { loadInput, max, multiply, objectFromEntries, parseLines, sum } from '../utils/input'
import { Color, Game, Pick, colors, parseGame } from './part1'

process.env['TEST'] = 'false'

export const findMinimumContent = (game: Game): Pick => {
  const { picks } = game

  const maxPicks: ReadonlyArray<[Color, number]> = colors.map(color => {
    const most = picks.map(pick => pick[color]).reduce(max)
    return [color, most]
  })

  return objectFromEntries(maxPicks)
}

export const countProduct = (pick: Pick): number => {
  return colors.map(color => pick[color]).reduce(multiply)
}

export const solve = (): number => {
  return parseLines(loadInput(__dirname)).map(parseGame).map(findMinimumContent).map(countProduct).reduce(sum)
}
