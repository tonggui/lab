<script>
  import { cloneElement } from '@/common/vnode'

  export default {
    name: 'custom-form',
    props: {
      value: Object,
      defaultValue: {
        type: Object,
        default: () => ({})
      },
      context: {
        type: Object,
        default: () => ({})
      },
      config: {
        type: Array,
        required: true
      }
    },
    data () {
      const initValue = this.value || this.defaultValue
      return {
        selfValue: { ...initValue }
      }
    },
    watch: {
      value (value) {
        this.selfValue = { ...(value || {}) }
      }
    },
    methods: {
      handleChange (key, value) {
        if (value instanceof Event) {
          value = value.target.value
        }
        if (key in this.value) {
          this.selfValue[key] = value
        } else {
          this.$set(this.selfValue, key, value)
        }
        this.$emit('change', this.selfValue)
        this.$emit('input', this.selfValue)
      }
    },
    render (h) {
      return (
        <Form attrs={{ model: this.selfValue }}>
          {
            this.config.map(({ label, render, key, rules }) => {
              let children = render(h, { data: this.selfValue, context: this.context, value: this.selfValue[key] })
              if (key) {
                const handleChange = (value) => this.handleChange(key, value)
                children = cloneElement(children, {
                  props: {
                    value: this.selfValue[key]
                  },
                  on: {
                    change: handleChange,
                    input: handleChange,
                    'on-change': handleChange
                  }
                })
                return <FormItem key={key} attrs={{ prop: key, rules: rules, label: label }}>{ children }</FormItem>
              }
              return children
            })
          }
        </Form>
      )
    }
  }
</script>
