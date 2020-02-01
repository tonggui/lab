import { TimeZone } from '../../interface/common';
import { LimitSale } from '../../interface/product';

export const convertLimitSale = (limitSale: LimitSale): string => {
  const { status, range = [], rule, max } = limitSale
  const [start = '', end = ''] = range
  return JSON.stringify({
    limitSale: !!status,
    begin: start.split('').filter(v => v !== '-').join(''),
    end: end.split('').filter(v => v !== '-').join(''),
    type: +rule || 0,
    count: +max || 0
  })
}

export const convertTimeZone = (timezone: TimeZone) => {
  const { days, timeList } = timezone
  return days.reduce((prev: any, d: number | string) => {
    prev[Number(d) + 1] = timeList
    return prev
  }, {})
}
