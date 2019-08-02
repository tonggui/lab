<template>
  <div class="container">
    <span v-if="label" class="label" :class="{ required }">{{ label }}</span>
    <div class="content">
      <div class="group">
        <CheckboxGroup :value="value" @on-change="handleChange">
          <Checkbox v-for="(item, i) in dataSource"
            :label="item[valueKey]"
            :key="item[valueKey]"
            class="checkbox"
            :class="{ closable: item.isCustomized }"
          >
            {{ item.name }}
            <span v-if="item.isCustomized" @click.prevent.stop="handleDelete(item, i)" class="close-icon">
              <Icon type="close" />
            </span>
          </Checkbox>
        </CheckboxGroup>
        <Edit :onConfirm="handleAdd" @on-cancel="handleCancel">
          <template v-slot:display="{ edit }">
            <span class="add" @click="edit(true)">
              <slot name="add">
                <Icon type="add" />添加选项
              </slot>
            </span>
          </template>
          <template slot="editing">
            <Tooltip :disabled="!inputError" :content="inputError" placement="bottom" :value="!!inputError">
              <Input size="small" v-model="inputValue" @on-keyup.enter="handleAdd" class="add-input" />
            </Tooltip>
          </template>
        </Edit>
      </div>
      <div class="error" v-show="!!requiredError">{{ requiredError }}</div>
    </div>
  </div>
</template>
<script>
  import { remove } from 'lodash'
  import Edit from '@components/edit'

  export default {
    name: 'sell-info-edit-checkbox-group',
    props: {
      dataSource: {
        type: Array,
        required: true
      },
      value: {
        type: Array,
        default: () => []
      },
      label: String,
      index: [Number, String],
      required: Boolean,
      errorTips: {
        type: String,
        default: '请选择s%'
      },
      generateItem: {
        type: Function,
        required: true
      },
      valueKey: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        inputValue: '',
        inputError: ''
      }
    },
    computed: {
      requiredError () {
        if (this.required && this.value.length <= 0) {
          return this.errorTips.replace('s%', this.label)
        }
        return ''
      }
    },
    watch: {
      inputValue () {
        this.validatorInput()
      }
    },
    components: {
      Edit
    },
    methods: {
      rest () {
        this.inputValue = ''
        this.$nextTick(() => {
          this.inputError = ''
        })
      },
      handleChange (valueList) {
        const result = []
        if (valueList.length > 0) {
          this.dataSource.forEach(item => {
            const v = item[this.valueKey]
            if (valueList.includes(v)) {
              result.push(v)
            }
          })
        }
        this.triggerChange(this.dataSource, result)
      },
      handleDelete (v, index) {
        const dataSource = [...this.dataSource]
        dataSource.splice(index, 1)
        const value = [...this.value]
        remove(value, n => n[this.valueKey] === v[this.valueKey])
        this.triggerChange(dataSource, value)
      },
      handleAdd () {
        if (this.validatorInput()) {
          return false
        }
        const node = this.generateItem(this.index, this.inputValue, this.dataSource.length)
        const newData = [...this.dataSource, node]
        this.triggerChange(newData, this.value)
        this.rest()
      },
      handleCancel () {
        this.rest()
      },
      triggerChange (dataSource, value) {
        this.$emit('on-change', dataSource, value, this.index)
      },
      validatorInput () {
        let error = ''
        if (!this.inputValue) {
          error = '不能为空'
        } else if (this.dataSource.find(i => i[this.valueKey] === this.inputValue)) {
          error = `${this.inputValue}已存在`
        }
        this.inputError = error
        return error
      },
      validator () {
        return this.requiredError
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';

  .container {
    min-height: 34px;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    color: @text-color;
    background: @component-bg;
    .error {
      height: 16px;
      line-height: 1em;
      font-size: @font-size-small;
      color: @error-color;
    }
    .label {
      width: 4em;
      padding-right: 10px;
      word-break: break-all;
      text-align: left;
      position: relative;
      &::after {
        position: absolute;
        .required-chart('\00a0');
      }
      &.required::after {
        content: '*';
      }
    }
    .content {
      flex: 1;
    }
    .group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      line-height: 32px;
      .add {
        color: @link-color;
        cursor: pointer;
        i {
          margin-right: 4px;
          line-height: 15px;
        }
      }
      .add-input {
        /deep/ .boo-input {
          border: none;
        }
      }
      .checkbox {
        min-width: 80px;
        margin-right: 20px;
        margin-left: 0px;
        padding-left: 6px;
        position: relative;
        border: 1px solid transparent;
        border-radius: @border-radius-base;
        .close-icon {
          line-height: 16px;
          margin-left: 4px;
          visibility: hidden;
          color: @text-tip-color;
          font-size: @font-size-small;
        }
        &.closable:hover {
          border-color: @border-color-base;
          background: #F4F4F5;
          .close-icon {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
