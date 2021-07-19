<template>
  <div class="task-progress-status-bar-container">
    <h2 class="title">任务进度</h2>
    <ul class="task-list-container">
      <li v-for="(task, index) in list" :key="index + task.name" class="task">
        <div class="left">{{task.name}}</div>
        <div class="right">
          <div class="right-desc">
            <div class="tag" :style="{backgroundColor: task.tag.color}">{{task.tag.tagText}}</div>
            {{task.text}}
          </div>
          <div class="right-btn">
            <template v-for="(button, idx) in task.buttons">
              <a
                :key="idx"
                :style="{color: button.color ? button.color : '', marginRight: '5px' }"
                @click.prevent="$emit('on-click-btn', task, button)"
              >{{button.btnText}}</a>
            </template>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'task-progress-status-bar',
    props: {
      list: {
        type: Array,
        required: true,
        validator (val) {
          return Array.isArray(val)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .task-progress-status-bar-container {
    padding: 20px;
    margin-bottom: 10px;
    background: #fff;
    width: 100%;
    .title {
      margin-bottom: 12px;
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #222222;
    }
    .task-list-container {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 2px;
        background: #fff;
        display: block;
        height: 100%;
        left: 116px;
      }
      width: 100%;
      //display: flex;
      border-radius: 5px;
      //padding: 30px;
      //background: #FAFAFA;
      .task {
        list-style: none;
        display: flex;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        background: #FAFAFA;
        &:first-child {
          padding-top: 30px;
        }
        &:last-child {
          padding-bottom: 30px;
        }
        .left {
          width: 116px;
          height: 16px;
          text-align: center;
          margin-right: 2px;
          font-weight: 500;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #000000;
          line-height: 16px;
        }
        .right {
          display: flex;
          padding-left: 16px;
          justify-content: space-between;
          width: calc(100% - 118px);
          padding-right: 20px;
          .right-desc {
            display: flex;
            align-items: center;
            .tag {
              margin-right: 8px;
              height: 16px;
              text-align: center;
              padding: 3px 4px;
              font-weight: 600;
              font-family: PingFangSC-Semibold;
              font-size: 10px;
              color: #FFFFFF;
              line-height: 10px;
              border-radius: 2px;
            }
          }
        }
      }

    }
  }
</style>
