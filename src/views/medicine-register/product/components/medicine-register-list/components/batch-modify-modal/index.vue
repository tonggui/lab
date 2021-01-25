<template>
  <Modal
    :width="600"
    :value="visible"
    :loading="loading"
    :title="title"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
  >
    <div>
      {{`共选中${count}个配置项${op.name}`}}
    </div>
  </Modal>
</template>
<script>
  import config from './config'

  export default {
    name: 'medicine-register-batch-modal',
    props: {
      visible: {
        type: Boolean,
        default: false
      }, // ture:显示,false:不显示
      loading: {
        type: Boolean,
        default: false
      },
      op: {
        type: Object,
        default: () => {}
      },
      count: {
        type: Number,
        default: 0
      }
    },
    computed: {
      title () {
        if (config[this.op.type]) {
          return config[this.op.type].title
        } else {
          return ''
        }
      }
    },
    methods: {
      handleCancel () {
        this.$emit('cancel')
      },
      handleOk () {
        this.$emit('submit')
      }
    },
    mounted () {
    }
  }
</script>
