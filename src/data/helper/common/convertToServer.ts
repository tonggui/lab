import { TimeZone } from '../../interface/common';
import { LimitSale } from '../../interface/product';
import moduleControl from '@/module'
import { PRODUCT_LIMIT_SALE } from '@/module/moduleTypes'

export const convertLimitSaleValue = (limitSale: LimitSale, isMultiPoi?): string | void => {

  const { status, range = [], max, multiPoi } = limitSale
  const rule = +limitSale.rule || 1
  const [start = '', end = ''] = range
  const isLimit = !!status
  return JSON.stringify({
    limitSale: isLimit,
    begin: isLimit ? start.split('').filter(v => v !== '-').join('') : '',
    end: isLimit ? end.split('').filter(v => v !== '-').join('') : '',
    type: isLimit ? (rule < 0 ? 2 : 1) : 1,
    frequency: isLimit ? (rule > 0 ? rule : 1) : 1,
    count: isLimit ? (+max || 0) : 0,
    multiPoi: isMultiPoi ? !!multiPoi : undefined
  })
}

export const convertLimitSale = (limitSale: LimitSale, isMultiPoi?): string | void => {
  const states = moduleControl.states
  const isLimitSale = states[PRODUCT_LIMIT_SALE]

  if (!isLimitSale) {
    return
  }

  return convertLimitSaleValue(limitSale, isMultiPoi)
}

export const convertTimeZone = (timezone: TimeZone) => {
  const { days, timeList } = timezone
  return days.reduce((prev: any, d: number | string) => {
    prev[Number(d) + 1] = timeList
    return prev
  }, {})
}
