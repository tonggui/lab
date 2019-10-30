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
    fetchGetPoiAgreementInfo,
    fetchSubmitPoiAgreement
  } from '@/data/repos/poi'
  import AgreementModal from './agreement-modal'

  export default {
    name: 'agreement-modal-container',
    props: {
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
        visibleSelf: false
      }
    },
    mounted () {
      fetchGetPoiAgreementInfo().then(data => {
        const { signed, required, loading, isMultiple } = data
        if (this.mode === 'sign' && (signed || !required)) {
          this.visibleSelf = false
        } else {
          this.visibleSelf = true
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
      }
    },
    components: {
      AgreementModal
    }
  }
</script>

<style scoped></style>
