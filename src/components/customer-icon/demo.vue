<template>
  <div>
    <Card>
      <customer-icon type="close" />
    </Card>
  </div>
</template>

<script>
import CustomerIcon from './index'
export default {
  name: 'icon-svg-demo',
  components: {
    CustomerIcon
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
