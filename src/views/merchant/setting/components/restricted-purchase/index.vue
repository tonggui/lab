<template>
  <div class="restricted-purchase">
    <div class="restricted-purchase-content">
      <div>
        <p class="restricted-purchase-title">{{ title }}</p>
        <small class="restricted-purchase-description">
          <slot name="description">{{ description }}</slot>
        </small>
      </div>
      <iSwitch v-if="showSwitch" :value="status" @on-change="handleStatus" :loading="submitting" />
    </div>
    <div class="restricted-purchase-list">
      <template v-for="item in limitRuleVoList">
        <div class="restricted-purchase-list-item" :key="item.limitRule.ruleId">
          <div class="restricted-purchase-list-item-time" >
            <Tooltip :content="item.limitRule.beginTime" placement="top">
              <span>{{item.limitRule.beginTime}}</span>
            </Tooltip>
            -
            <Tooltip :content="item.limitRule.endTime" placement="top">
              <span>{{item.limitRule.endTime}}</span>
            </Tooltip>
          </div>
          <span class="restricted-purchase-list-division"> | </span>
          <span class="restricted-purchase-list-item-frequency">{{item.limitRule.count}}份 / {{item.limitRule.frequency === 0 ? `整个限购周期` : `${item.limitRule.frequency}天`}}</span>
          <span class="restricted-purchase-list-division"> | </span>
          <span class="restricted-purchase-list-item-count">{{item.count}}个商品</span>
          <span class="restricted-purchase-list-item-link">点击修改</span>
        </div>
      </template>
      <div class="restricted-purchase-add">
        + 新增限购规则
      </div>
    </div>
  </div>
</template>
<script>
  import { getLimitRules } from '@/data/api/setting'
  export default {
    name: 'restricted-purchase',
    props: {
      showSwitch: Boolean,
      title: {
        type: String,
        required: true
      },
      description: String,
      status: Boolean,
      listInfo: {
        type: Object,
        validator: (listInfo) => {
          return ['name', 'count'].every(k => k in listInfo)
        }
      }
    },
    data () {
      return {
        submitting: false,
        limitRuleVoList: []
      }
    },
    created () {
      this.getLimitRulesStatus()
    },
    methods: {
      async getLimitRulesStatus () {
        const res = await getLimitRules()
        this.limitRuleVoList = res.limitRuleVoList
      }
    }
  }
</script>
<style lang="less">
  .restricted-purchase {
    text-align: left;
    padding: 20px;
    background: @component-bg;
    box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.30);
    margin-bottom: 20px;
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      border-bottom: 1px solid @border-color-base;
      padding-bottom: 16px;
    }
    &-title {
      font-size: 16px;
      line-height: 38px;
      color: #222;
      font-weight: bold;
    }
    &-description {
      font-size: @font-size-small;
      color: @text-tip-color;
      line-height: 26px;
    }
    &-add {
      margin-top: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    &-list {
      &-item {
        padding: 10px 0;
        border-bottom: 1px solid #E9EAF2;
        &-time {
          display: inline-block;
          width: 160px;
        }
        &-frequency {
          display: inline-block;
          width: 200px;
          padding: 0 0 0 40px;
        }
        &-count {
          display: inline-block;
          width: 200px;
          padding: 0 0 0 40px;
        }
        &-link {
          float: right;
          color: #999;
          margin-right: 20px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
