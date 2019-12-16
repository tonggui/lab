<template>
  <div
    class="input-box"
    :style="{ width }"
    :class="{ disabled: disabled, active: focus, bordered }"
    @click="handleFocus"
  >
    <div class="tags">
      <template v-if="multiple">
        <Tag
          :fade="false"
          v-for="(item, index) in value"
          :key="item.idPath.join(separator)"
          @on-close="e => handleDelete(e, index)"
          closable
        >
          {{ item.namePath.join(separator) }}
        </Tag>
      </template>
      <input
        ref="inputRef"
        class="input"
        :disabled="disabled"
        :value="focus ? search : name"
        @input="handleSearch"
        :placeholder="
          multiple
            ? value.length > 0
              ? ''
              : placeholder
            : name || placeholder
        "
      />
    </div>
    <div v-if="!disabled" class="status">
      <span class="icon clear" v-show="value.length > 0 || name">
        <Icon type="cancel" :size="16" @click="handleClear" />
      </span>
      <span class="icon arrow" :class="{ active: focus }">
        <Icon type="keyboard-arrow-down" :style="{ 'font-size': 10, color: '#BABCCC' }" />
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tag-list-input-box',
    props: {
      focus: Boolean,
      multiple: Boolean,
      disabled: Boolean,
      bordered: Boolean,
      width: {
        type: [Number, String],
        default: 440
      },
      separator: {
        type: String,
        default: ' > '
      },
      placeholder: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      search: {
        type: String,
        default: ''
      },
      value: {
        type: Array,
        default: () => ([])
      }
    },
    methods: {
      handleFocus (e) {
        if (this.disabled) return
        this.$refs.inputRef.focus()
        if (!this.focus) {
          this.$emit('focus', e)
        } else {
          e.stopPropagation()
        }
      },
      handleDelete (e, index) {
        this.$emit('del', e, index)
      },
      handleSearch (e) {
        this.$emit('search', e.target.value)
      },
      handleClear (e) {
        this.$emit('clear', e)
      }
    }
  }
</script>

<style lang="less" scoped>
  .input-box {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 2px;
    width: 440px;
    max-width: 100%;
    font-size: @font-size-base;
    padding: 3px 10px;
    line-height: 28px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      .status .icon.clear {
        display: inline-block;
      }
    }
    &.bordered {
      border: 1px solid @disabled-border-color;
    }
    &.bordered {
      &:hover, &:focus, &.active {
        border: 1px solid @input-hover-border-color;
      }
    }
    &.disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      color: rgb(173, 175, 187);
    }
    .tags {
      line-height: 2;
      display: flex;
      align-items: center;
      flex: 1;
      flex-wrap: wrap;
      margin-right: 40px;
      /deep/ .boo-tag {
        margin: 3px 6px 3px 0;
        vertical-align: middle;
      }
    }
    .input {
      display: inline-block;
      width: auto;
      line-height: 1;
      min-width: 1px;
      outline: none;
      flex: 1;
      background: transparent;
      border: none;
      padding: 0;
      margin: 4px 0px;
      cursor: inherit;
      &::-webkit-input-placeholder {
        color: @input-placeholder-color;
      }
    }
    .status {
      position: absolute;
      right: 10px;
      display: inline-block;
      width: auto;
      .icon {
        color: @icon-color;
        margin-left: 5px;
        &:first-child {
          margin-left: 0;
        }
        &.clear {
          display: none;
        }
      }
      .arrow {
        display: inline-block;
        transition: all 0.25s;
        &.active {
          transform: rotate(180deg);
          transform-origin: 50% 52%;
        }
      }
    }
  }
</style>
