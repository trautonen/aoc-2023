import { loadInput, multiply, parseIntegers, parseLines } from '../utils/input'

process.env['TEST'] = 'false'

export type Race = {
  time: number
  record: number
}

export const calculateDistance = (holdTime: number, time: number): number => {
  return (time - holdTime) * holdTime
}

export const minWinHoldTime = (race: Race): number => {
  for (let h = 1; h < race.time; h++) {
    const distance = calculateDistance(h, race.time)
    if (distance > race.record) {
      return h
    }
  }
  throw new Error(`Can't beat the record`)
}

export const maxWinHoldTime = (race: Race): number => {
  for (let h = race.time - 1; h > 0; h--) {
    const distance = calculateDistance(h, race.time)
    if (distance > race.record) {
      return h
    }
  }
  throw new Error(`Can't beat the record`)
}

export const findNumberOfWinningHoldTimes = (race: Race): number => {
  return maxWinHoldTime(race) - minWinHoldTime(race) + 1
}

export const parseRaces = (data: string): Race[] => {
  const [timesData, distancesData] = parseLines(data)
  const times = parseIntegers(timesData!.split(':')[1]!, /\s+/)
  const distances = parseIntegers(distancesData!.split(':')[1]!, /\s+/)
  if (times.length !== distances.length) {
    throw new Error('Race data is asymmetric')
  }
  const races: Race[] = []
  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i]!, record: distances[i]! })
  }
  return races
}

export const solve = (): number => {
  return parseRaces(loadInput(__dirname)).map(findNumberOfWinningHoldTimes).reduce(multiply)
}
