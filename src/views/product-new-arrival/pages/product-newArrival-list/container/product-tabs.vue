<template>
  <Tabs value="name1" class="product-new-arrival-tabs" name="ggg">
    <template v-for="item in tabLists">
      <TabPane :key="item.id" :label="item.label" :name="item.name" />
    </template>
    <div slot="extra" class="product-new-arrival-tabs-extra">
      <slot name="tabs-extra"></slot>
    </div>
  </Tabs>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {
        label: (h) => {
          return h('div', [
            h('span', '标签一 '),
            h('Icon', {
              props: {
                type: 'help-outline'
              }
            })
          ])
        }
      }
    },
    computed: {
      tabLists () {
        return [
          {
            id: 1,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖'),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '1'
          },
          {
            id: 2,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖 '),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '2'
          },
          {
            id: 3,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖 '),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '3'
          },
          {
            id: 4,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖 '),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '4'
          },
          {
            id: 5,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖'),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '5'
          },
          {
            id: 6,
            label: (h) => {
              return h('div', [
                h('span', '同行在卖'),
                h('Icon', {
                  props: {
                    type: 'help-outline'
                  }
                })
              ])
            },
            name: '6'
          }
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-new-arrival-tabs {
    /deep/ .boo-tabs-bar {
      margin-bottom: 0;
      .boo-tabs-nav-wrap.boo-tabs-nav-scrollable {
        display: flex;
        align-items: center;
        .boo-tabs-nav-next,
        .boo-tabs-nav-prev {
          transform: translateY(-2px);
        }
      }
    }
    /deep/ .boo-tabs-nav .boo-tabs-tab {
      padding: 20px 4px 20px 20px;
    }
    &-extra {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      height: 61px;
    }
  }
</style>
