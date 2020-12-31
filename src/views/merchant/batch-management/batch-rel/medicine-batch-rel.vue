<template>
    <Tabs :value="currentTab" name="medicine-batch-rel">
        <TabPane tab="medicine-batch-rel" :key="tabs.create" label="新建关联关系" :name="tabs.create">
            <CreateRel/>
        </TabPane>
        <TabPane tab="medicine-batch-rel" :key="tabs.del" label="批量删除门店商品" :name="tabs.del">
            <DelRel/>
        </TabPane>
    </Tabs>
</template>

<script>
  import CreateRel from './index'
  import DelRel from '../batch-delete-relation'

  export default {
    data () {
      return {
        currentTab: 'create',
        tabs: {
          create: 'create',
          del: 'delete'
        }
      }
    },
    computed: {},
    components: {
      CreateRel,
      DelRel
    },
    methods: {}
  }
</script>

<style>

</style>
