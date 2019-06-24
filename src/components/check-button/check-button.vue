<script>
export default {
  name: 'check-button',
  props: {
    checked: {
      type: Boolean,
      default: null
    },
    defaultChecked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      temp: '',
      checkedSelf: false
    }
  },
  computed: {
    type () {
      return this.checkedSelf ? 'primary' : 'default'
    }
  },
  watch: {
    checked: {
      immediate: true,
      handler (val) {
        this.checkedSelf = val
      }
    }
  },
  methods: {
    handleClickEvent () {
      console.log(this.checkedSelf)
      const newChecked = !this.checkedSelf
      if (!('checked' in this.$options.propsData)) {
        this.checkedSelf = newChecked
      }
      this.$emit('change', newChecked)
    }
  },
  render (h) {
    return h(
      'Button',
      {
        attrs: this.$attrs,
        props: {
          ...this.$options.propsData,
          type: this.type
        },
        on: {
          click: this.handleClickEvent
        }
      },
      this.$slots.default
    )
  }
}
</script>

<style scoped></style>
