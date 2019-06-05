<template>
  <AgreementModal
    :visible="visibleSelf"
    :loading="loading"
    :mode="mode"
    :url="url"
    :isMultiple="isMultiple"
    @confirm="handleConfirm"
    @close="onClose"
  />
</template>

<script>
import {
  fetchAgreementInfo,
  postAgreementConfirm
} from '@/data/repos/listRepository'
import AgreementModal from './agreement-modal'
export default {
  name: 'agreement-modal',
  props: {
    mode: {
      required: true,
      validator: val => ['view', 'sign'].indexOf(val) > -1
    },
    visible: {
      type: Boolean,
      default: undefined
    }
  },
  data () {
    return {
      loading: false,
      url: null,
      isMultiple: false,
      visibleSelf: this.visible || false
    }
  },
  watch: {
    visible (val) {
      this.visibleSelf = val
    }
  },
  mounted () {
    fetchAgreementInfo().then(data => {
      // 外界不控制visible
      if (this.visible === undefined) {
        this.visibleSelf = true
      }
      if (this.mode === 'sign' && (data.signed || !data.required)) {
        this.visibleSelf = false
      }
      this.loading = data.loading
      this.isMultiple = data.isMultiple
      this.url = data.url
    })
  },
  methods: {
    handleConfirm () {
      this.$emit('close')
      // 签署失败暂不阻塞主流程
      if (this.mode === 'sign') {
        postAgreementConfirm()
      }
    },

    onClose () {
      this.visibleSelf = false
      this.$emit('close')
    }
  },
  components: {
    AgreementModal
  }
}
</script>

<style scoped></style>
