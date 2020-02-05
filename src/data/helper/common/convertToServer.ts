import { TimeZone } from '../../interface/common';
import { LimitSale } from '../../interface/product';

export const convertLimitSale = (limitSale: LimitSale): string => {
  const { status, range = [], rule, max } = limitSale
  const [start = '', end = ''] = range
  const isLimit = !!status
  return JSON.stringify({
    limitSale: isLimit,
    begin: isLimit ? start.split('').filter(v => v !== '-').join('') : '',
    end: isLimit ? end.split('').filter(v => v !== '-').join('') : '',
    type: isLimit ? (+rule || 1) : 1,
    count: isLimit ? (+max || 0) : 0
  })
}

export const convertTimeZone = (timezone: TimeZone) => {
  const { days, timeList } = timezone
  return days.reduce((prev: any, d: number | string) => {
    prev[Number(d) + 1] = timeList
    return prev
  }, {})
}
