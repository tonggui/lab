<template>
  <Link :to="to" :tag="tag" @click="handleClickEvent" :before-leave="beforeLeave">
    <!--  eslint-disable-next-line vue/valid-template-root -->
    <slot />
  </Link>
</template>

<script>
import { isPageName } from '@sgfe/eproduct/navigator/pages/page'
import Link from './link'

export default {
  name: 'named-link',
  components: {
    Link
  },
  props: {
    name: {
      type: String,
      validator: val => isPageName(val)
    },
    search: String,
    query: Object,
    state: Object,
    beforeLeave: Function,
    tag: String
  },
  computed: {
    to () {
      if (this.name) {
        return {
          name: this.name,
          search: this.search,
          query: this.query,
          state: this.state
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    handleClickEvent (e) {
      this.$emit('click', e)

      // 如果name为空，不进行跳转处理
      if (!this.name) {
        e.preventDefault()
      }
    }
  }
}
</script>
