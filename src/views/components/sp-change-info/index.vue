<template>
  <Modal
    :title="title"
    :value="value"
    @input="handleVisibleChange"
    width="600"
  >
    <div v-show="step === 1">
      <SpChangeInfo
        :price="primarySku.price.value"
        :weight-unit="primarySku.weight.unit"
        :changes="changes"
      />
    </div>
    <div v-show="step === 2">
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
        <Button @click="next">与店内信息不符，去纠错</Button>
        <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
        <Button type="primary" @click="handleConfirm(2)">同意但不替换图片</Button>
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
  import SpChangeInfo from './sp-change-list'
  import ErrorRecovery from './error-recovery'
  import { poiId } from '@/common/constants'
  import { fetchSubmitSpErrorRecovery } from '@/data/repos/standardProduct'

  const titles = ['字段更新提示', '字段纠错']

  export default {
    name: 'SpChangeInfoModal',
    components: {
      SpChangeInfo,
      ErrorRecovery
    },
    props: {
      product: Object,
      changes: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        step: 1, // 第1步为标品更新，第2步为纠错
        value: false,
        editingCount: 0,
        submitting: false
      }
    },
    computed: {
      primarySku () {
        if (this.product && this.product.skuList && this.product.skuList.length) {
          return this.product.skuList[0]
        }
        return {
          price: { value: 0 },
          weight: { value: 0 }
        }
      },
      title () {
        return titles[this.step - 1]
      },
      errorRecoveryInfo () {
        return cloneDeep(this.changes)
      },
      disableText () {
        if (this.editingCount > 0) {
          return '请先确定正在纠错的内容'
        }
        for (let i = 0; i < this.errorRecoveryInfo.length; i++) {
          const oldItem = this.changes[i]
          const item = this.errorRecoveryInfo[i]
          if (!isEqual(item.newValue, oldItem.newValue)) {
            return ''
          }
        }
        return '请至少纠错一项'
      }
    },
    watch: {
      changes (v) {
        if (v && v.length) {
          this.value = true
        }
      }
    },
    methods: {
      handleEditChange (editing) {
        if (editing) {
          this.editingCount++
        } else {
          this.editingCount--
        }
      },
      handleConfirm (type = 3) {
        this.$emit('confirm', type)
        this.value = false
      },
      handleVisibleChange (v = false) {
        if (!v) {
          this.handleConfirm(3)
        }
      },
      next () {
        this.step++
      },
      prev () {
        this.step--
      },
      correct () {
        this.submitting = true
        fetchSubmitSpErrorRecovery(this.product.id, this.errorRecoveryInfo, poiId).then(() => {
          this.$Message.success('纠错信息已提交')
          this.handleConfirm(4)
          this.submitting = false
        }).catch(err => {
          this.submitting = false
          this.$Message.error(err.message)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-footer {
    .boo-btn {
      margin-left: 10px;
    }
  }
</style>
