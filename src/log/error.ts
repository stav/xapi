import fs from 'fs'

interface Params {
  reason: string
}

interface GeneralError {
  message?: string
  params?: Params
}

export async function logErrorToConsole (_e: unknown, ...data: any[]): Promise<void> {
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
  console.error('ERROR:', message.replace(/^[\s|]+/, ''), ...data)
}

export function logErrorToFile (e: unknown, optionalParams: any[]): void {
  try {
    const json = JSON.stringify([e, ...optionalParams]) + '\n'
    fs.appendFile('./log/error', json, ()=>{})
  }
  catch (e: unknown) {
    logErrorToConsole(e, optionalParams)
  }
}
