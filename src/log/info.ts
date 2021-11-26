import fs from 'fs'

import { logErrorToFile } from './error'

export function printInfoToConsole (...messages: any[]): void {
  console.info(...messages)
}

export function logInfoToFile (...messages: any[]): void {
  try {
    fs.appendFile('./log/info.jsonl', JSON.stringify(messages) + '\n', ()=>{})
  }
  catch (e: unknown) {
    logErrorToFile(e)
  }
}
