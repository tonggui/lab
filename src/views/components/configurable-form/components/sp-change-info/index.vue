<template>
  <Modal
    :title="title"
    :value="value"
    @on-cancel="handleCancel"
    width="700"
  >
    <div v-if="step === 1">
      <SpChangeInfo
        v-if="basicInfoList.length"
        :price="primarySku.price.value"
        :weight-unit="primarySku.weight.unit"
        :warningText="warningText"
        :changes="basicInfoList"
      />
      <SpChangeInfo
        v-if="categoryAttrChanges.length"
        title="其他信息"
        :changes="categoryAttrChanges"
      />
    </div>
    <div v-show="hasStep && step === 2">
      <ErrorRecovery
        :data="errorRecoveryInfo"
        :weight-unit="primarySku.weight.unit"
        @editChange="handleEditChange"
      />
    </div>
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <template v-if="step === 1">
        <template v-if="hasStep">
          <Button @click="next">与店内信息不符，去纠错</Button>
          <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
          <Button v-if="hasPic" type="primary" @click="handleConfirm(2)">同意但不替换图片</Button>
        </template>
        <template v-else>
          <Button @click="handleCancel">暂不替换</Button>
          <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
        </template>
      </template>
      <template v-if="step === 2">
        <Button @click="prev">上一步</Button>
        <Tooltip :content="disableText" placement="top" :disabled="!disableText">
          <Button type="primary" @click="correct" :disabled="!!disableText" :loading="submitting">确定</Button>
        </Tooltip>
      </template>
    </div>
  </Modal>
</template>

<script>
  import { cloneDeep, isEqual } from 'lodash'
  import { VALUE_TYPE } from '@/data/enums/category'
  import SpChangeInfo from './components/sp-change-list'
  import ErrorRecovery from './components/error-recovery/error-recovery'
  import { fetchSubmitSpErrorRecovery } from '@/data/repos/standardProduct'

  const titles = ['字段更新提示', '字段纠错']

  export default {
    name: 'sp-change-info',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      product: Object,
      warningText: {
        type: String,
        default: '',
        require: true
      },
      basicInfoList: {
        type: Array,
        default: () => []
      },
      categoryAttrInfoList: {
        type: Array,
        default: () => []
      },
      categoryAttrList: {
        type: Array,
        default: () => ([])
      },
      hasStep: {
        type: Boolean,
        default: false
      }
    },
    components: {
      SpChangeInfo,
      ErrorRecovery
    },
    data () {
      return {
        step: 1, // 第几步
        editingCount: 0,
        submitting: false
      }
    },
    computed: {
      title () {
        return titles[this.step - 1]
      },
      categoryAttrChanges () {
        const changes = []
        const attrs = this.categoryAttrList;
        (this.categoryAttrInfoList || []).forEach(item => {
          const attr = attrs.find(v => `${v.id}` === item.field)
          if (attr) {
            let { oldValue, newValue } = item
            if (attr.valueType === VALUE_TYPE.MULTI_SELECT) {
              oldValue = oldValue ? oldValue.split(',').map(v => v ? v + '' : v) : []
              newValue = newValue ? newValue.split(',').map(v => v ? v + '' : v) : []
            } else {
              oldValue = oldValue + ''
              newValue = newValue + ''
            }
            changes.push({
              ...attr,
              oldValue,
              newValue
            })
          }
        })
        return changes
      },
      errorRecoveryInfo () {
        return cloneDeep(this.basicInfoList || [])
      },
      disableText () {
        if (this.editingCount > 0) {
          return '请先确定正在纠错的内容'
        }
        for (let i = 0; i < this.errorRecoveryInfo.length; i++) {
          const oldItem = this.basicInfoList[i]
          const item = this.errorRecoveryInfo[i]
          if (!isEqual(item.newValue, oldItem.newValue)) {
            return ''
          }
        }
        return '请至少纠错一项'
      },
      hasPic () {
        return this.basicInfoList.some(c => c.field === 'pictureList')
      },
      primarySku () {
        if (this.product && this.product.skuList && this.product.skuList.length) {
          return this.product.skuList[0]
        }
        if (this.product && this.product.price) {
          return {
            price: { value: this.product.price },
            weight: { value: '' }
          }
        }
        return {
          price: { value: 0 },
          weight: { value: 0 }
        }
      }
    },
    methods: {
      handleConfirm (type) {
        if (type === 2) {}
        this.$emit('confirm', type, this.basicInfoList, this.categoryAttrInfoList)
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleEditChange (editing) {
        if (editing) {
          this.editingCount++
        } else {
          this.editingCount--
        }
      },
      correct () {
        fetchSubmitSpErrorRecovery(this.product.id, this.errorRecoveryInfo).then(() => {
          this.$Message.success('纠错信息已提交')
          this.$emit('correct')
          this.submitting = false
        }).catch(err => {
          this.submitting = false
          this.$Message.error(err.message)
        })
      },
      next () {
        this.step++
      },
      prev () {
        this.step--
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
