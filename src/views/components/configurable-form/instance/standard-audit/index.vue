<script>
  import createForm from './form'
  import service from './service'

  const form = createForm({}, service)

  export default {
    name: 'standard-audit-form',
    components: {
      ...form.components
    },
    props: {
      disabled: Boolean,
      value: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {
      'value.category.id' () {
        this.getCategoryAttrs()
      },
      disabled: {
        immediate: true,
        handler (disabled) {
          this.context = { ...this.context, disabled }
        }
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
      },
      renderFooter (h) {
        // return h(StickyFooter, {
        //   props: {
        //     gap: 10,
        //     btnTexts:
        //   }
        // })
      }
    },
    mounted () {
      form.start()
    },
    render (h) {
      return h('div', [form.render(h, this.config), this.renderFooter(h)])
    }
  }
</script>
