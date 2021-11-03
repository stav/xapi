interface Params {
  reason: string
}

interface GeneralError {
  message?: string
  params?: Params
}

export async function error (_e: unknown, ...data: any[]): Promise<void> {
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
  console.error('ERROR:', message.replace(/^[\|\s]+/, ''))
}

export default class Console {

  error(e?: unknown, ...optionalParams: any[]): void {
    error(e)
  }

}
