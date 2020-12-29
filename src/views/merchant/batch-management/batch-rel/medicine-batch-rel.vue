<template>
    <Tabs :value="currentTab" name="medicine-batch-rel">
        <TabPane tab="medicine-batch-rel" :key="KEYS.MEDICINE_CREARE_REL" label="新建关联关系" :name="KEYS.MEDICINE_CREARE_REL">
            <CreateRel/>
        </TabPane>
        <TabPane tab="medicine-batch-rel" :key="KEYS.MEDICINE_DELETE_REL" label="批量删除门店商品" :name="KEYS.MEDICINE_DELETE_REL">
            <DelRel/>
        </TabPane>
    </Tabs>
</template>

<script>
  import { KEYS } from '../menus'
  import CreateRel from './index'
  import DelRel from '../batch-delete-relation'

  export default {
    data () {
      return {
        currentTab: KEYS.MEDICINE_CREARE_REL,
        KEYS: KEYS
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
