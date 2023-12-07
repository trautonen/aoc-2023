import { loadInput, multiply, parseLines } from '../utils/input'
import { Race, findNumberOfWinningHoldTimes } from './part1'

process.env['TEST'] = 'false'

export const parseRaces = (data: string): Race[] => {
  const [timesData, distancesData] = parseLines(data)
  const time = timesData!.split(':')[1]!.replaceAll(/\s+/g, '')
  const distance = distancesData!.split(':')[1]!.replaceAll(/\s+/g, '')
  return [
    {
      time: parseInt(time, 10),
      record: parseInt(distance, 10),
    },
  ]
}

export const solve = (): number => {
  return parseRaces(loadInput(import.meta.url))
    .map(findNumberOfWinningHoldTimes)
    .reduce(multiply, 1)
}
