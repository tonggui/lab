<template>
  <div class="error-recovery">
    <ErrorRecoveryItem
      v-for="item in data"
      :key="item.field"
      :data="item"
      :weightUnit="weightUnit"
      v-on="$listeners"
    />
  </div>
</template>

<script>
  import ErrorRecoveryItem from './error-recovery-item'

  export default {
    name: 'error-recovery',
    components: { ErrorRecoveryItem },
    props: {
      data: {
        type: Array,
        required: true
      },
      weightUnit: {
        type: String,
        default: '克(g)'
      }
    }
  }
</script>

<style lang="less" scoped>
  .error-recovery {
    word-break: break-all;
  }
</style>
