<template>
  <SellTime
    ref="time"
    class="sale-time"
    :status="status"
    :value="timezone"
    @change="handleChange"
  />
</template>

<script>
  import { isString } from 'lodash'
  import SellTime from '@/components/sell-time'
  import { SELLING_TIME_TYPE } from '@/data/enums/product'
  export default {
    name: 'SaleTime',
    components: {
      SellTime
    },
    props: {
      value: Object
    },
    computed: {
      status () {
        if (this.value) {
          return this.value.type === SELLING_TIME_TYPE.Custom
        }
        return false
      },
      timezone () {
        if (this.value) {
          return this.value.timeZone
        }
        return {}
      }
    },
    methods: {
      handleChange (status, timeZone) {
        const result = {
          type: status ? SELLING_TIME_TYPE.Custom : SELLING_TIME_TYPE.Infinite,
          timeZone
        }
        this.$emit('input', result)
        this.$emit('on-change', result)
      },
      validate () {
        const result = this.$refs.time.validate()
        if (isString(result)) {
          throw new Error(result)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .sale-time {
    /deep/ .boo-radio-group {
      height: 36px;
      line-height: 36px;
    }
    /deep/ .boo-input-wrapper {
      width: 240px;
    }
    /deep/ .timezone-item {
      margin-top: 8px;
    }
  }
</style>
