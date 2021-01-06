import Vue from 'vue'
import CategoryPath from '@/components/category-path'
import CategoryPathSpList from '@/components/category-path/sp-list'
import { fetchGetCategoryByName } from '@/data/repos/category'
import { fetchGetSpList } from '@/data/repos/standardProduct'
import { fetchGetCategoryListByParentId } from '@/data/repos/medicineMerchantCategory'
import { forwardComponent } from '@/common/vnode'

export const buildCategoryPath = props => {
  const {
    fetchCategoryListByParentId = fetchGetCategoryListByParentId,
    searchCategoryListByName = fetchGetCategoryByName,
    fetchSpList = fetchGetSpList
  } = props || {}
  return Vue.extend({
    render (h) {
      return forwardComponent(this, CategoryPath, {
        props: {
          fetchCategoryListByParentId,
          searchCategoryListByName
        },
        scopedSlots: {
          splist: ({ categoryId, categoryName, handleSelect }) => h(CategoryPathSpList, {
            props: {
              categoryId,
              categoryName,
              fetchSpList
            },
            on: {
              'on-select': handleSelect
            }
          })
        }
      })
    }
  })
}

export default buildCategoryPath()
