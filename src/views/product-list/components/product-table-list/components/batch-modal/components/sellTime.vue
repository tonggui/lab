<template>
  <SellTime class="batch-selltime" ref="sellTime" :status="saleTime.type" :value="saleTime.timeZone" @change="handleChange" />
</template>
<script>
  import { isString } from 'lodash'
  import SellTime from '@components/sell-time'
  import { SELLING_TIME_TYPE } from '@/data/enums/product'

  export default {
    name: 'product-batch-modify-saletime',
    data () {
      return {
        saleTime: {
          type: false,
          timeZone: {}
        }
      }
    },
    components: {
      SellTime
    },
    methods: {
      handleChange (type, timeZone) {
        this.saleTime.type = type
        this.saleTime.timeZone = timeZone
      },
      submit () {
        let error
        const result = this.$refs.sellTime.validate()
        if (result && isString(result)) {
          error = result
        }
        this.$emit('submit', error, {
          ...this.saleTime,
          type: this.saleTime ? SELLING_TIME_TYPE.Custom : SELLING_TIME_TYPE.Infinite
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-selltime {
    /deep/ .boo-radio-group {
      margin-bottom: 10px;
    }
  }
</style>
