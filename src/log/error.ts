import fs from 'fs'
import { logMessageToFile } from './file'

interface Params {
  reason: string
}

interface GeneralError {
  message?: string
  params?: Params
}

function getErrorMessage(_e: unknown): string {
  const e: GeneralError = <GeneralError>_e
  let message = ''
  if (e.message) {
    message += ' | ' + e.message
  }
  if (e.params?.reason) {
    message += ' | ' + JSON.stringify(e.params.reason)
  }
  if (!message) {
    message = e.toString()
  }
  return message.replace(/^[\s|]+/, '')
}

export async function printErrorToConsole (e: unknown, ...data: any[]): Promise<void> {
  console.error('ERROR:', getErrorMessage(e), ...data)
}

export function logError(e?: unknown, ...optionalParams: any[]): void {
  logMessageToFile('error', getErrorMessage(e), optionalParams)
  if (process.env.NODE_ENV !== 'test') {
    printErrorToConsole(e, optionalParams)
  }
}
