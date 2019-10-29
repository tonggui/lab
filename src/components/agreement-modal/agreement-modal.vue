<template>
  <Modal
    v-if="mode === 'sign'"
    class="agreement-modal"
    :title="title"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk"
  >
    <Loading v-show="loading" />
    <iframe
      v-if="url"
      title="agreement"
      :src="url"
      frameBorder="0"
      scrolling="yes"
      width="100%"
    />
    <Checkbox v-show="isMultiple" v-model="isAgreed">
      协议对所辖全部门店生效
    </Checkbox>
    <div slot="footer">
      <Button type="primary" :disabled="disabled" @click="onOk">
        我已阅读并同意以上协议
      </Button>
    </div>
  </Modal>
  <Modal
    v-else
    class="agreement-modal"
    :title="title"
    :value="visible"
    :closable="false"
    :mask-closable="false"
    @on-ok="onOk"
  >
    <Loading v-show="loading" />
    <iframe
      v-if="url"
      title="agreement"
      :src="url"
      frameBorder="0"
      scrolling="yes"
      width="100%"
    />
    <div slot="footer">
      <Button type="primary" :disabled="disabled" @click="onOk">
        我知道了
      </Button>
    </div>
  </Modal>
</template>

<script>
/**
 * event {confirm close}
 */
  export default {
    name: 'agreement-modal',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: '美团标品库使用协议'
      },
      loading: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default: null
      },
      mode: {
        validator: val => ['view', 'sign'].indexOf(val) > -1
      },
      isMultiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isAgreed: false
      }
    },
    computed: {
      disabled () {
        return this.isMultiple && !this.isAgreed
      }
    },
    methods: {
      onOk () {
        if (this.disabled) {
          return
        }
        this.$emit('confirm')
      }
    }
  }
</script>

<style scoped lang="less">
.agreement-modal {
  :global {
    .ant-modal-body {
      iframe {
        min-height: 300px;
        max-height: 600px;
      }
    }

    .ant-modal-footer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
