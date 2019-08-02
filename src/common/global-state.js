import Vue from 'vue'
import { fetchGetTagList } from '@/data/repos/category'

const globalState = Vue.observable({
  tagList: []
})

export function getTagList () {
  if (!globalState.tagList || globalState.tagList.length < 1) {
    return fetchGetTagList().then(data => {
      globalState.tagList = data || []
      return globalState.tagList
    })
  }
  return Promise.resolve(globalState.tagList)
}

export default globalState
