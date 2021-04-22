import LOG_LEVEL from '../utils/logLevel'
import normalizePayload from '../utils/normalizer'

/* -------------------------------------------------- */

const getEaglet = () => process.env.BROWSER ? window.eaglet : global.eaglet

const getLogLevel = logLevel => {
  let level = 'INFO'

  if (logLevel >= LOG_LEVEL.ERROR) {
    level = 'ERROR'
  } else if (logLevel >= LOG_LEVEL.WARN) {
    level = 'WARN'
  }

  return {
    type: 'LogLevel',
    value: level,
  }
}

const getLogError = payload => {
  const error = {
    message: payload.message,
    stack: payload.stack,
    code: payload.code,
    internal: payload.internal,
  }

  return {
    type: 'LogError',
    value: error,
  }
}

function outputEaglet(logLevel, payload, meta, group) {
  const eaglet = getEaglet()

  if (!eaglet) {
    return
  }

  eaglet.push({
    apmLog: {
      type: 'ApmLog',
      value: {
        group,
        message: payload.message,
        context: JSON.stringify(meta),
        level: getLogLevel(logLevel),
        error: getLogError(payload),
      }
    }
  }, 'ApmTracker')
}

const dispatchContent = (...args) => {
  outputEaglet(...args)
}

/* -------------------------------------------------- */


export default function eagletTransport(logLevel, message, meta, group) {
  const payload = normalizePayload(message)

  dispatchContent(logLevel, payload, meta, group)
}
