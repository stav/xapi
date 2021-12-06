import fs from 'fs'
import { stringify } from 'flatted'
import { printErrorToConsole } from './error'

export function logMessageToFile (fileName: string, ...messages: any[]): void {
  const data = stringify([ new Date(), messages ])
  try {
    fs.appendFile(`./log/${fileName}.jsonl`, data + '\n', ()=>{})
  }
  catch (e: unknown) {
    printErrorToConsole(e)
  }
}
