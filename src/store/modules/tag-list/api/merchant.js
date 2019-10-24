import {
  fetchGetSortedTagList,
  fetchSubmitChangeTagLevel,
  fetchSubmitAddTag,
  fetchSubmitModTag,
  fetchSubmitDeleteTag
} from '@/data/repos/merchantCategory'

export default {
  getList: fetchGetSortedTagList,
  changeLevel: fetchSubmitChangeTagLevel,
  modify: fetchSubmitModTag,
  add: fetchSubmitAddTag,
  delete: fetchSubmitDeleteTag
}
