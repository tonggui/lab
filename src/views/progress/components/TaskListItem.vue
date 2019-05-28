<template>
  <div class="task-list-item">
    <div class="name-and-time">
      <p class="name">{{ item.name }}</p>
      <p class="font12 time">{{ item.timeText }}</p>
    </div>
    <div class="task-status">
      <p
        :class="[
          { 'status-success': item.status === 1 },
          { 'status-doing': item.status === 0 },
          { 'status-error': item.status === 2 }
        ]"
      >
        {{ getStatus(item.status) }}
      </p>
    </div>
    <div class="task-opr">
      <Button type="primary">{{ item.oprDetail }}</Button>
      <Button v-if="item.resDetail" class="res-btn">{{
        item.resDetail
      }}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "task-list-item",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    getStatus(status) {
      return status === 0 ? "处理中" : status === 1 ? "已完成" : "处理失败";
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.task-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 940px;
  height: 80px;
  font-size: 14px;
  border-top: 1px solid #e9eaf2;
  .name-and-time,
  .task-opr {
    flex-basis: 35%;
  }
  .task-status {
    flex-basis: 30%;
    .status-success {
      color: #32c182;
    }
    .status-doing {
      color: #f89800;
    }
    .status-error {
      color: #f76c6c;
    }
  }
  .name-and-time {
    min-width: 350px;
    .name {
      color: #3f4156;
      line-height: 19px;
      margin-bottom: 5px;
    }
    .time {
      color: #858692;
      line-height: 16px;
    }
  }
  .task-opr {
    text-align: right;
    .res-btn {
      margin-left: 10px;
    }
  }
  .font12 {
    font-size: 12px;
  }
}
</style>
