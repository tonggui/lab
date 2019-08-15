<template>
  <Input
    :value="originName"
    v-bind="$attrs"
    @on-change="handleChange"
  />
</template>

<script>
  import Input from './Input'

  export default {
    name: 'origin',
    components: {
      Input
    },
    props: {
      value: Object
    },
    computed: {
      originName () {
        return (this.value && this.value.name) || ''
      }
    },
    methods: {
      handleChange ($events) {
        const value = {
          id: 0,
          name: $events.target.value
        }
        this.$emit('change', value)
      }
    }
  }
</script>
