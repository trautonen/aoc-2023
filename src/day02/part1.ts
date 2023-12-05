import { loadInput, matchGroups, objectFromEntries, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export const colors = ['red', 'blue', 'green'] as const

export type Color = (typeof colors)[number]

export type Pick = {
  [Key in Color]: number
}

export type Game = {
  id: number
  picks: Pick[]
}

export const content: Pick = {
  red: 12,
  blue: 14,
  green: 13,
}

export const colorMatcher = new RegExp(colors.map(c => `(?<${c}>[0-9]+) ${c}`).join('|'))

export const parseGame = (data: string): Game => {
  const { id, records } = matchGroups(data, /Game (?<id>\d+): (?<records>.*)/)
  const picks = records?.split(';').map(record => {
    const groups = matchGroups(record, colorMatcher)

    const counts: ReadonlyArray<[Color, number]> = colors.map(color => {
      const count = groups[color]
      return [color, count ? parseInt(count, 10) : 0]
    })

    return objectFromEntries(counts)
  })

  return {
    id: parseInt(id!, 10),
    picks: picks ?? [],
  }
}

export const isPossibleGame = (game: Game, allowed: Pick): boolean => {
  return game.picks.every(pick => colors.every(color => pick[color] <= allowed[color]))
}

export const solve = (): number => {
  return parseLines(loadInput(__dirname))
    .map(parseGame)
    .filter(g => isPossibleGame(g, content))
    .map(g => g.id)
    .reduce(sum)
}
