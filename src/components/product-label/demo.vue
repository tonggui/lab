<template>
  <div>
    <Card style="margin: 20px;">
      <product-label></product-label>
      <Test />
    </Card>
  </div>
</template>

<script>
import ProductLabel from './product-label'
import Test from './test'
export default {
  name: 'product-label-demo',
  components: {
    ProductLabel,
    Test
  },
  test: 1,
  mounted () {
    console.log(this)
  },
  methods: {}
}
</script>

<style scoped></style>
