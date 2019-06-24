<template>
  <div>
    <Card style="margin: 20px;">
      <TimeZone></TimeZone>
    </Card>
    <Card style="margin: 20px;">
      <PeriodWeekTime></PeriodWeekTime>
    </Card>
  </div>
</template>

<script>
import TimeZone from './time-zone'
import PeriodWeekTime from './index'
export default {
  name: 'period-week-time-demo',
  components: {
    TimeZone,
    PeriodWeekTime
  }
}
</script>

<style scoped></style>
