<template>
  <div class="audit-field-tip" v-if="displayItem">
    <div class="extra-info" v-if="displayItem.type === AuditFieldTipType.MERCHANT_CHANGE">
      <p class="error"><Tag color="error">需审核</Tag> 修改后需进行审核，待审核通过后才可售卖</p>
      <p class="desc">修改前：{{ formatter(displayItem.ref) }}</p>
    </div>
    <div class="correction-info" v-else-if="displayItem.type === AuditFieldTipType.MERCHANT_CORRECTION">
      纠错前：{{ formatter(displayItem.ref) }}
    </div>
    <div class="auditor-change-tip" v-else-if="displayItem.type === AuditFieldTipType.AUDITOR_CHANGE">
      <Icon type="error" />审核人对所填信息有调整，如有误请修改并重新提交审核
    </div>
  </div>
</template>

<script>
  import { AuditFieldTipType } from './constants'

  export default {
    name: 'AuditFieldTip',
    props: {
      formatter: {
        type: Function,
        default: v => v
      },
      contents: {
        type: Array,
        default: () => [],
        validator (list = []) {
          return list.every(item => {
            if (!Object.values(AuditFieldTipType).includes(item.type)) return false
            return ['value', 'ref'].every(primaryKey => primaryKey in item)
          })
        }
      }
    },
    data () {
      return {
        AuditFieldTipType
      }
    },
    computed: {
      displayItem () {
        const itemList = this.contents.slice(0).sort((l, r) => (l.weight || 1) - (r.weight || 1))
        return itemList.find(item =>
          (this.formatter(item.ref) || item.allowEmpty === true) &&
          this.formatter(item.ref) !== this.formatter(item.value) &&
          (item.tester ? item.tester(item.value, item.ref, this.formatter) : true)
        )
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@/styles/common.less';
  .audit-field-tip {
    .extra-info {
      .audit-need-correction-tip()
    }
    .correction-info {
      .audit-correction-info();
    }
    .auditor-change-tip {
      display: flex;
      align-items: center;
      line-height: 36px;
      margin-left: 20px;
      font-size: @font-size-small;
      color: @highlight-color;

      /deep/ .boo-icon {
        margin-right: 8px;
      }
    }
  }
</style>
