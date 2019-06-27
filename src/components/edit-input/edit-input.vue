<template>
  <div class="edit-input">
    <edit
      @edit="onEdit"
      :display="value"
      :editing="editing"
      @cancel="handleCancel"
      @confirm="handleConfirm"
      v-bind="$attrs"
    >
      <input ref="input" v-model="val" class="input" type="text" slot="editing" @keyup.enter="handleConfirm">
    </edit>
  </div>
</template>

<script>
import Edit from '../edit/edit'

export default {
  name: 'edit-input',
  components: { Edit },
  props: {
    value: {
      type: String,
      default: ''
    },
    onConfirm: {
      type: Function,
      required: true
    }
  },
  watch: {
    value: {
      handler (v) {
        this.val = v
      },
      immediate: true
    }
  },
  data () {
    return {
      val: '',
      editing: false
    }
  },
  methods: {
    onEdit () {
      this.editing = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 取消编辑，重置当前编辑值
    handleCancel () {
      this.editing = false
      this.val = this.value
    },
    // 确认编辑，根据出入的onConfirm方法判断结果
    handleConfirm () {
      // 如果值没有发生变化，直接退出编辑
      if (this.val === this.value) {
        this.editing = false
        return
      }
      const result = this.onConfirm(this.val)
      // 返回值是boolean，为true代表成功，则退出编辑状态
      if (typeof result === 'boolean') {
        if (result) {
          this.editing = false
        }
      } else if (result.then) { // 返回值是Promise
        result.catch(err => {
          this.$Message.error(err.message)
          this.val = this.value
        }).finally(() => {
          this.editing = false
        })
      }
    }
  }
}
</script>

<style lang="less">
  .edit-input {
    display: inline-block;
    .input {
      outline: 0;
      box-shadow: none;
      border-radius: inherit;
      border: none;
      width: 100%;
      height: 100%;
      padding: 8px 10px;
    }
  }
</style>
