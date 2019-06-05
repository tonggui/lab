<template>
  <Modal
    :value="visible"
    :title="title"
    @on-ok="handleConfirm"
    @on-cancel="handleCancel"
    loading="loading"
    ok-text="确定"
    cancel-text="取消"
  >
    <PackBagSetting :value="valueSelf" :items="items" @change="handleChange" />
  </Modal>
</template>

<script>
import PackBagSetting from './pack-bag-setting'
/**
 * event {change, visible-change}
 */
export default {
  name: 'packbag-setting-modal',
  props: {
    title: {
      type: String,
      default: '购物袋设置'
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      validator (val) {
        return val.every(it => {
          return typeof it.value === 'number' && typeof it.label === 'string'
        })
      },
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valueSelf: this.value
    }
  },
  methods: {
    handleConfirm () {
      if (this.valueSelf !== this.value) {
        this.$emit('change', this.valueSelf)
      } else {
        this.$emit('visible-change', false)
      }
    },

    handleCancel () {
      this.$emit('visible-change', false)
    },

    handleChange (v) {
      this.valueSelf = v
    },

    reset () {
      this.valueSelf = this.value
    }
  },
  components: {
    PackBagSetting
  }
}
</script>

<style scoped></style>
