const SearchTime = {
  _tempSearchStartTime: null,
  _tempSearchEndTime: null,
  _searchStartTime: null,
  _searchEndTime: null,
  get searchStartTime () {
    return this._tempSearchStartTime
  },
  set searchStartTime (val) {
    this._tempSearchStartTime = val || +new Date()
  },
  get searchEndTime () {
    return this._tempSearchEndTime
  },
  set searchEndTime (val) {
    this._tempSearchEndTime = val || +new Date()
    if (this._tempSearchStartTime) {
      this._searchStartTime = this._tempSearchStartTime
      this._searchEndTime = this._tempSearchEndTime
      this._tempSearchStartTime = null
      this._tempSearchEndTime = null
    }
  },
  clearSearchTime () {
    this._searchEndTime = null
    this._searchStartTime = null
    this._tempSearchStartTime = null
    this._tempSearchEndTime = null
  },
  getSearchTime () {
    let total = 0
    if (this._searchStartTime) {
      total = Number((((this._searchEndTime || +new Date()) - this._searchStartTime) / 1000).toFixed(2))
    }
    // TODO 避免出现有startTime漏报导致问题
    if ((this._searchEndTime && !this._searchStartTime) || (total > 0 && total <= 2)) {
      total += 2 + Math.random()
    }
    return total
  }
}

const FillTime = {
  _fillStartTime: null,
  _fillEndTime: null,
  get fillStartTime () {
    if (!this._fillStartTime) this._fillStartTime = +new Date()
    return this._fillStartTime
  },
  set fillStartTime (val) {
    this._fillStartTime = val || +new Date()
  },
  get fillEndTime () {
    return this._fillEndTime
  },
  set fillEndTime (val) {
    this._fillEndTime = val || +new Date()
  },
  clearFillTime () {
    this._fillStartTime = null
    this._fillEndTime = null
  },
  getFillTime () {
    let total = 0
    if (this._fillStartTime) {
      total = Number((((this._fillEndTime || +new Date()) - this._fillStartTime) / 1000).toFixed(2))
    }
    return total
  }
}

/**
 * mode
 * s2e: Start to End
 * s2s: Start to Start
 */
class TimeCounter {
  constructor (key, mode = 's2s') {
    this.mode = mode // 's2e', 's2s'
    this._key = key
    this._totalTime = 0
    this._timePoint = null
    this._endTimePoint = null
  }
  get time () {
    return this._timePoint
  }
  set time (val) {
    if (this.mode === 's2s' && val && this._timePoint && val > this._timePoint) {
      this._totalTime += ((val - this._timePoint) / 1000)
      this._timePoint = null
    } else {
      this._totalTime += this.calculateTotalTime()
      this._timePoint = val || +new Date()
    }
    console.log('this-time', this)
  }
  set endTime (val) {
    this._endTimePoint = val
  }
  stop () {
    this._totalTime += this.calculateTotalTime()
    this._timePoint = null
    this._endTimePoint = null
  }
  clearTime () {
    this._timePoint = null
    this._totalTime = 0
    this._endTimePoint = null
  }
  calculateTotalTime () {
    if (this._endTimePoint && this._timePoint && this._endTimePoint > this._timePoint) return Number(((this._endTimePoint - this._timePoint) / 1000).toFixed(2))
    return 0
  }
  getTotal () {
    let total = 0
    if (this.mode === 's2s') total = Number(this._totalTime.toFixed(2))
    else total = Number((this._totalTime + this.calculateTotalTime()).toFixed(2))

    return total
  }
  get totalTime () {
    const total = this.getTotal()

    this.clearTime()
    return total
  }
  get key () {
    return this._key
  }
}

class CategoryAttrTimer extends TimeCounter {
  constructor (key, mode = 's2s', extra = {}) {
    super(key, mode)
    this.id = extra.id
    this.label = extra.label
  }
}

const LABELS = {
  poi: '关联门店',
  picture: '商品图片',
  name: '商品名称',
  category: '商品类目',
  tag: '店内分类',
  upc: '条形码',
  price: '价格',
  stock: '库存',
  weight: '重量',
  minCount: '起购数',
  upcImage: '条码图',
  categoryAttrs: '类目属性',
  sellType: '售卖方式'
}
const TimeCounters = {
  timers: {},
  removeTime (key) {
    if (this.timers.hasOwnProperty(key)) {
      delete this.timers[key]
    }
  },
  clearTime (key) {
    if (!this.timers[key]) { console.error('不存在'); return }
    this.timers[key].clearTime()
  },
  getTotal (key) {
    if (!this.timers[key]) { console.error('不存在'); return 0 }
    return this.timers[key].getTotal() || 0
  },
  setTime (key, val, mode, extra) {
    if (key === 'categoryAttrs' && extra) {
      console.log(key)
      if (!this.timers[extra.id]) {
        this.timers[extra.id] = new CategoryAttrTimer(key, mode, extra)
        this.timers[extra.id].time = val
      }
    } else {
      if (!this.timers[key]) this.timers[key] = new TimeCounter(key, mode, extra)
      this.timers[key].time = val
    }
  },
  setEndTime (key, val) {
    if (!this.timers[key]) { console.error('未设置起始时间'); return }
    this.timers[key].endTime = val
  },
  stopTime (key) {
    if (!this.timers[key]) { console.error('未设置起始时间'); return }
    this.setEndTime(key, Date.now())
    this.timers[key].stop()
  },
  getResult () {
    return Object.values(this.timers).reduce((a, b) => {
      if (b.key === 'categoryAttrs') {
        a += JSON.stringify([`${LABELS[b.key]}-${b.label}`, b.totalTime])
      } else {
        a += JSON.stringify([LABELS[b.key], b.totalTime])
      }
      return a
    }, '')
  }
}
window.TimeCounters = TimeCounters
window.FillTime = FillTime
window.SearchTime = SearchTime

function clearAllTime () {
  TimeCounters.timers = {}
  SearchTime.clearSearchTime()
  FillTime.clearFillTime()
}

export const install = (router) => {
  router.beforeEach((to, _from, next) => {
    setTimeout(() => {
      clearAllTime()
    }, 200)
    next()
  })
  // router.afterEach((to, _from, next) => {
  //   clearAllTime()
  //   next()
  // })
}

export default TimeCounters

export {
  SearchTime,
  FillTime
}
