<template>
  <div class="task-lists">
    <p class="font20">{{ timeType }}</p>
    <TaskListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
  import TaskListItem from './task-list-item'
  export default {
    name: 'TaskList',
    components: {
      TaskListItem
    },
    props: {
      timeType: {
        type: String,
        default: '今天'
      },
      list: {
        type: Array,
        required: true
      }
    }
  }

</script>

<style lang='less' scoped>
.task-lists {
  padding: 15px 0;
  .font20 {
    font-size: 20px;
  }
}
</style>
