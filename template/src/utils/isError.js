export default function isError(obj) {
  if (obj instanceof Error) {
    return true
  }

  if (typeof obj === 'object' && obj.message && obj.stack) {
    return true
  }

  return false
}