<template>
  <div>
    <span>切换</span>
    <Select :value="select" @on-change="handleChange">
      <Option v-for="(index, i) in 10" :key="index" :value="i">
        选项：{{ index }}
      </Option>
    </Select>
    <div>
      {{ JSON.stringify(moduleMap) }}
    </div>
  </div>
</template>
<script>
  import moduleManage, { TYPES } from './index'
  import { mapModule } from './vue'

  export default {
    name: 'module-control-demo',
    data () {
      return {
        select: ''
      }
    },
    computed: {
      ...mapModule(TYPES),
      moduleMap () {
        return Object.keys(TYPES).reduce((prev, key) => {
          prev[key] = this[key]
          return prev
        }, {})
      }
    },
    methods: {
      handleChange (v) {
        moduleManage.setContext({ select: this.select })
      }
    }
  }
</script>
