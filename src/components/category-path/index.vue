<template>
  <WithSearch
    arrow
    ref="withSearch"
    :value="val"
    :name="name"
    :source="fetchCategory"
    :disabled="disabled"
    :placeholder="placeholder"
    :debounce="debounce"
    :width="width"
    :triggerMode="triggerMode"
    :onSearch="handleOnSearch"
    @search="handleSearch"
    @change="handleChange"
    @close="handleClose"
    @trigger="handleTrigger"
    @trigger-locked="handleTriggerLocked"
  >
    <template v-if="showProductList" v-slot:append>
      <SpList :categoryId="categoryId" :categoryName="categoryName" @on-select="handleSelect" />
    </template>
  </WithSearch>
</template>

<script>
  import WithSearch from '@/components/cascader/with-search'
  import SpList from './sp-list'
  import qualificationModal from '@/components/qualification-modal'
  import { fetchGetCategoryListByParentId, fetchGetCategoryByName } from '@/data/repos/category'

  const NOTIFICATION_CATEGORY_ID = 200002308 // 店铺公告及相关

  export default {
    name: 'category-path',
    components: { WithSearch, SpList },
    props: {
      value: {
        type: Object,
        required: true
      },
      separator: {
        type: String,
        default: ' > '
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      debounce: {
        type: Number,
        default: 400
      },
      width: {
        type: Number,
        default: 440
      },
      triggerMode: {
        type: String,
        default: 'hover'
      },
      showProductList: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        categoryId: null,
        categoryName: ''
      }
    },
    computed: {
      // 传入withSearch组件的value，需要转换
      val () {
        return this.value.idPath || []
      },
      // 根据categoryNamePath和separator生成的展示名
      name () {
        return (this.value.namePath || []).join(this.separator)
      }
    },
    methods: {
      // 获取后台类目
      fetchCategory (parentId) {
        return fetchGetCategoryListByParentId(parentId).then(data => ({
          id: parentId,
          children: data,
          total: data.length
        }))
      },
      handleSearch () {
        // 重新查找时先清空之前的splist
        this.categoryId = null
        this.categoryName = ''
      },
      handleOnSearch ({ keyword }) {
        if (!keyword) return Promise.resolve([])
        return fetchGetCategoryByName(keyword).then((data) => {
          const result = data.map((item) => {
            const {
              idPath,
              namePath
            } = item
            const path = idPath.map((v, i) => ({
              id: v,
              name: namePath[i] || ''
            }))
            return {
              ...item,
              name: namePath.join(this.separator),
              path,
              isLeaf: true
            }
          })
          return { data: result, total: result.length }
        })
      },
      handleChange (idPath = [], namePath = []) {
        // 特殊类目需要给出提示
        if (idPath.includes(NOTIFICATION_CATEGORY_ID)) {
          this.$Modal.info({
            title: '提示',
            content: '此类目下的商品仅用于店内展示，不支持搜索以及推荐等多种引流',
            okText: '我知道了'
          })
        }
        this.$emit('on-change', {
          id: idPath[idPath.length - 1] || null,
          idPath,
          name: namePath[namePath.length - 1] || '',
          namePath,
          isLeaf: true,
          level: idPath.length
        })
      },
      handleClose () {
        this.categoryId = null
      },
      handleTrigger (item) {
        const {
          id,
          name,
          locked,
          isLeaf = true
        } = item
        this.categoryId = (isLeaf && !locked) ? id : null
        this.categoryName = name || ''
      },
      // 选中锁定项
      handleTriggerLocked (item) {
        qualificationModal(item.qualificationTip)
        this.$refs.withSearch.hide()
      },
      // 选择标品回调
      handleSelect (product) {
        this.$emit('on-select-product', product)
        this.$refs.withSearch.hide()
        // 必须手动触发一下popup的click使其内部状态变为关闭，否则下次需要点两次才能打开
        this.$refs.withSearch.$refs.triggerRef.handleClick()
      }
    }
  }
</script>
