<template>
  <SearchSuggest
    :loading="loading"
    :clearable="clearable"
    :cache="cache"
    :value="value"
    :placeholder="placeholder"
    :suggestionList="suggestionList"
    @change="handleChange"
    @search="handleSearch"
  />
</template>
<script>
  import { debounce } from 'lodash'
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
        value: this.defaultValue,
        suggestionList: []
      }
    },
    methods: {
      getData: debounce(async function () {
        try {
          this.loading = true
          let list = []
          if (this.value) {
            list = await this.fetchData(this.value)
          }
          this.suggestionList = list
        } catch (err) {
          this.$Message.error(err.message || err)
          this.suggestionList = []
        } finally {
          this.loading = false
        }
      }),
      handleChange (v) {
        this.value = v
        this.getData()
      },
      handleSearch (item) {
        this.value = item.name
        this.$emit('search', item)
      }
    },
    mounted () {
      if (this.defaultValue) {
        this.getData()
      }
    }
  }
</script>
