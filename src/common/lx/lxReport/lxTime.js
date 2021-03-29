const SearchTime = {
  _searchStartTime: null,
  _searchEndTime: null,
  get searchStartTime () {
    return this._searchStartTime
  },
  set searchStartTime (val) {
    this._searchStartTime = val || +new Date()
  },
  get searchEndTime () {
    return this._searchEndTime
  },
  set searchEndTime (val) {
    this._searchEndTime = val || +new Date()
  },
  clearSearchTime () {
    this._searchEndTime = null
    this._searchStartTime = null
  },
  getSearchTime () {
    if (this._searchStartTime && this._searchEndTime) {
      return (this._searchEndTime - this._searchStartTime) / 1000
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
      return (this._fillEndTime - this._fillStartTime) / 1000
    }
    return 0
  }
}

export {
  SearchTime,
  FillTime
}
