<template>
  <div class="task-lists">
    <p class="font20">{{ timeType }}</p>
    <TaskListItem v-for="item in list" :key="item.id" :item="item" />
  </div>
</template>

<script>
import TaskListItem from "./TaskListItem";

export default {
  name: "task-lists",
  components: {
    TaskListItem
  },
  props: {
    timeType: {
      type: String,
      default: "今天"
    },
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    constructDataForItem(item) {
      const obj = {
        id: item.id,
        name: item.name
      };
      return obj;
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.task-lists {
  padding: 15px 0;
  .font20 {
    font-size: 20px;
  }
}
</style>
