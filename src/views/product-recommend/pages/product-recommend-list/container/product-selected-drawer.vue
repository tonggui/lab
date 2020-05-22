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
    <div slot="content">
      <ul>
        <li v-for="(value, key) in data" :key="key" />
          {{key}}
        </li>
      </ul>
      <ProdcutInfo />
    </div>
  </Drawer>
</template>

<script>
  import ProdcutInfo from '../components/product-info'
  export default {
    name: 'product-selected-drawer',
    props: {
      value: Boolean
    },
    data () {
      return {
        data: {
          '分类一': [{
            key: '1',
            picture: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'
          }]
        }
      }
    },
    components: {
      ProdcutInfo
    },
    methods: {
      handleDrawerVisible () {}
    }
  }
</script>

<style lang="less" scoped>
.product-selected-drawer-container {
}
</style>
