import moment from 'moment'

export default function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
}
