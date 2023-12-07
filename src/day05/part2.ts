import { loadInput, log, min } from '../utils/input'
import { SeedRange, parseAlmanac } from './part1'

process.env['TEST'] = 'false'

const parseSeedRanges = (seeds: number[]): SeedRange[] => {
  const ranges: SeedRange[] = []
  if (seeds.length % 2 !== 0) {
    throw new Error('Not even number of seeds')
  }
  for (let i = 0; i < seeds.length; i++) {
    const start = seeds[i]!
    const length = seeds[++i]!
    ranges.push({ start, length })
  }
  return ranges
}

export const solve = (): number => {
  const almanac = parseAlmanac(loadInput(import.meta.url))
  return parseSeedRanges(almanac.seeds)
    .flatMap(range => almanac.getRangeDestinations(range))
    .map(destinations => destinations.start)
    .reduce(min)
}
