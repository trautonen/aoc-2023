import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const dir = new URL('.', import.meta.url).pathname
const inputFile = 'input.txt'
const cookieFile = 'AOC_COOKIE'

const inputUrl = (day: number): string => {
  return `https://adventofcode.com/2023/day/${day}/input`
}

const fileExists = async (location: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(location)
    return stat.isFile()
  } catch {
    return false
  }
}

const loadCookie = async (): Promise<string> => {
  const cookieLocation = path.join(dir, '..', cookieFile)
  const cookieExists = await fileExists(cookieLocation)
  if (!cookieExists) {
    throw new Error(`Cookie file ${cookieLocation} does not exist`)
  }
  return fs.readFile(cookieLocation, { encoding: 'utf8' })
}

export const download = async (day: number): Promise<void> => {
  const inputLocation = path.join(dir, `day${day.toString().padStart(2, '0')}`, inputFile)
  const inputExists = await fileExists(inputLocation)
  if (!inputExists) {
    const cookie = await loadCookie()
    const response = await fetch(inputUrl(day), {
      headers: { Cookie: cookie },
    })
    if (!response.body) {
      throw new Error('Empty input response')
    }
    await fs.writeFile(inputLocation, response.body)
  }
}
