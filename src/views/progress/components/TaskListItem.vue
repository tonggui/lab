<template>
  <div class="task-list-item">
    <div class="name-and-time">
      <p class="name">{{ item.name }}</p>
      <p class="font12 time">{{ item.timeText }}</p>
    </div>
    <div class="task-status">
      <p
        :class="[
          { 'status-success': item.status === STATUS.SUCCESS },
          { 'status-doing': item.status === STATUS.DOING },
          { 'status-fail': item.status === STATUS.FAIL }
        ]"
      >
        {{ STATUS_STR[item.status] }}
      </p>
    </div>
    <div class="task-opr">
      <template v-for="(ac, idx) in actions">
        <Button :key="idx" v-if="ac.actionType !== 'TEXT'" @click="handleAction(ac)">{{ ac.title }}</Button>
        <span :key="idx" v-else class="text">{{ ac.title }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import {
  STATUS,
  STATUS_STR
} from '../constants'

export default {
  name: 'task-list-item',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      STATUS,
      STATUS_STR
    }
  },
  computed: {
    actions () {
      return this.item.actions.filter(ac => ac.title)
    }
  },
  methods: {
    handleAction (action, item = this.item) {
      if (action.actionType !== 'TEXT') {
        this.$emit('handle-action', action, item)
      }
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>
.task-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 940px;
  height: 80px;
  font-size: 14px;
  border-top: 1px solid @border-color-base;
  .name-and-time {
    flex-basis: 35%;
  }
  .task-opr {
    flex-basis: 50%;
  }
  .task-status {
    flex-basis: 15%;
    .status-success {
      color: @success-color;
    }
    .status-doing {
      color: @link-color;
    }
    .status-fail {
      color: @error-color;
    }
  }
  .name-and-time {
    min-width: 350px;
    .name {
      color: @primary-color;
      line-height: 19px;
      margin-bottom: 5px;
    }
    .time {
      color: @text-description-color;
      line-height: 16px;
    }
  }
  .task-opr {
    text-align: right;
    .boo-btn:nth-last-child(1), .boo-btn:nth-last-child(2), .boo-btn:nth-last-child(3) {
      margin-left: 10px;
    }
    .text {
      font-weight: normal;
      font-size: 12px;
      text-align: center;
      padding: 5px 2px 6px;
      line-height: 1.5;
      vertical-align: middle;
      margin-left: 10px;
      white-space: nowrap;
      user-select: none;
      cursor: text;
    }
  }
  .font12 {
    font-size: 12px;
  }
}
</style>
