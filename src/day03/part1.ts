import { loadInput, max, parseLines, sum } from '../utils/input'

process.env['TEST'] = 'false'

export type Coordinate = {
  y: number
  x: number
}

export type PartNumber = {
  coordinate: Coordinate
  value: number
  length: number
}

export type Schematic = {
  getSymbol: (coordinate: Coordinate) => string
  parts: PartNumber[]
  height: number
  width: number
}

export const empty = '.'

export const isNumeric = (value: string): boolean => {
  return value.match(/\d+/) !== null
}

export const parseSchematic = (data: string): Schematic => {
  const lines = parseLines(data)
  const getSymbol = (coordinate: Coordinate): string => {
    const line = lines[coordinate.y]
    return line?.[coordinate.x] ?? empty
  }
  const parts = lines.flatMap((line, y) => {
    const found: PartNumber[] = []
    for (let x = 0; x < line.length; x++) {
      const char = line[x]!
      if (isNumeric(char)) {
        const coordinate = { y, x }
        let numericValue = char
        while (isNumeric(getSymbol({ y, x: x + 1 }))) {
          numericValue += getSymbol({ y, x: x + 1 })
          x += 1
        }
        const value = parseInt(numericValue, 10)
        found.push({
          coordinate,
          value,
          length: value.toString().length,
        })
      }
    }
    return found
  })
  return {
    getSymbol,
    parts,
    height: lines.length,
    width: lines.map(line => line.length).reduce(max),
  }
}

export const isAdjacentToSymbol = (part: PartNumber, schematic: Schematic): boolean => {
  const { coordinate, length } = part

  for (let y = coordinate.y - 1; y <= coordinate.y + 1; y++) {
    for (let x = coordinate.x - 1; x <= coordinate.x + length; x++) {
      const char = schematic.getSymbol({ y, x })
      if (!isNumeric(char) && char !== empty) {
        return true
      }
    }
  }
  return false
}

export const solve = (): number => {
  const schematic = parseSchematic(loadInput(__dirname))
  return schematic.parts
    .filter(part => isAdjacentToSymbol(part, schematic))
    .map(part => part.value)
    .reduce(sum)
}
