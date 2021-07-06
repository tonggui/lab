<template>
  <div class="edit-input">
    <!-- TODO: 新增了change事件 -->
    <edit
      v-on="$listeners"
      v-bind="$attrs"
      @on-edit="onEdit"
      @change="change"
      :size="size"
      :border="false"
    >
      <template v-slot:editing="{ value, change, confirm }">
        <component :is="wrapperComponent" :unit="inputPrefix" class="input-wrapper">
          <component
            :is="inputComponent"
            ref="input"
            class="input"
            :value="value"
            @on-change="e => change(e.target.value)"
            type="text"
            @on-keyup.enter="confirm(value)"
            :size="size"
            v-bind="inputProps"
          >
            <template slot="suffix">
              <slot name="input-suffix" v-bind="{ confirm }"></slot>
            </template>
          </component>
        </component>
      </template>
      <template v-slot:display="slotProps">
        <slot name="display" v-bind="slotProps"></slot>
      </template>
      <template slot="icon">
        <slot name="icon"></slot>
      </template>
    </edit>
    <!-- TODO: 新增小于库存标识 -->
    <div v-if="showStockInsufficient">库存小于最小购买量{{minOrderCount}}</div>
  </div>
</template>

<script>
  import Edit from '../edit/index'
  import UnitNumber from '@components/unit-number'

  export default {
    name: 'edit-input',
    data () {
      return {
        // TODO: 新增是否编辑中、输入框的值
        editing: false,
        changeValue: null
      }
    },
    props: {
      size: {
        type: String,
        validator (size) {
          return ['default', 'small', 'large'].includes(size)
        },
        default: 'default'
      },
      input: {
        type: String,
        default: 'Input'
      },
      inputProps: {
        type: Object,
        default: () => ({})
      },
      inputPrefix: String,
      // 新增起购数
      minOrderCount: {
        type: Number,
        default: 0
      },
      // 当前编辑标识
      sign: {
        type: String,
        default: ''
      }
    },
    computed: {
      inputComponent () {
        return this.input
      },
      wrapperComponent () {
        return this.inputPrefix ? UnitNumber : 'span'
      },
      // 增加计算属性，判断是否展示
      showStockInsufficient () {
        return this.sign === 'stock' && this.editing && this.changeValue > 0 && this.changeValue < this.minOrderCount
      }
    },
    components: { Edit, UnitNumber },
    methods: {
      onEdit (edit) {
        // 自定义事件赋值
        this.editing = edit
        if (edit) {
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        }
      },
      // 监听value值变化
      change (value) {
        this.changeValue = value
      }
    }
  }
</script>
<style lang="less" scoped>
  .edit-input {
    /deep/ .input input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      &:focus {
        box-shadow: none;
      }
    }
    .input-wrapper {
      display: inline-flex;
      align-items: center;
      width: 100%;
    }
  }
</style>
