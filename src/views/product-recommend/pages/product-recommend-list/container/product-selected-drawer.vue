<template>
  <Drawer
    :width="631"
    :value="value"
    :mask-closable="false"
    closable
    @on-close="$emit('on-drawer-close')"
    class="product-selected-drawer-container"
  >
    <h2>已选商品(0)</h2>
    <Icon type="closed" slot="close" color="#666" />
    <ul class="classify-table-list">
      <li v-for="(val, key, index) in myData" :key="key+index">
        <SelectedClassifyProductList :title="key" :children="val" />
      </li>
    </ul>
    <div slot="footer" class="classify-table-list-footer">
      <span class="empty-selected">清空已选</span>
      <Button type="primary">确定创建</Button>
    </div>
  </Drawer>
</template>

<script>
  import SelectedClassifyProductList from '../components/selected-classify-product-list'
  export default {
    name: 'product-selected-drawer',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        myData: {
          '分类一': [
            {
              key: '1',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '2',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '3',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '4',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '5',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '6',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '7',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '8',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '9',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            },
            {
              key: '10',
              name: '2121',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            }
          ],
          '分类二': [
            {
              key: '2',
              weight: '重量 123',
              upc: '21212121',
              pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg']
            }
          ]
        }
      }
    },
    components: {
      SelectedClassifyProductList
    },
    methods: {
      handleDrawerVisible () {}
    },
    beforeMount () {
      console.log('beforeMount', this.mySource, this.value)
    },
    mounted () {
      console.log('this.my', this.mySource)
    }
  }
</script>

<style lang="less" scoped>
.product-selected-drawer-container {
  height: 100%;
  .classify-table-list {
    list-style: none;
    margin-top: 20px;
    border-top: 1px solid #E9EAF2;
  }
}
</style>
