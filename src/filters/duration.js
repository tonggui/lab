export default function (value) {
  const hour = Math.floor(value / 3600)
  const min = Math.floor((value % 3600) / 60)
  const sec = value % 60
  return `${hour > 0 ? hour + ':' : ''}${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
}
