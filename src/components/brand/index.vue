<template>
  <Selector
    remote
    :loading="loading"
    :remote-method="search"
    remote-paginate
    :page-size="pageSize"
    filterable
    clearable
  >
    <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
  </Selector>
</template>

<script>
export default {
  name: 'brand',
  data () {
    return {
      loading: false,
      pageSize: 20
    }
  },
  methods: {
    search () {}
  }
}
</script>

<style scoped>

</style>
