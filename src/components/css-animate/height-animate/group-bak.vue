<script>
import AnimateHeight from './height'
export default {
  name: 'animate-group',
  mounted () {
    console.log(this.$slots)
  },
  components: {
    AnimateHeight
  },
  render (h) {
    const childs = this.$slots.default.map((item, index) => {
      return h(
        'animate-height',
        {
          key: index,
          props: {
            duration: '5000',
            appear: true
          }
        },
        [item]
      )
    })
    return h(
      'transition-group',
      {
        props: {
          tag: 'div'
        }
      },
      childs
    )
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
