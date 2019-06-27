<template>
  <div class="task-lists">
    <p class="font20">{{ timeType }}</p>
    <TaskListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
      @handle-action="handleAction"
    />
  </div>
</template>

<script>
import TaskListItem from './TaskListItem'

export default {
  name: 'task-lists',
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
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    handleAction (action, item) {
      this.$emit('handle-action', action, item)
    }
  },
  created () {}
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
