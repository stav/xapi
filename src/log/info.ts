import fs from 'fs'

import { logErrorToFile } from './error'

export function logInfoToConsole (...messages: any[]): void {
  console.log(...messages)
}

export function logInfoToFile (...messages: any[]): void {
  try {
    fs.appendFile('./log/info.jsonl', JSON.stringify(messages) + '\n', ()=>{})
  }
  catch (e: unknown) {
    logErrorToFile(e)
  }
}
