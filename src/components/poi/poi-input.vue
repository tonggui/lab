<template>
  <Input
    class="poi-input"
    type="textarea"
    :value="text"
    v-bind="$attrs"
    :placeholder="placeholder"
    @on-change="handleChange($event.target.value)"
  />
</template>

<script>
  import { isEqualWith } from 'lodash'

  export default {
    name: 'PoiInput',
    props: {
      value: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: '请输入门店ID，多门店使用换行分隔'
      },
      validator: {
        type: Function,
        default: s => !isNaN(Number(s))
      }
    },
    data () {
      return {
        text: ''
      }
    },
    watch: {
      value (val = []) {
        this.text = val.join('\n')
      }
    },
    methods: {
      handleChange (value) {
        const pre = this.text
        let poiIds

        this.text = value
        // 粘贴场景，自动过滤无效内容
        if (value.length - pre.length > 1) {
          poiIds = String(value || '')
            .split('\n')
            .map(s => s.trim())
            .filter(s => s !== '')
            .filter(s => this.validator(s))
        } else { // 删除模式、普通增加，使用正常严格过滤，不满足条件内容不允许输入
          poiIds = String(value || '')
            .split('\n')
            .map(s => s.trim())
            .filter(s => s !== '')
          // 如果新增不合法内容，撤销内容变更
          if (poiIds.findIndex(s => !this.validator(s)) > -1) {
            this.$nextTick(() => {
              this.text = pre
            })
            return
          }
        }

        if (!isEqualWith(this.value, poiIds, (s, t) => String(s) === String(t))) {
          this.$emit('input', poiIds)
          this.$emit('on-change', poiIds)
        }
      }
    }
  }
</script>

<style lang="less">
  .poi-input {
    width: 100%;
  }
</style>
