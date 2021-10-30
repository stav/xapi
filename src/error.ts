interface Params {
  reason: string
}

interface GeneralError {
  message?: string
  params?: Params
}

export default function (_e: unknown) {
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
  console.error(message)
}
