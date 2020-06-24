<script>
  import SlideUp from '@/transitions/slide-up'
  import Card from './card'

  export default {
    name: 'batch-card-group',
    props: {
      deletable: Boolean
    },
    components: {
      SlideUp
    },
    methods: {
      handleDelete (...reset) {
        this.$emit('delete', ...reset)
      }
    },
    render (h) {
      const children = [].concat(this.$slots.default)
      return h(SlideUp, {
        props: {
          group: true
        }
      }, children.map((child, index) => {
        return h(Card, {
          key: child.key,
          props: {
            deletable: this.deletable,
            index: index
          },
          on: {
            delete: this.handleDelete
          }
        }, [child])
      }))
    }
  }
</script>
