import SuggestTagList from './suggest-tag-list'
import { SPU_FIELD } from '../../field'

export default (service) => ({
  name: '_SuggestTagList_',
  config: [{
    key: SPU_FIELD.TAG_LIST,
    type: SuggestTagList,
    options: {
      getSuggest: service.getSuggestList,
      getSource: service.getTagList
    },
    rules: [{
      result: {
        'options.categoryId' () {
          const category = this.getData('category') || {}
          return category.id
        }
      }
    }]
  }]
})
