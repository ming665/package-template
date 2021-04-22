import LOG_LEVEL from '../utils/logLevel'
import isError from '../utils/isError'

/* -------------------------------------------------- */

const IN_BROWSER = process.env.BROWSER

const getSentry = () => IN_BROWSER ? window.sentry : global.sentry

const getLogLevel = logLevel => {
  if (logLevel >= LOG_LEVEL.ERROR) {
    return 'error'
  } else if (logLevel >= LOG_LEVEL.WARN) {
    return 'warning'
  } else {
    return 'info'
  }
}

export default function sentryTransport(logLevel, message, meta = {}) {
  const sentry = getSentry()

  if (!sentry) {
    if (IN_BROWSER) {
      const buffer = window.__ERROR_TRACKER_BUFFER__ // eslint-disable-line no-underscore-dangle

      if (buffer) {
        buffer.push({
          error: message,
          level: getLogLevel(logLevel),
          extra: meta
        })
      }
    }
    return
  }
  
  if (isError(message)) {
    sentry.captureException(message, {
      extra: meta
    })
  } else if (logLevel >= LOG_LEVEL.ERROR) {
    sentry.captureMessage(message, {
      level: getLogLevel(logLevel),
      extra: meta
    })
  } else {
    // 除了 error 之外，其他所有东西都进 breadcrumb，只有当错误发生的时候才传送到 server
    sentry.captureBreadcrumb({
      message,
      category: 'logger',
      level: getLogLevel(logLevel),
      data: meta
    })
  }
}