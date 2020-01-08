<template>
  <EditInput
    @on-confirm="handleConfirm"
    :value="value"
    :disabled="isDisabled"
    :input-prefix="inputPrefix"
    :input-props="inputProps"
    editing-style="z-index: 10"
    v-bind="$attrs"
  >
  </EditInput>
</template>

<script>
  import EditInput from '@/components/edit-input/edit-input'

  export default {
    name: 'edit-input',
    components: {
      EditInput
    },
    props: {
      value: [Number, String],
      disabled: Boolean,
      inputPrefix: String
    },
    data () {
      return {}
    },
    computed: {
      isDisabled () {
        return this.disabled || this.value === null || this.value === undefined
      },
      inputProps () {
        return { number: true }
      }
    },
    watch: {},
    methods: {
      handleConfirm (val) {
        this.$emit('on-confirm', val)
      }
    },
    created () {}
  }
</script>

<style lang='less'>
  .edit {
    &-icon {
      color: @link-color;
      &:hover {
        color: @link-hover-color;
      }
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
  }
</style>
