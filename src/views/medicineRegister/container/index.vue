<template>
  <div class="medicine-register-page-layout" v-bind="$attrs">
    <div class="search-wrap">
        <MedicineRegisterSearch></MedicineRegisterSearch>
    </div>
    <div class="list-wrap">
        <MedicineRegisterList></MedicineRegisterList>
    </div>
  </div>
</template>
<script>
  import MedicineRegisterSearch from './search'
  import MedicineRegisterList from './list'
  export default {
    name: 'medicine-register-list-wrapper',
    components: {
      MedicineRegisterSearch,
      MedicineRegisterList
    }
  }
</script>
<style lang="less">
  .medicine-register-page-layout {
    display: flex;
    flex-direction: column;
    color: @primary-color;
    min-height: 100%;
    .search-wrap{
      margin-bottom: 10px;
      padding: 20px 20px 56px 20px;
      background: #ffffff;
      margin-bottom: 10px;
    }
    .list-wrap {
      flex: 1;
      min-height: 500px;
      background: #fff;
    }
  }
</style>
