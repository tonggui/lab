<template>
  <div class="suggest-item">
    <Checkbox v-if="multiple" :value="checked" @on-change="handleChange">{{ data.name }}</Checkbox>
  </div>
</template>

<script>
  import Checkbox from '@/components/checkbox'

  export default {
    name: 'suggest-item',
    components: { Checkbox },
    props: {
      multiple: Boolean,
      data: {
        type: Object,
        required: true
      },
      exist: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      checked () {
        return this.multiple ? this.exist.some(v => v.includes(this.data.id)) : this.exist.includes(this.data.id)
      }
    },
    methods: {
      handleChange () {
        this.$emit('trigger', this.data, this.checked)
      }
    }
  }
</script>

<style lang="less" scoped>
  .suggest-item {
    display: inline-block;
    font-size: @font-size-base;
    margin-right: 10px;
    line-height: 24px;
  }
</style>
