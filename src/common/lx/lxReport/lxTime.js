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
    if (this._tempSearchStartTime && this._tempSearchEndTime) {
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
    if (this._searchStartTime && this._searchEndTime) {
      return Number(((this._searchEndTime - this._searchStartTime) / 1000).toFixed(2))
    }
    return 0
  }
}

const FillTime = {
  _fillStartTime: null,
  _fillEndTime: null,
  get fillStartTime () {
    return this._fillEndTime
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
    if (this._fillStartTime && this._fillEndTime) {
      return Number(((this._fillEndTime - this._fillStartTime) / 1000).toFixed(2))
    }
    return 0
  }
}

class TimeCounter {
  constructor (key) {
    this._key = key
    this._totalTime = 0
    this._timePoint = null
  }
  get time () {
    return this._timePoint
  }
  set time (val) {
    if (val && this._timePoint && val > this._timePoint) {
      this._totalTime += (val - this._timePoint) / 1000
      this._timePoint = null
    } else {
      this._timePoint = val || +new Date()
    }
  }
  clearTime () {
    this._timePoint = null
    this._totalTime = 0
  }
  get totalTime () {
    const total = this._totalTime.toFixed(2)
    this.clearTime()
    return total
  }
  get key () {
    return this._key
  }
}

// const PicSelectTime = {
//   _totalTime: 0,
//   _selectStartTime: null,
//   _selectEndTime: null,
//   get selectStartTime () {
//     return this._selectStartTime
//   },
//   set selectStartTime (val) {
//     this._fillStartTime = val || +new Date()
//   },
//   get selectEndTime () {
//     return this._selectEndTime
//   },
//   set selectEndTime (val) {
//     this._selectEndTime = val || +new Date()
//     if (this._selectStartTime && this._selectEndTime) {
//       this._totalTime += (this._selectEndTime - this._selectStartTime)
//       this._selectStartTime = null
//       this._selectEndTime = null
//     }
//   },
//   clearFillTime () {
//     this._selectStartTime = null
//     this._selectEndTime = null
//     this._totalTime = null
//   },
//   getSelectTime () {
//     return this._totalTime
//   }
// }

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
  minCount: '起购数'
}
const TimeCounters = {
  timers: {},
  setTime (key, val) {
    if (!this.timers[key]) this.timers[key] = new TimeCounter(key)
    this.timers[key].time = val
  },
  getResult () {
    return Object.values(this.timers).reduce((a, b) => {
      a += JSON.stringify([LABELS[b.key], b.totalTime])
      return a
    }, '')
  }
}
window.TimeCounters = TimeCounters
export default TimeCounters

export {
  SearchTime,
  FillTime
}
