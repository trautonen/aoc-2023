import { loadInput, matchGroups, notEmpty, parseLines, sum } from '../utils/input'
import { ExperimentalIterator } from '../utils/iterator'

process.env['TEST'] = 'false'

const directions = ['L', 'R'] as const

export type Direction = (typeof directions)[number]

export type Node = {
  value: string
  next: {
    [K in Direction]: string
  }
}

export type NavigationMap = {
  instructions: Direction[]
  nodes: Map<string, Node>
}

const nodeMatcher = /(?<value>[A-Z0-9]{3}) = \((?<left>[A-Z0-9]{3}), (?<right>[A-Z0-9]{3})\)/

const isDirection = (value: string): value is Direction => {
  return directions.some(direction => direction === value)
}

export const createNode = (data: string): Node => {
  const { value, left, right } = matchGroups(data, nodeMatcher)
  if (value && left && right) {
    return { value, next: { L: left, R: right } }
  }
  throw new Error(`Invalid node input ${data}`)
}

export const parseNavigationMap = (data: string): NavigationMap => {
  const iterator = new ExperimentalIterator(parseLines(data))
  const instructions = iterator.first().split('').filter(isDirection)
  const nodes = iterator
    .filter(notEmpty)
    .map(createNode)
    .toMap(node => node.value)
  return {
    instructions,
    nodes,
  }
}

export const matchNode =
  (pattern: RegExp) =>
  (node: Node): boolean => {
    return node.value.match(pattern) !== null
  }

export const findNextNode =
  (nodes: Map<string, Node>) =>
  (node: Node, direction: Direction): Node => {
    return nodes.get(node.next[direction])!
  }

export const findStepsToEnd =
  (end: RegExp, nodes: Map<string, Node>, instructions: Direction[]) =>
  (node: Node): number => {
    const isEndNode = matchNode(end)
    return ExperimentalIterator.loop(instructions)
      .collect(findNextNode(nodes), node)
      .takeWhile(([node]) => !isEndNode(node), true)
      .map(_ => 1)
      .reduce(sum, 0)
  }

export const solve = (): number => {
  const start = /AAA/
  const end = /ZZZ/
  const { nodes, instructions } = parseNavigationMap(loadInput(import.meta.url))
  return new ExperimentalIterator(nodes.values())
    .filter(matchNode(start))
    .map(findStepsToEnd(end, nodes, instructions))
    .first()
}
