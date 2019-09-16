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
        <Button type="primary" @click="correct">确定</Button>
      </template>
    </div>
  </Modal>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import SpChangeInfo from './sp-change-list'
  import ErrorRecovery from './error-recovery'

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
        value: false
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
        // TODO 判断当前值是否为空、是否修改过
        // TODO 调用纠错接口上传数据
        this.handleConfirm(4)
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
