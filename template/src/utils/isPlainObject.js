export default function isPlainObject(target) {
  return target && Object.prototype.toString.call(target) === '[object Object]'
}