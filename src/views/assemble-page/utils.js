export function getFuncName (func) {
  return this.name || this.toString().match(/function\s*([^(]*)\(/)[1]
}
