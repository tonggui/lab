<template>
  <div class="upc-list">
    <div
      class="upc"
      v-for="(upc, index) in val"
      :key="index"
      :class="{
        error: !!getError(index)
      }"
    >
      <Input
        class="upc-list-input"
        :value="upc"
        @input="v => onChange(v, index)"
        @focus="onFocus(index)"
        placeholder="输入20位以内的数字"
        :validate="validateFunction"
        :disabled="disabled"
        :maxlength="maxLength"
        clearable
      />
      <Button
        v-if="val.length > 1"
        status="danger"
        @click="del(index)"
        :disabled="disabled"
      >
        删除
      </Button>
      <div class="error-tip" v-if="getError(index)">{{getError(index)}}</div>
    </div>
    <Button v-if="val.length < maxCount" :disabled="disabled" @click="add">添加</Button>
  </div>
</template>

<script>
  import trim from 'lodash/trim'
  import isEmpty from 'lodash/isEmpty'
  import Input from '@/components/input/ValidateInput'

  const upcReg = /^(\d{1,20})$/

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
      },
      maxCount: {
        type: Number,
        default: () => 10
      }
    },
    data () {
      return {
        oldUpc: null,
        val: [],
        errors: []
      }
    },
    computed: {
      validateFunction () {
        return this.validate ? this.restrainNum : null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (v = []) {
          this.val = [].concat(v)
        }
      }
    },
    methods: {
      restrainNum (v) {
        return /^\d*$/.test(v)
      },
      onChange (v, index) {
        this.$set(this.val, index, v)
        this.triggerValueChanged()
      },
      onFocus (index) {
        if (index === 0) {
          this.oldUpc = this.val[0]
        }
      },
      add () {
        this.val.push('')
        this.triggerValueChanged()
      },
      validate () {
        this.errors = []
        let i = 0
        do {
          const upcItem = this.val[i]
          if (isEmpty(trim(upcItem))) {
            this.errors[i] = 'upc/ean 不能为空'
            continue
          }
          if (!upcReg.test(upcItem)) {
            this.errors[i] = 'upc/ean 码必须为20位以内的数字'
            continue
          }
        } while (++i < this.val.length)
        if (this.errors.length) {
          return this.errors.find(item => !!item)
        }
      },
      del (index) {
        this.val.splice(index, 1)
        this.triggerValueChanged()
      },
      getError (index) {
        return this.errors[index]
      },
      triggerValueChanged () {
        this.$emit('input', this.val)
        this.$emit('change', this.val)
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

      .error-tip {
        color: @error-color;
        font-size: 12px;
        line-height: 1;
        margin: 8px 0;
      }

      &.error {
        /deep/ .boo-input {
          border: 1px solid @error-color;
        }
      }
    }
  }
</style>
