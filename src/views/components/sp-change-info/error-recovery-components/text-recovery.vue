<template>
  <div class="text-recovery">
    <div class="content" v-show="!editing">{{ value }}</div>
    <div v-show="editing">
      <Input :value="value" @on-change="handleChange" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'text-recovery',
    props: {
      value: {
        required: true
      },
      editing: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .text-recovery {
    .content {
      line-height: 1.5;
    }
  }
</style>
