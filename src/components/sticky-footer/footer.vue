<template>
  <div ref="elRef" class="footer" :class="{ large: size === 'large' }">
    <slot v-if="$slots.default"></slot>
    <template v-else>
      <Tooltip
        v-for="(text, idx) in btnTexts"
        style="margin-left: 5px;"
        :key="idx"
        placement="top"
        :disabled="!btnTips[idx]"
        :content="btnTips[idx]"
      >
        <Button
          style="margin-left: 5px;"
          :type="btnTypes[idx] || 'default'"
          v-bind="btnProps[idx]"
          @click="handleBtnClickEvent(idx, text)"
        >
          {{ text }}
        </Button>
      </Tooltip>
    </template>
  </div>
</template>

<script>
/**
 * event {on-click}
 * slot {default}
 */
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'sticky-footer',
    props: {
      size: {
        type: String,
        validator: val => ['large', 'normal'].indexOf(val) > -1,
        default: 'normal'
      },
      bid: {
        type: Array,
        default: () => []
      },
      btnTips: {
        type: Array,
        validator: val => val.every(it => typeof it === 'string'),
        default: () => []
      },
      btnTexts: {
        type: Array,
        validator: val => val.every(it => typeof it === 'string'),
        default: () => ['上一步', '下一步']
      },
      btnTypes: {
        type: Array,
        validator: val =>
          val.every(it => ['primary', 'default'].indexOf(it) > -1),
        default: () => ['primary']
      },
      btnProps: {
        type: Array,
        validator: val => val.every(it => typeof it === 'object'),
        default: () => [{}]
      }
    },
    methods: {
      getHeight () {
        return this.$refs.elRef.clientHeight
      },

      handleBtnClickEvent (idx, text) {
        if (this.bid[idx]) {
          lx.mc({ bid: this.bid[idx] })
        }
        this.$emit('on-click', idx, text)
      }
    }
  }
</script>

<style scoped lang="less">
  .footer {
    height: 56px;
    padding: 0 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0 -4px 5px 0 #f7f8fa;
    border-radius: 2px;

    /deep/ .boo-btn {
      height: 36px;
      min-width: 90px;

      + .boo-btn {
        margin-right: 10px;
      }
    }

    &.large {
      height: 70px;

      /deep/ .boo-btn {
        height: 50px;
        min-width: 200px;
      }
    }
  }

  .sticky {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0 auto;
    width: inherit;
    max-width: inherit;
  }
</style>
