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
  import Vue from 'vue'
  import isVueComponent from 'is-vue-component'
  import AutoExpand from '@/transitions/auto-expand'

  const Container = Vue.extend({
    render (h) {
      return h('div', [this.$slots.default])
    }
  })

  export default {
    name: 'form-card',
    props: {
      collapsible: Boolean,
      opened: Boolean,
      closedContent: [String, Function],
      title: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        selfOpened: this.opened
      }
    },
    watch: {
      opened () {
        this.selfOpened = this.opened
      }
    },
    components: {
      AutoExpand,
      Container
    },
    computed: {
      keepAlive () {
        return this.collapsible ? 'keep-alive' : 'div'
      },
      autoExpand () {
        return this.collapsible ? AutoExpand : 'div'
      }
    },
    methods: {
      isVueComponent,
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
