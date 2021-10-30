export function setup (): void {
  process.stdin.setEncoding('utf8')
  process.stdin.setRawMode(true) // false sends chunk after enter is pressed
  process.stdin.resume() // running in parent process event loop
}
