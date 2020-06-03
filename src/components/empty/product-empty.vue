<script>
  import Empty from './empty'
  import emptyImg from '@/assets/empty.jpg'

  export default {
    name: 'product-empty',
    props: {
      description: String
    },
    computed: {
      emptyImg () {
        return emptyImg
      }
    },
    render (h) {
      return h(Empty, {
        props: {
          image: emptyImg,
          imageStyle: { height: '120px' },
          description: this.description || '暂无商品哦～'
        },
        scopedSlots: { ...this.$scopedSlots }
      })
    }
  }
</script>
