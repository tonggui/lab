<template>
  <SearchSuggest
    :loading="loading"
    :clearable="clearable"
    :cache="cache"
    :value="selfValue"
    :placeholder="placeholder"
    :suggestionList="suggestionList"
    :maxlength="maxlength"
    :width="width"
    :disabled="disabled"
    @change="handleChange"
    @search="handleSearch"
  />
</template>
<script>
  import { debounce, trim } from 'lodash'
  import { PRODUCT_NAME_MAX_LENGTH } from '@/data/constants/product'
  import SearchSuggest from './search-suggest'

  export default {
    name: 'product-search-suggest',
    props: {
      disabled: Boolean,
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
      placeholder: String,
      width: Number
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
          const searchValue = trim(this.selfValue)
          if (searchValue) {
            list = await this.fetchData(searchValue)
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
        this.$emit('input', v)
        this.getData()
      },
      handleSearch (item) {
        this.selfValue = trim(item.name)
        this.$emit('search', {
          ...item,
          name: trim(item.name)
        })
      }
    },
    mounted () {
      if (this.selfValue) {
        this.getData()
      }
    }
  }
</script>
