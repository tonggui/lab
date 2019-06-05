<template>
  <div>
    <Card style="margin: 20px;">
      <time-picker></time-picker>
    </Card>
    <Card style="margin: 20px;">
      <range-time-picker></range-time-picker>
    </Card>
  </div>
</template>

<script>
import TimePicker from './time-picker'
import RangeTimePicker from './index'
export default {
  name: 'range-time-picker-demo',
  components: {
    TimePicker,
    RangeTimePicker
  }
}
</script>

<style scoped></style>
