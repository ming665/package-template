import LOG_LEVEL from '../utils/logLevel'
import normalizePayload from '../utils/normalizer'

/* -------------------------------------------------- */

const IN_BROWSER = process.env.BROWSER

function getOwlType(logLevel) {
  if (logLevel >= LOG_LEVEL.ERROR) {
    return 'error'
  } else if (logLevel >= LOG_LEVEL.WARN) {
    return 'warn'
  } else if (logLevel >= LOG_LEVEL.INFO) {
    return 'info'
  } else {
    return 'debug'
  }
}

function getOwl() {
  let owl

  if (IN_BROWSER) {
    owl = window.owl
  } else {
    owl = global.owl
  }

  return owl || null
}

const outputOwl = (logLevel, payload, group) => {
  const owl = getOwl()

  if (!owl) {
    return
  }

  owl.push({
    type: getOwlType(logLevel),
    label: group || '', // the msg will be recorded on snowplow with action : `FE_${type}_${label}`
    message: payload.message || '',
    context: payload
  })
}

/* -------------------------------------------------- */

const dispatchContent = (logLevel, payload, group) => {
  outputOwl(logLevel, payload, group)
}

/* -------------------------------------------------- */


export default function owlTransport(logLevel, message, meta, group) {
  const payload = normalizePayload(message, meta)

  dispatchContent(logLevel, payload, group)
}
