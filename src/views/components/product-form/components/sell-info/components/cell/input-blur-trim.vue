<template>
  <Input :value="value" v-bind="$attrs" v-on="listeners" @on-blur="handleBlur" @on-change="handleChange" />
</template>
<script>
  export default {
    name: 'input-blur-trim',
    props: {
      value: [Number, String]
    },
    computed: {
      listeners () {
        const listeners = { ...this.$listeners }
        delete listeners['on-change']
        return listeners
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('on-change', e.target.value)
      },
      handleBlur () {
        const newValue = this.value.trim()
        if (newValue !== this.value) {
          this.$emit('on-change', newValue)
          this.$emit('input', newValue)
        }
      }
    }
  }
</script>
