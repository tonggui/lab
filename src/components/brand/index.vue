<template>
  <WithSearch
    :value="brand.id ? [brand.id] : []"
    :name="brand.name || ''"
    :width="width"
    :disabled="disabled"
    :debounce="debounce"
    :on-search="search"
    :placeholder="placeholder"
    @trigger="triggerChanged"
    @change="handleChanged"
  />
</template>

<script>
  import WithSearch from '@/components/cascader/with-search'
  import { fetchGetBrandByName } from '@/data/repos/common'
  export default {
    name: 'brand',
    components: {
      WithSearch
    },
    props: {
      placeholder: {
        type: String,
        default: () => '请输入商品品牌'
      },
      value: Object,
      disabled: Boolean,
      debounce: {
        type: Number,
        default: () => 400
      },
      width: {
        type: Number,
        default: () => 440
      },
      keepSearchText: Boolean
    },
    data () {
      return {
        loading: false,
        pageSize: 20,
        options: []
      }
    },
    computed: {
      brand () {
        return this.value || {}
      }
    },
    methods: {
      async search ({ keyword }) {
        if (!keyword) return []
        let brandList = []
        let error = null
        try {
          brandList = await fetchGetBrandByName(keyword)
        } catch (e) {
          error = e
        }
        if (!brandList.length && this.keepSearchText) {
          this.triggerChanged({
            id: -1,
            spBrandId: -1,
            name: keyword,
            type: 0
          })
        }
        if (error) throw error
        return {
          data: brandList.map(item => ({ isLeaf: true, ...item })),
          total: brandList.length
        }
      },
      handleChanged () {
        this.triggerChanged({})
      },
      triggerChanged (brand) {
        this.$emit('input', brand)
        this.$emit('on-change', brand)
      }
    }
  }
</script>
