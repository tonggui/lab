<template>
  <SearchSuggest
    :loading="loading"
    :clearable="clearable"
    :cache="cache"
    :value="value"
    :placeholder="placeholder"
    :suggestionList="suggestionList"
    :maxlength="maxlength"
    @change="handleChange"
    @search="handleSearch"
  />
</template>
<script>
  import { debounce } from 'lodash'
  import { PRODUCT_NAME_MAX_LENGTH } from '@/data/constants/product'
  import SearchSuggest from './search-suggest'

  export default {
    name: 'product-search-suggest',
    props: {
      cache: {
        type: Boolean,
        default: true
      },
      defaultValue: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      fetchData: {
        type: Function,
        required: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      placeholder: String
    },
    components: {
      SearchSuggest
    },
    data () {
      return {
        loading: false,
        selfValue: this.value || this.defaultValue,
        suggestionList: [],
        maxlength: PRODUCT_NAME_MAX_LENGTH
      }
    },
    watch: {
      value (value) {
        if (value !== this.selfValue) {
          this.selfValue = value
        }
      }
    },
    methods: {
      getData: debounce(async function () {
        try {
          this.loading = true
          let list = []
          if (this.selfValue) {
            list = await this.fetchData(this.selfValue)
          }
          this.suggestionList = list
        } catch (err) {
          this.$Message.error(err.message || err)
          this.suggestionList = []
        } finally {
          this.loading = false
        }
      }, 300),
      handleChange (v) {
        this.selfValue = v
        this.$emit('change', v)
        this.getData()
      },
      handleSearch (item) {
        this.selfValue = item.name
        this.$emit('search', item)
      }
    },
    mounted () {
      if (this.selfValue) {
        this.getData()
      }
    }
  }
</script>
