<template>
  <Layout :loading="loading">
    <template slot="header">
      <div class="sort-tag-list-header" v-if="showSmartSort">
        <span>分类智能排序</span>
        <Tooltip :max-width="200" transfer v-bind="tooltip" :disabled="!havePermission">
          <PermissionBtn
            component="iSwitch"
            :btn-type="btnType"
            :need-permission="needPermission"
            size="small"
            :value="smartSortSwitch"
            @on-change="handleToggleSmartSwitch"
            v-mc="{ bid: 'b_shangou_online_e_fc6jq3cs_mc', val: { status: `${+!smartSortSwitch}` } }"
          />
        </Tooltip>
      </div>
    </template>
    <template slot="content">
      <component
        v-bind="$attrs"
        @change="handleChange"
        @select="$listeners.select"
        @expand="$listeners.expand"
        :is="component"
      ></component>
    </template>
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/tag-list'
  import SmartSortTagList from './smart-sort-tag-list'
  import DragSortTagList from './drag-sort-tag-list'
  import storage, { KEYS } from '@/common/local-storage'
  import PermissionBtn from '@/views/components/permission-bth/index'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  export default {
    name: 'sort-tag-list',
    mixins: [getPermissionMixin('MANAGE_PRODUCT_AND_CLASSIFICATION_SORT')],
    props: {
      loading: Boolean,
      showSmartSort: Boolean,
      smartSortSwitch: Boolean,
      createCallback: {
        type: Function,
        default: (success) => success
      },
      needPermission: Boolean
    },
    components: {
      PermissionBtn,
      Layout,
      SmartSortTagList,
      DragSortTagList
    },
    computed: {
      component () {
        return this.smartSortSwitch ? SmartSortTagList : DragSortTagList
      },
      tooltip () {
        const tooltip = {
          keyName: undefined,
          content: '',
          type: 'default'
        }
        if (!storage[KEYS.CATEGORY_SMART_SORT] && this.smartSortSwitch) {
          tooltip.content = '当前已开启智能排序，用户端分类将根据买家喜好进行排序'
          tooltip.keyName = 'CATEGORY_SMART_SORT'
          tooltip.type = 'guide'
        } else {
          tooltip.content = this.smartSortSwitch ? '已开启，用户端分类将根据销量进行排序' : '已关闭，用户端分类将根据当前顺序进行排序'
        }
        return tooltip
      }
    },
    methods: {
      handleToggleSmartSwitch (value) {
        this.$emit('toggle-smart-sort', value, this.createCallback(() => {
          this.$Message.success('智能排序切换成功！')
        }, (err) => {
          this.$Message.error(err.message || '智能排序切换失败！')
        }))
      },
      handleChange (...rest) {
        this.$emit('change', ...rest, this.createCallback(() => {
          this.$Message.success('排序操作成功～')
        }, (err) => {
          this.$Message.error(err.message || '排序操作失败！')
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
