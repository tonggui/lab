<template>
  <div style="background: #fff">
    <SellInfo
      key="dddd"
      :attrList="attrList"
      :selectAttrMap="selectAttrMap"
      :skuList="skuList"
      @on-change="handleChange"
    />
    <div style="height: 100px"></div>
    <SellInfo key="normale" :skuList="skuList" @on-change="handleChange" />
  </div>
</template>
<script>
  import SellInfo from './index'

  const attrList = [{
    id: 1,
    name: '颜色',
    required: true,
    options: [{
      id: 11,
      name: '黑色',
      isCustomized: false,
      parentId: 1,
      parentName: '颜色'
    }, {
      id: 12,
      name: '白色',
      isCustomized: false,
      parentId: 1,
      parentName: '颜色'
    }, {
      id: 13,
      name: '红色',
      isCustomized: false,
      parentId: 1,
      parentName: '颜色'
    }]
  }, {
    id: 2,
    name: '大小',
    required: false,
    options: [{
      id: 21,
      name: 'S',
      isCustomized: false,
      parentId: 2,
      parentName: '大小'
    }, {
      id: 22,
      name: 'M',
      isCustomized: false,
      parentId: 2,
      parentName: '大小'
    }, {
      id: 23,
      name: 'L',
      isCustomized: false,
      parentId: 2,
      parentName: '大小'
    }]
  }]

  const selectAttrMap = {
    1: ['黑色', '红色'],
    2: ['S']
  }

  const skuList = [{
    id: 'sku_1',
    price: {
      value: 1,
      unit: '份'
    },
    weight: {
      value: 12,
      unit: '克(g)'
    },
    stock: 1,
    box: {
      price: 2,
      count: 1
    },
    upcCode: 'upcCode',
    sourceFoodCode: 'sourceFoodCode',
    shelfNum: 'shelfNum',
    categoryAttrList: [{
      parentId: 1,
      parentName: '颜色',
      name: '黑色',
      id: 11
    }, {
      parentId: 2,
      parentName: '大小',
      name: 'S',
      id: 21
    }]
  }]

  export default {
    name: 'sell-info-demo',
    data () {
      return {
        attrList,
        selectAttrMap,
        skuList
      }
    },
    components: {
      SellInfo
    },
    methods: {
      handleChange (skuList, attrList, selectAttrMap) {
        this.skuList = skuList
        this.attrList = attrList
        this.selectAttrMap = selectAttrMap
      }
    }
  }
</script>
