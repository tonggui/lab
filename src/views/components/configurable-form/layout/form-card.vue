<template>
  <div class="card">
    <div class="header" v-if="title" :class="{ collapsible }" @click="handleToggleOpened">
      <span class="title">{{title}}</span>
      <span class="arrow" :class="{ 'is-opened': selfOpened }" v-if="collapsible">
        <Icon local="right-fill-arrow" />
      </span>
    </div>
    <component :is="autoExpand">
      <component :is="keepAlive">
        <Container v-if="collapsible && !selfOpened" key="close">
          <template v-if="isVueComponent(closedContent)">
            <component :is="closedContent" />
          </template>
          <template v-else>{{ closedContent }}</template>
        </Container>
        <Container key="content" v-else>
          <slot name="default"></slot>
        </Container>
      </component>
    </component>
  </div>
</template>
<script>
  /**
   * 参考 src/views/components/product-form/form-card.vue
   * form-card 组件，主要是 title + 布局 + 伸缩动画
   */
  import Vue from 'vue'
  import isVueComponent from 'is-vue-component'
  import AutoExpand from '@/transitions/auto-expand'

  /**
   * keep-alive 直接绑定在div上不会起到缓存的作用，包装一次成组件就行了
   * TODO 研究一下原理吧，可能是使用姿势不正确～。～
   */
  const Container = Vue.extend({
    render (h) {
      return h('div', [this.$slots.default])
    }
  })

  export default {
    name: 'form-card',
    props: {
      collapsible: Boolean, // 是否支持展开（会有个小三角和展开动画）
      opened: Boolean, // 👆是true的时候，默认是否展开
      closedContent: [String, Function], // 收起时，展示文案
      title: String // card 的title
    },
    data () {
      return {
        selfOpened: this.opened // 自控一下～
      }
    },
    watch: {
      opened () {
        this.selfOpened = this.opened // 更新自控的值～
      }
    },
    components: {
      AutoExpand, // 收缩的手风琴动画～。～
      Container
    },
    computed: {
      // 根据是否需要，进行判断，减少不必要的缓存～，～
      // TODO 可以研究一下keep-alive
      keepAlive () {
        return this.collapsible ? 'keep-alive' : 'div'
      },
      // 根据需求，嵌套动画组件
      autoExpand () {
        return this.collapsible ? AutoExpand : 'div'
      }
    },
    methods: {
      isVueComponent,
      // 伸缩响应函数
      handleToggleOpened () {
        if (!this.collapsible) {
          return
        }
        this.selfOpened = !this.selfOpened
        this.$emit('change', this.selfOpened)
      }
    }
  }
</script>
<style lang="less" scoped>
  .card {
    background: @component-bg;
    border-radius: 2px;
    box-shadow: 0 0 6px 0 #F3F3F4;
    padding: 20px;
    .header {
      line-height: 20px;
      padding-bottom: 20px;
      display: inline-flex;
      align-items: center;
      &.collapsible {
        cursor: pointer;
      }
    }
    .title {
      color: @primary-color;
      line-height: 20px;
      font-weight: bold;
    }
    .title-tip {
      margin-left: 15px;
      font-size: @font-size-small;
      color: @text-tip-color;
      letter-spacing: 0;
      line-height: 20px;
    }
    .arrow {
      margin-left: 6px;
      transform: rotate(90deg);
      transform-origin: 40% 60%;
      i {
        transform-origin: left center;
        transform: scale(0.6);
      }
      &.is-opened {
        transform-origin: 30% 50%;
        transform: rotate(-90deg);
      }
    }
    + .card {
      margin-top: 10px;
    }
  }
</style>
