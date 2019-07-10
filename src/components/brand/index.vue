<template>
  <Selector
    remote
    :loading="loading"
    :remote-method="search"
    remote-paginate
    :placeholder="placeholder"
    :page-size="pageSize"
    filterable
    clearable
  >
    <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
  </Selector>
</template>

<script>
export default {
  name: 'brand',
  props: {
    placeholder: {
      type: String,
      default: () => '请输入商品品牌'
    }
  },
  data () {
    return {
      loading: false,
      pageSize: 20,
      options: []
    }
  },
  methods: {
    search () {}
  }
}
</script>

<style scoped>

</style>
