<template>
  <Tabs :value='currentTabId' class="product-new-arrival-tabs" @on-click="handleClickTab">
    <template v-for="item in tabLists">
      <TabPane :key="item.id" :label="item.label" :name="item.name" />
    </template>
    <div slot="extra" class="product-new-arrival-tabs-extra">
      <slot name="tabs-extra"></slot>
    </div>
  </Tabs>
</template>

<script>
  import { helper } from '../../../store'
  const { mapState, mapActions } = helper('newArrivalList')

  export default {
    props: {
    },
    data () {
      return {
      }
    },
    methods: {
      ...mapActions(['getTabList', 'setCurrentTab']),
      handleClickTab (value) {
        this.setCurrentTab(value)
      }
    },
    computed: {
      ...mapState(['tabList', 'currentTabId']),
      tabLists () {
        return this.tabList.map(({ id, title = '', subTitle = '', info = '', link = '' }) => ({
          id,
          name: id,
          label: (h) => {
            return h('div', [
              h('span', title + ' '),
              subTitle ? h('Tooltip', {
                attrs: {
                  content: subTitle,
                  placement: 'right'
                }
              }, [h('Icon', {
                props: {
                  type: 'help-outline'
                }
              })]) : null
            ])
          }
        }))
      }
    },
    mounted () {
      this.getTabList()
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
