import { loadInput, matchGroups, max, min, parseIntegers, parseLines } from '../utils/input'

process.env['TEST'] = 'false'

export type SeedRange = {
  start: number
  length: number
}

export type RangeDestinations = {
  destinations: SeedRange[]
  missing: SeedRange[]
}

export type RangeMapping = {
  source: number
  destination: number
  length: number

  getRangeDestinations: (range: SeedRange) => RangeDestinations
}

export type CategoryMapping = {
  source: string
  destination: string
  rangeMappings: RangeMapping[]

  getRangeDestinations: (range: SeedRange) => SeedRange[]
}

export type Almanac = {
  seeds: number[]
  categoryMappings: CategoryMapping[]

  getRangeDestinations: (range: SeedRange) => SeedRange[]
}

export type ParserType = 'seeds' | 'category' | 'range'

export type ParserResult = {
  seeds: number[]
  mappings: CategoryMapping[]
}

export type Parser<T extends ParserType, O extends ParserType> = {
  type: T
  almanac: Almanac
  append: (line: string) => Parser<T | O, ParserType>
}

export const initialCategory = 'seed'
export const seedsMatcher = /seeds:\s+(?<seeds>[0-9 ]+)/
export const categoryHeaderMatcher = /(?<source>[a-zA-Z]+)-to-(?<destination>[a-zA-Z]+)\s+map:/
export const rangeMatcher = /(?<destination>[0-9]+)\s+(?<source>[0-9]+)\s+(?<length>[0-9]+)/

export const mergeRanges = (ranges: SeedRange[]): SeedRange[] => {
  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!
    const b = sorted[i + 1]!
    if (a.start + a.length - 1 >= b.start) {
      const end = max(a.start + a.length - 1, b.start + b.length - 1)
      const merged: SeedRange = {
        start: a.start,
        length: end - a.start + 1,
      }
      return mergeRanges([...sorted.slice(0, i), merged, ...sorted.slice(i + 2)])
    }
  }
  return sorted
}

export const createRangeMapping = (source: number, destination: number, length: number): RangeMapping => {
  const getRangeDestinations = (r: SeedRange) => {
    const destinations: SeedRange[] = []
    const missing: SeedRange[] = []
    if (r.start < source) {
      const start = r.start
      const end = min(r.start + r.length - 1, source - 1)
      missing.push({ start, length: end - start + 1 })
    }
    if (r.start + r.length > source + length) {
      const start = max(r.start, source + length)
      const end = r.start + r.length - 1
      missing.push({ start, length: end - start + 1 })
    }
    if (r.start <= source + length - 1 && r.start + r.length - 1 >= source) {
      const start = max(r.start, source)
      const end = min(r.start + r.length - 1, source + length - 1)
      const delta = destination - source
      destinations.push({ start: start + delta, length: end - start + 1 })
    }
    const result = {
      destinations,
      missing,
    }
    return result
  }

  return {
    source,
    destination,
    length,
    getRangeDestinations,
  }
}

export const createCategoryMapping = (
  source: string,
  destination: string,
  rangeMappings: RangeMapping[]
): CategoryMapping => {
  const getNextRangeDestinations = (ranges: SeedRange[], mappings: RangeMapping[]): SeedRange[] => {
    const [mapping, ...rest] = mappings
    if (!mapping) {
      return ranges
    }
    const allDestinations = ranges.flatMap(range => {
      const { destinations, missing } = mapping.getRangeDestinations(range)
      return [...destinations, ...getNextRangeDestinations(missing, rest)]
    })
    return mergeRanges(allDestinations)
  }
  return {
    source,
    destination,
    rangeMappings,
    getRangeDestinations: (range: SeedRange) => getNextRangeDestinations([range], rangeMappings),
  }
}

export const createAlmanac = (seeds: number[], categoryMappings: CategoryMapping[]): Almanac => {
  const cache: Map<string, CategoryMapping> = new Map(categoryMappings.map(mapping => [mapping.source, mapping]))
  const getNextRangeDestinations = (source: string, destinations: SeedRange[]): SeedRange[] => {
    const mapping = cache.get(source)
    if (!mapping) {
      return destinations
    }
    const newDestinations = destinations.flatMap(range => mapping.getRangeDestinations(range))
    return getNextRangeDestinations(mapping.destination, newDestinations)
  }
  return {
    seeds,
    categoryMappings,
    getRangeDestinations: (range: SeedRange) => getNextRangeDestinations(initialCategory, [range]),
  }
}

export const createRangeParser = (
  seeds: number[],
  categoryMappings: CategoryMapping[],
  categoryMapping: CategoryMapping
): Parser<'range', 'range' | 'category'> => {
  const append = (line: string) => {
    const { source, destination, length } = matchGroups(line, rangeMatcher)
    if (source && destination && length) {
      const rangeMapping = createRangeMapping(parseInt(source, 10), parseInt(destination, 10), parseInt(length, 10))
      const rangeMappings = [...categoryMapping.rangeMappings, rangeMapping]
      const newCategoryMapping = createCategoryMapping(
        categoryMapping.source,
        categoryMapping.destination,
        rangeMappings
      )
      return createRangeParser(seeds, categoryMappings, newCategoryMapping)
    }
    return createCategoryParser(seeds, [...categoryMappings, categoryMapping])
  }
  return {
    type: 'range',
    almanac: createAlmanac(seeds, [...categoryMappings, categoryMapping]),
    append,
  }
}

export const createCategoryParser = (
  seeds: number[],
  categoryMappings: CategoryMapping[]
): Parser<'category', 'range'> => {
  const append = (line: string) => {
    const { source, destination } = matchGroups(line, categoryHeaderMatcher)
    if (source && destination) {
      const mapping = createCategoryMapping(source, destination, [])
      return createRangeParser(seeds, categoryMappings, mapping)
    }
    return createCategoryParser(seeds, categoryMappings)
  }
  return {
    type: 'category',
    almanac: createAlmanac(seeds, categoryMappings),
    append,
  }
}

export const createSeedsParser = (): Parser<'seeds', 'category'> => {
  const append = (line: string) => {
    const { seeds } = matchGroups(line, seedsMatcher)
    if (seeds) {
      return createCategoryParser(parseIntegers(seeds), [])
    }
    return createSeedsParser()
  }
  return {
    type: 'seeds',
    almanac: createAlmanac([], []),
    append,
  }
}

export const parseAlmanac = (data: string): Almanac => {
  const parser: Parser<ParserType, ParserType> = createSeedsParser()
  const result = parseLines(data).reduce((parser, line) => parser.append(line), parser)
  return result.almanac
}

export const solve = (): number => {
  const almanac = parseAlmanac(loadInput(__dirname))
  return almanac.seeds
    .map(seed => ({ start: seed, length: 1 }))
    .flatMap(range => almanac.getRangeDestinations(range))
    .map(destinations => destinations.start)
    .reduce(min)
}
