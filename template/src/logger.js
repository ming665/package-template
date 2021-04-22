import LOG_LEVEL from './utils/logLevel'
import isPlainObject from './utils/isPlainObject'
import isUndefined from './utils/isUndefined'

import consoleTransport from './transport/console'
import owlTransport from './transport/owl'
import eagletTransport from './transport/eaglet'
import sentryTransport from './transport/sentry'

/* ----------------------------------------- */

const config = {
  transport: {
    owl: false,
    eaglet: false,
    sentry: false,
    console: true,
  },
  fields: {}
}

const acceptFields = ['app', 'prdline']

export function configure({ transport, fields }) {
  if (isPlainObject(transport)) {
    config.transport = Object.assign(config.transport, transport)
  }

  if (isPlainObject(fields)) {
    acceptFields.forEach(key => {
      if (key in fields) {
        config.fields[key] = fields[key]
      }
    })
  }
}

/* ----------------------------------------- */

function shouldTransport(transportConfig, logLevel) {
  if (transportConfig === true) {
    return true
  }

  if (typeof transportConfig === 'number' && logLevel >= transportConfig) {
    return true
  }

  return false
}

function log(logLevel, message, meta, group, transport = {}) {
  if (isPlainObject(meta)) {
    meta = { ...config.fields, ...meta }
  } else {
    meta = config.fields
  }

  if (shouldTransport(isUndefined(transport.console) ? config.transport.console : transport.console, logLevel)) {
    consoleTransport(logLevel, message, meta, group)
  }

  if (shouldTransport(isUndefined(transport.owl) ? config.transport.owl : transport.owl, logLevel)) {
    owlTransport(logLevel, message, meta, group)
  }

  if (shouldTransport(isUndefined(transport.eaglet) ? config.transport.eaglet : transport.eaglet, logLevel)) {
    eagletTransport(logLevel, message, meta, group)
  }

  if (shouldTransport(isUndefined(transport.sentry) ? config.transport.sentry : transport.sentry, logLevel)) {
    sentryTransport(logLevel, message, meta, group)
  }
}

/* ----------------------------------------- */

const wrap = logLevel => (message, meta, group, transport) => log(logLevel, message, meta, group, transport)

export const error = wrap(LOG_LEVEL.ERROR)
export const warn = wrap(LOG_LEVEL.WARN)
export const info = wrap(LOG_LEVEL.INFO)
export const debug = wrap(LOG_LEVEL.DEBUG)
export const fatal = (message, meta, group, transport) => {
  error(message, meta, group, transport)
  throw message
}

export const assert = (check, message) => {
  if (!check) {
    fatal(message)
  }
}

export { LOG_LEVEL }
