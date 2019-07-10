<template>
  <WithSearch
    :source="source"
    :value="brand.id ? [brand.id] : []"
    :name="brand.name || ''"
    :disabled="disabled"
    :debounce="debounce"
    :on-search="search"
    :placeholder="placeholder"
  />
</template>

<script>
import WithSearch from '@/components/cascader/with-search'
import { Brand } from '@/data/interface/common'
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
    value: Brand,
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
      options: [],
      source: []
    }
  },
  computed: {
    brand () {
      return this.value || {}
    }
  },
  methods: {
    async search (keyword) {
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
    triggerChanged (brand) {
      this.$emit('input', brand)
      this.$emit('on-change', brand)
    }
  }
}
</script>
