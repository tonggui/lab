<template>
  <div class="attr">
    <Input class="name" v-model="value.name"/>
    <div class="values-container">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProductAttribute',
    props: {
      value: {
        type: Object,
        default: () => ({
          name: '',
          value: []
        })
      },
      count: Number
    },
    computed: {
      values () {
        return new Array(this.count).fill('')
      }
    }
  }
</script>

<style scoped lang="less">
  .attr {

  }
</style>
