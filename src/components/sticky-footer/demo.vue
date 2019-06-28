<template>
  <div>
    <Card style="margin: 20px;">
      <StickyFooter footer-class="aa bb" @on-click="alert"></StickyFooter>
    </Card>
  </div>
</template>

<script>
import StickyFooter from './index'
export default {
  name: 'sticky-footer-demo',
  components: {
    StickyFooter
  },
  methods: {
    alert (v) {
      console.log(v)
    }
  }
}
</script>

<style scoped></style>
