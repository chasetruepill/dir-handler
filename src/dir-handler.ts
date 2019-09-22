import * as fs from 'fs'
import * as path from 'path'

function where (): string {
  const _ = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack!.slice(1)
  Error.prepareStackTrace = _
  const caller = (stack as any).find((c: NodeJS.CallSite) => c.getFileName() !== null)

  return path.dirname(caller.getFileName())
}

const dirHandler = (dir: string) => (handler: Function) => {
  const files = fs.readdirSync(dir)

  const actionable = files.filter((filename: string) => {
    const lowered = filename.toLowerCase()

    return !['index.js', 'index.ts'].includes(lowered) && !lowered.startsWith('.') && ['.ts', '.js'].includes(lowered.slice(-3))
  })

  return actionable.reduce((forExport: object, filename: string) => {
    const content = require(path.join(dir, filename))
    const e = handler({ filename: filename.substring(0, filename.length - 3), content: content.default || content })

    return { ...forExport, ...e }
  }, {})
}

export {
  dirHandler,
  where
}
