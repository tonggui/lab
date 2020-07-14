<script>
  import createForm from './form'
  import service from './service'

  const form = createForm({}, service)

  export default {
    name: 'common-form',
    components: {
      ...form.components
    },
    props: {
      value: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {
      'value.category.id' () {
        this.getContext()
        this.getCategoryAttrs()
      },
      data () {
        this.$emit('input', this.data)
      },
      value: {
        immediate: true,
        handler (value) {
          if (value === this.data) {
            return
          }
          this.data = value
        }
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
    methods: {
      async getContext () {
        this.context = await service.getContext(this.data.category.id)
      },
      async getCategoryAttrs () {
        const categoryId = this.data.category.id
        let categoryAttrList = []
        let categoryAttrValueMap = {}
        try {
          if (categoryId) {
            categoryAttrList = await service.getCategoryAttrs(this.data.category.id)
            categoryAttrValueMap = categoryAttrList.reduce((prev, attr) => {
              prev[attr.id] = this.data.categoryAttrValueMap[attr.id]
              return prev
            }, {})
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.data = { ...this.data, categoryAttrList, categoryAttrValueMap }
        }
      }
    },
    async mounted () {
      if (this.spuId) {
        this.getContext()
      }

      form.start()
    },
    render (h) {
      return h('div', form.render(h, this.config))
    }
  }
</script>
