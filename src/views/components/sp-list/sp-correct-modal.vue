<template>
  <Modal
    :z-index="2000"
    class="sp-correct-modal"
    :value="visible"
    :closable="false"
    title="标品纠错须知"
    :mask-closable="false"
  >
    <iframe
      v-if="url"
      title="agreement"
      :src="url"
      frameBorder="0"
      scrolling="yes"
      width="100%"
    />
    <div slot="footer">
      <Button @click="onCancel">取消</Button>
      <Button type="primary" @click="onOk">确认</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'sp-correct-modal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default: null
      }
    },
    methods: {
      onOk () {
        this.$emit('confirm')
      },
      onCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
<style scoped lang="less">
.sp-correct-modal {
  /deep/ .boo-modal-body {
    overflow: auto;
    iframe {
      min-height: 400px;
      max-height: 700px;
      min-width: 750px;
    }
  }

  /deep/ .boo-modal-footer {
    display: flex;
    justify-content: center;
    padding-top: 0;
  }
}
</style>
