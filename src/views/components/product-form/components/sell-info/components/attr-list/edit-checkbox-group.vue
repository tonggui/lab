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
            <span v-if="item.isCustomized" @click="handleDelete(item, i)" class="close-icon">
              <Icon type="close" />
            </span>
          </Checkbox>
        </CheckboxGroup>
        <Edit :onConfirm="handleAdd">
          <template v-slot:display="{ edit }">
            <span class="add" @click="edit(true)">
              <slot name="add">
                <Icon type="add" />添加选项
              </slot>
            </span>
          </template>
          <template slot="editing">
            <Tooltip :disabled="!inputError" :content="inputError" placement="bottom">
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
        inputValue: ''
      }
    },
    computed: {
      inputError () {
        if (!this.inputValue) {
          return '不能为空'
        }
        if (this.dataSource.find(i => i[this.valueKey] === this.inputValue)) {
          return `${this.inputValue}已存在`
        }
        return ''
      },
      requiredError () {
        if (this.required && this.value.length <= 0) {
          return this.errorTips.replace('s%', this.label)
        }
        return ''
      }
    },
    components: {
      Edit
    },
    methods: {
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
        this.emitChange(this.dataSource, result)
      },
      handleDelete (v, index) {
        const dataSource = [...this.dataSource]
        dataSource.splice(index, 1)
        const value = [...this.value]
        remove(value, n => n[this.valueKey] === v[this.valueKey])
        this.emitChange(dataSource, value)
      },
      handleAdd () {
        if (this.inputError) {
          return
        }
        const node = this.generateItem(this.index, this.inputValue, this.dataSource.length)
        const newData = [...this.dataSource, node]
        this.emitChange(newData, this.value)
        this.inputValue = ''
      },
      emitChange (dataSource, value) {
        this.$emit('on-change', dataSource, value, this.index)
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
        .required-chart(\00a0);
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
