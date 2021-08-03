<template>
  <div class="product-multi-cube-tabs-container">
    <Tabs :value='currentTabId' :class="['tab-lists', operationInfo.info ? 'bottom-border' : '']" @on-click="handleClickTab">
      <template v-for="item in tabLists">
        <TabPane :key="item.id" :label="item.label" :name="item.name" />
      </template>
      <div slot="extra" class="product-multi-cube-tabs-extra">
        <slot name="tabs-extra"></slot>
      </div>
    </Tabs>
    <div type="warning" class="operation-info-tip" v-show="operationInfo.info">
      <span>
        <Icon type="info" color="#F89800" class="icon" />
        {{operationInfo.info}}
      </span>
      <a @click.prevent="handlePageTurn(operationInfo.link)">查看活动规则</a>
    </div>
  </div>
</template>

<script>
  import { get } from 'lodash'
  import { helper } from '../../../store'
  const { mapState, mapActions } = helper('multiCubeList')

  export default {
    methods: {
      ...mapActions(['getTabList', 'setCurrentTab']),
      handleClickTab (value) {
        if (value === this.currentTabId) return
        this.setCurrentTab(value)
        this.$emit('on-change')
      },
      handlePageTurn (link) {
        window.open(link)
      }
    },
    computed: {
      ...mapState(['tabList', 'currentTabId']),
      operationInfo () {
        const tab = this.tabList.find(item => item.id === this.currentTabId)
        return {
          info: get(tab, 'tips') || '',
          link: get(tab, 'url') || ''
        }
      },
      tabLists () {
        return this.tabList.map(({ id, title = '', subTitle = '', info = '', link = '' }) => ({
          id,
          name: id,
          label: (h) => {
            return h('div', [
              h('span', title + ' '),
              subTitle ? h('Tooltip', {
                attrs: {
                  transfer: true,
                  maxWidth: 180,
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
    }
  }
</script>

<style lang="less" scoped>
  .product-multi-cube-tabs-container {
    .tab-lists {
      height: 59px;
      padding: 0 20px;
      &.bottom-border {
        border-bottom: 1px solid #E9EAF2;
      }
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
        height: 60px;
      }
      &-extra {
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        height: 61px;
      }
    }
    .operation-info-tip {
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0;
      font-weight: 500;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #36394D;
      padding: 0 20px 0 41px;
      border: 1px solid rgba(248, 181, 0, 0.2);
      background-color: rgba(248, 181, 0, 0.1);
      .icon {
        margin-right: 9px;
      }
    }
  }
</style>
