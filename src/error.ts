export default function (e: any) {
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
