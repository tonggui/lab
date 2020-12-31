<template>
  <Select
    v-bind="$attrs"
    :value="value"
    :placeholder="placeholder"
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    @on-change="handleChange">
    <Option v-for="item in list" :value="item" :key="item">{{ item }}</Option>
  </Select>
</template>
<script>
  import { fetchGetSearchSugByType } from '@/data/repos/medicineMerchantProduct'
  export default {
    props: {
      value: String,
      type: { // 1-upc，2-商品货号，3-商品名称
        required: true
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        loading: false,
        list: []
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
      },
      remoteMethod (query) {
        this.loading = true
        fetchGetSearchSugByType({ keyword: query, type: this.type })
          .then(list => {
            this.list = list
          })
          .catch(() => {
            this.list = []
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
</script>
