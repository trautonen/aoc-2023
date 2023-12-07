import { exit } from 'process'
import * as semver from 'semver'
import config from '../package.json' assert { type: 'json' }
import { isTest } from './utils/input'

const checkNodeVersion = () => {
  const version = process.version.substring(1)
  if (!semver.satisfies(version, config.engines.node)) {
    console.log(`Node version ${version} does not satisfy ${config.engines.node}`)
    exit(1)
  }
}

const run = async () => {
  checkNodeVersion()

  const day = parseInt(process.argv[2]!, 10)
  const part = process.argv[3]
  if (Number.isNaN(day)) {
    throw new Error('Invalid error')
  }
  const expected = process.argv[4]

  const module = `day${day.toString().padStart(2, '0')}/${part}`
  const exports = await import(`./${module}`)

  console.log()
  console.time(module)
  const answer = exports.solve()
  console.timeEnd(module)
  let message = `answer: ${answer}`
  let failure = false
  if (expected && !isTest()) {
    if (expected === answer.toString()) {
      message += ' ✔'
    } else {
      failure = true
      message += ` ✗   (expected ${expected})`
    }
  }
  console.log(message)
  console.log()
  if (failure) {
    exit(1)
  } else {
    exit(0)
  }
}

run()
