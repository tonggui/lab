<script>
  import createForm from './index'
  import service from './service'
  import { splitCategoryAttrMap } from '../../form/utils'

  const form = createForm({}, service)

  export default {
    name: 'common-form-demo',
    components: {
      ...form.components
    },
    data () {
      return {
        loading: true
      }
    },
    computed: {
      spuId () {
        return this.$route.query.spuId
      },
      data: {
        get () {
          return form.data
        },
        set (data) {
          form.data = data
        }
      },
      context: {
        get () {
          return form.context
        },
        set (context) {
          form.context = context
        }
      },
      config () {
        return form.config
      }
    },
    async mounted () {
      if (this.spuId) {
        const product = await service.getProductDetail()
        const { categoryAttrList, categoryAttrValueMap } = product
        const {
          normalAttributes,
          normalAttributesValueMap,
          sellAttributes,
          sellAttributesValueMap
        } = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)

        this.data = {
          ...product,
          normalAttributesValueMap,
          sellAttributesValueMap
        }
        const context = await service.getContext()
        this.context = {
          ...context,
          state: {
            normalAttributes,
            sellAttributes
          }
        }
      }

      form.start()
    },
    render (h) {
      // TODO
      console.log('render:', this.data)
      return h('div', form.render(h, this.config))
    }
  }
</script>
