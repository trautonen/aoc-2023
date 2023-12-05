import { loadInput, multiply, sum } from '../utils/input'
import { Coordinate, PartNumber, Schematic, parseSchematic } from './part1'

process.env['TEST'] = 'false'

export type Gear = {
  coordinate: Coordinate
  adjacents: PartNumber[]
}

export const gearSymbol = '*'

export const isAdjacentToCoordinate = (part: PartNumber, coordinate: Coordinate) => {
  const { y: partY, x: partX } = part.coordinate
  const { y, x } = coordinate
  return y >= partY - 1 && y <= partY + 1 && x >= partX - 1 && x <= partX + part.length
}

export const parseGears = (schematic: Schematic): Gear[] => {
  const { getSymbol, parts, height, width } = schematic
  const gears: Gear[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coordinate = { y, x }
      const char = getSymbol(coordinate)
      if (char === gearSymbol) {
        const adjacents = parts.filter(part => isAdjacentToCoordinate(part, coordinate))
        gears.push({
          coordinate,
          adjacents,
        })
      }
    }
  }
  return gears
}

export const solve = (): number => {
  return parseGears(parseSchematic(loadInput(__dirname)))
    .filter(gear => gear.adjacents.length === 2)
    .map(gear => gear.adjacents.map(pn => pn.value).reduce(multiply))
    .reduce(sum)
}
