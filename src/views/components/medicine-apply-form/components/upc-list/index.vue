<template>
  <div class="upc-list">
    <div class="upc" v-for="(upc, index) in value" :key="index">
      <Input
        class="upc-list-input"
        :value="upc"
        @input="v => onChange(v, index)"
        @focus="onFocus(index)"
        @blur="check($event, index)"
        placeholder="输入8/12/13/14位数字"
        :validate="validateFunction"
        :disabled="disabled"
        :maxlength="maxLength"
        clearable
      />
      <Button
        v-if="value.length > 1"
        status="danger"
        @click="del(index)"
        :disabled="disabled"
      >
        删除
      </Button>
    </div>
    <Button :disabled="disabled" @click="add">添加</Button>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  import Input from '@/components/input/ValidateInput'

  const upcReg = /^(\d{8}|\d{12}|\d{13}|\d{14})$/

  export default {
    name: 'UpcList',
    components: { Input },
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      maxLength: {
        // 输入上限
        type: [Number, String]
      }
    },
    data () {
      return {
        oldUpc: null
      }
    },
    computed: {
      validateFunction () {
        return this.validate ? this.restrainNum : null
      }
    },
    methods: {
      restrainNum (v) {
        return /^\d*$/.test(v)
      },
      onChange: debounce(function (v, index) {
        this.$set(this.value, index, v)
      }, 500),
      onFocus (index) {
        if (index === 0) {
          this.oldUpc = this.value[0]
        }
      },
      add () {
        this.value.push('')
      },
      check (e, index) {
        const upc = e.target.value
        if (this.validate && !upcReg.test(upc)) {
          e.target.focus()
          return this.$Message.warning('upc/ean 码必须为8位、12位、13位或14位')
        }
        // 第一个UPC/EAN变化的时候需要拉取产地信息，所以将第一个upc emit出去
        if (index === 0 && this.oldUpc !== upc) {
          this.$emit('change', upc)
        }
      },
      validate () {
        // 供调用该组件的外面组件使用 检查UpcList
        if (!this.validate) {
          const haveEmpty = this.value.some(v => !v)
          return haveEmpty ? 'upc/ean 不能为空' : ''
        }
        const haveInvalid = this.value.some(v => {
          return !upcReg.test(v)
        })
        if (haveInvalid) {
          return 'upc/ean 码必须为8位、12位、13位或14位'
        }
      },
      del (index) {
        this.value.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="less">
  .upc-list {
    .upc {
      margin-bottom: 10px;

      .upc-list-input {
        display: inline-block;
        width: 370px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
</style>
