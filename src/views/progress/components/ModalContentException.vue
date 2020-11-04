<template>
  <div class="modal-content-exception">
    <div id="exception" class="exception-content" v-html="dataSource"></div>
    <div slot="footer" class="modal-footer">
      <Button id="clipboardBtn" data-clipboard-target="#exception" type="primary" @click="clickClip">复制到剪贴板</Button>
      <Button @click="handleClickOk">关闭</Button>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard/lib/clipboard'

  export default {
    name: 'modal-content-exception',
    props: {
      dataSource: {
        type: [String, Object],
        required: true
      }
    },
    data () {
      return {}
    },
    methods: {
      clickClip () {
        this.$Message.info('已成功复制到剪贴板')
      },
      handleClickOk () {
        this.$emit('close')
      }
    },
    mounted () {
      this.clipboardInstance = new Clipboard('#clipboardBtn')
    },
    destroyed () {
      if (this.clipboardInstance) {
        this.clipboardInstance.destroy()
      }
    }
  }
</script>

<style lang='less' scoped>
.modal-content-exception {
  .exception-content {
    padding: 15px 10px;
    word-break: break-word;
    max-height: 492px;
    overflow: auto;
  }
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
    .boo-btn:first-of-type {
      margin-right: 10px;
    }
  }
}
</style>
