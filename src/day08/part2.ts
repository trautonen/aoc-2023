import { lcm, loadInput } from '../utils/input'
import { ExperimentalIterator } from '../utils/iterator'
import { findStepsToEnd, matchNode, parseNavigationMap } from './part1'

process.env['TEST'] = 'false'

export const solve = (): number => {
  const start = /..A/
  const end = /..Z/
  const { nodes, instructions } = parseNavigationMap(loadInput(import.meta.url))
  const stepsToEnd = new ExperimentalIterator(nodes.values())
    .filter(matchNode(start))
    .map(findStepsToEnd(end, nodes, instructions))
    .toArray()
  return lcm(...stepsToEnd)
}
