import LOG_LEVEL from '../utils/logLevel'
import normalizePayload from '../utils/normalizer'

/* -------------------------------------------------- */

const SUPPORTS_FANCY_CONSOLE = console.error && console.debug // eslint-disable-line
const IN_BROWSER = process.env.BROWSER

const getMethod = logLevel => {
  if (SUPPORTS_FANCY_CONSOLE) {
    if (logLevel >= LOG_LEVEL.ERROR) {
      return 'error'
    } else if (logLevel >= LOG_LEVEL.WARN) {
      return 'warn'
    } else if (logLevel >= LOG_LEVEL.INFO) {
      return 'info'
    }
  }
  return 'log'
}

const outputConsole = (logLevel, content) => {
  const method = getMethod(logLevel)

  console[method](content) // eslint-disable-line
}

/* -------------------------------------------------- */

// format info for browser
const outputForBrowser = (logLevel, payload) => {
  if (payload.error) {
    outputConsole(logLevel, payload.stack)
  } else if (payload.plain) {
    outputConsole(logLevel, payload.message)
  } else {
    outputConsole(logLevel, payload)
  }
}

// only accept output json on server side
const outputForServer = (logLevel, payload) => {
  if (payload.plain) {
    outputConsole(logLevel, payload.message)
  } else {
    outputConsole(logLevel, JSON.stringify(payload))
  }
}

const dispatchContent = (logLevel, payload) => {
  if (IN_BROWSER) {
    outputForBrowser(logLevel, payload)
  } else {
    outputForServer(logLevel, payload)
  }
}

/* -------------------------------------------------- */


export default function consoleTransport(logLevel, message, meta) {
  const payload = normalizePayload(message, meta)

  dispatchContent(logLevel, payload)
}
