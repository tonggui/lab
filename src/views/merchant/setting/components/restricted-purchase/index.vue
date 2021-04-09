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
    <div class="restricted-purchase-list" @click="handleClick">
      <template v-for="item in limitRuleVoList">
        <div :key="item.limitRule.ruleId">
          <span>{{item.limitRule.ruleId}}</span>
        </div>
      </template>
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
      handleClick () {
        this.$emit('click', this.listInfo)
      },
      handleStatus (status) {
        this.submitting = true
        this.$emit('change-status', status, () => {
          this.submitting = false
        })
      },
      async getLimitRulesStatus () {
        const res = await getLimitRules()
        console.log(res)
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
    &-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      padding-bottom: 10px;
      cursor: pointer;
      font-size: @font-size-large;
    }
  }
</style>
