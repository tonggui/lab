<template>
  <Modal
    :width="600"
    :value="visible"
    :loading="loading"
    :title="title"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
  >
    <Alert v-show="error" type="error">{{ error }}</Alert>
    <div>
      {{`共选中${count}个城市配置${op.desc}`}}
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
    data () {
      return {
        error: ''
      }
    },
    computed: {
      title () {
        return config[this.op.type] ? config[this.op.type].title : ''
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
