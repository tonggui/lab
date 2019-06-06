import Vue from 'vue'
import { fetchTagList } from '@/data/repos/poiRepository'

const globalState = Vue.observable({
  tagList: []
})

export function getTagList () {
  if (!globalState.tagList || globalState.tagList.length < 1) {
    return fetchTagList().then(data => {
      globalState.tagList = data.tagList || []
      return globalState.tagList
    })
  }
  return Promise.resolve(globalState.tagList)
}

getTagList()

export default globalState
