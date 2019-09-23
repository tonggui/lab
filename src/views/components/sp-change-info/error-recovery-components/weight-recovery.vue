<template>
  <div class="weigth-recovery">
    <div class="content" v-show="!editing">{{ value }}{{ weightUnit }}</div>
    <div v-show="editing" class="arrange">
      <Input :value="value" @on-change="handleChange">
        <span slot="append">{{ weightUnit }}</span>
      </Input>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'weigth-recovery',
    props: {
      value: {
        required: true
      },
      editing: {
        type: Boolean,
        default: false
      },
      weightUnit: {
        type: String,
        required: true
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
  .weigth-recovery {
    .arrange {
      @offset: 12px;
      margin-top: -@offset;
      transform: translateY(@offset);
    }
  }
</style>
