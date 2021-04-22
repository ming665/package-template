import isError from './isError'
import isPlainObject from './isPlainObject'

export default function normalizePayload(message, meta) {
  const payload = {}

  if (isPlainObject(meta)) {
    for (let key in meta) {
      if (meta.hasOwnProperty(key)) {
        payload[key] = meta[key]
      }
    }
  }

  if (isError(message)) {
    payload.error = true
    payload.stack = message.stack || ''
    payload.message = message.message || ''

    // if it is http module handled error, it will contains code & internal flag
    if (typeof message.code !== 'undefined') {
      payload.code = message.code || ''
    }

    if (typeof message.internal !== 'undefined') {
      payload.internal = message.internal
    }

  } else if (isPlainObject(message)) {
    payload.message = 'no_message'

    for (let key in message) {
      if (message.hasOwnProperty(key)) {
        payload[key] = message[key]
      }
    }
  } else {
    payload.message = String(message)
  }

  const isPlain = Object.keys(payload).length === 1

  Object.defineProperty(payload, 'plain', {
    value: isPlain
  })

  return payload
}
