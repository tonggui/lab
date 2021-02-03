<template>
  <AgreementModal
    title="美团闪购疫情药品配置使用协议"
    :visible="visibleSelf"
    :loading="loading"
    :mode="mode"
    :url="url"
    :isMultiple="isMultiple"
    @confirm="handleConfirm"
  />
</template>

<script>
  import {
    getAgreementInfo,
    submitAgreement
  } from '@/data/api/medicineRegister'
  import AgreementModal from '@components/agreement-modal'

  export default {
    name: 'MedicineRegisterAgreement',
    props: {
      value: Boolean,
      mode: {
        required: true,
        default: () => 'view'
      }
    },
    data () {
      return {
        loading: false,
        url: null,
        isMultiple: false,
        visibleSelf: this.value
      }
    },
    watch: {
      value (value) {
        this.visibleSelf = value
      }
    },
    mounted () {
      getAgreementInfo().then(data => {
        const { signed, required, isMultiple, loading } = data
        if (this.mode === 'sign') {
          this.visibleSelf = !(signed || !required)
        }
        this.loading = loading
        this.isMultiple = isMultiple
        this.url = data.url
      })
    },
    methods: {
      handleConfirm () {
        this.visibleSelf = false
        // 签署失败暂不阻塞主流程
        if (this.mode === 'sign') {
          submitAgreement()
        }
        this.$emit('close')
        this.$emit('input', this.visibleSelf)
      }
    },
    components: {
      AgreementModal
    }
  }
</script>

<style scoped></style>
