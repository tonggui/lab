// import Vue from 'vue'

export const KEYS = {
  SEARCH_SUGGEST_HISTORY: 'searchHistoryList'
}

const storage = {}

for (let key in KEYS) {
  Object.defineProperty(storage, KEYS[key], {
    get () {
      const value = localStorage.getItem(KEYS[key])
      if (value !== undefined) {
        let data = value
        try {
          data = JSON.parse(value)
        } catch (err) {}
        return data
      }
      return value
    },
    set (value) {
      const encodeValue = JSON.stringify(value)
      localStorage.setItem(KEYS[key], encodeValue)
    }
  })
}

export default storage
