const units = ['B', 'K', 'M', 'G']
export default function (value, unit = 'B') {
  const index = units.indexOf(unit)
  const mi = index < 0 ? 0 : index
  value *= Math.pow(1024, mi)
  let resultIndex = 0
  while (value / 1024 >= 1 && resultIndex < units.length - 1) {
    value /= 1024
    resultIndex++
  }
  value = Math.round(value * 100) / 100
  return `${value}${units[resultIndex]}`
}
