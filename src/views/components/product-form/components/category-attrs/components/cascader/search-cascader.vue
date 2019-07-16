<template>
  <WithSearch
    v-bind="$attrs"
    v-on="listeners"
    :value="val"
    :name="name"
    @change="handleChange"
  />
</template>

<script>
  import WithSearch from '@/components/cascader/with-search'
  import { isEmpty } from '@/common/utils'
  import { omit } from 'lodash'

  export default {
    name: 'CategoryAttributeSearchCascader',
    components: {
      WithSearch
    },
    props: {
      value: [Array, Object],
      multiple: Boolean,
      separator: {
        type: String,
        default: ' / '
      }
    },
    computed: {
      val () {
        if (this.multiple) {
          return this.value
        } else {
          const { idPath = [] } = this.value || {}
          return idPath
        }
      },
      name () {
        if (this.multiple) {
          return (this.value || []).map(i => i.namePath.join(this.separator))
        } else {
          const { namePath = [] } = this.value || {}
          return namePath.join(this.separator)
        }
      },
      listeners () {
        return omit(this.$listeners, ['change'])
      }
    },
    methods: {
      handleChange (value, name) {
        if (this.multiple) {
          this.$emit('change', value)
          return
        }
        if (isEmpty(value)) {
          this.$emit('change')
        } else {
          this.$emit('change', {
            idPath: value,
            namePath: name
          })
        }
      }
    }
  }
</script>
