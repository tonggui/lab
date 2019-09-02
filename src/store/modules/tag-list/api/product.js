import {
  fetchGetPoiTagInfo,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag,
  fetchSubmitToggleTagToTop,
  fetchSubmitUpdateTagSequence
} from '@/data/repos/category'

export default {
  getList: fetchGetPoiTagInfo,
  changeLevel: fetchSubmitChangeTagLevel,
  modify: fetchSubmitModTag,
  add: fetchSubmitAddTag,
  delete: fetchSubmitDeleteTag,
  smartSort: fetchSubmitToggleTagToTop,
  dragSort: fetchSubmitUpdateTagSequence
}
