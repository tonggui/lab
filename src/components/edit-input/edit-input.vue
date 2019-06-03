<template>
  <div class="edit-input">
    <edit @edit="onEdit" :display="value" :editing="editing" @cancel="editing = false" v-bind="$attrs">
      <input ref="input" v-model="val" class="input" type="text" slot="editing">
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
