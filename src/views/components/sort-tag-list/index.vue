<template>
  <Layout :loading="loading">
    <template slot="header">
      <div class="sort-tag-list-header" v-if="showSmartSort">
        <span>分类智能排序</span>
        <component :max-width="200" transfer :is="tooltip.component" :keyName="tooltip.keyName" :content="tooltip.content">
          <iSwitch
            size="small"
            :value="smartSortSwitch"
            @on-change="handleToggleSmartSwitch"
            v-mc="{ bid: 'b_shangou_online_e_lbx2k1w8_mc', val: { status: `${+!smartSortSwitch}` } }"
          />
        </component>
      </div>
    </template>
    <template slot="content">
      <component
        v-bind="$attrs"
        @change="handleChange"
        v-on="$listeners"
        :is="component"
      ></component>
    </template>
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/tag-list'
  import SmartSortTagList from './smart-sort-tag-list'
  import DragSortTagList from './drag-sort-tag-list'
  import TooltipWithLocalstorage from '@components/tooltip-with-localstorage'
  import storage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'sort-tag-list',
    props: {
      loading: Boolean,
      showSmartSort: Boolean,
      smartSortSwitch: Boolean,
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    components: {
      Layout,
      SmartSortTagList,
      DragSortTagList,
      TooltipWithLocalstorage
    },
    computed: {
      component () {
        return this.smartSortSwitch ? SmartSortTagList : DragSortTagList
      },
      tooltip () {
        if (!storage[KEYS.CATEGORY_SMART_SORT] && this.smartSortSwitch) {
          return {
            keyName: 'CATEGORY_SMART_SORT',
            content: '当前已开启智能排序，用户端分类将根据买家喜好进行排序',
            component: TooltipWithLocalstorage
          }
        }
        const result = {
          component: 'Tooltip',
          content: '已关闭，用户端分类将根据当前顺序进行排序',
          keyName: ''
        }
        if (this.smartSortSwitch) {
          result.content = '已开启，用户端分类将根据销量进行排序'
        }
        return result
      }
    },
    methods: {
      handleToggleSmartSwitch (value) {
        this.$emit('toggle-smart-sort', value)
      },
      handleChange (...rest) {
        this.$emit('change', ...rest, this.createCallback(() => {
          this.$Message.success('排序操作成功～')
        }, (err) => {
          this.$Message.success(err.message || '排序操作失败！')
        }))
      }
    }
  }
</script>
<style lang="less">
.sort-tag-list-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @border-color-light;
  span {
    margin-right: 5px;
  }
}
</style>
