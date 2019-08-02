import { TimeZone } from '../../interface/common';

export const convertTimeZone = (timezone: TimeZone) => {
  const { days, timeList } = timezone
  return days.reduce((prev: any, d: number | string) => {
    prev[Number(d) + 1] = timeList
    return prev
  }, {})
}
