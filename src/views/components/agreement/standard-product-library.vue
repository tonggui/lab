<template>
  <AgreementModal
    title="美团标品库使用协议"
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
    fetchGetPoiAgreementInfo,
    fetchSubmitPoiAgreement
  } from '@/data/repos/poi'
  import AgreementModal from '@components/agreement-modal'

  export default {
    name: 'StandardProductLibraryAgreement',
    props: {
      value: Boolean,
      mode: {
        required: true,
        validator: val => ['view', 'sign'].indexOf(val) > -1
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
      fetchGetPoiAgreementInfo().then(data => {
        const { signed, required, loading, isMultiple } = data
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
          fetchSubmitPoiAgreement()
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
