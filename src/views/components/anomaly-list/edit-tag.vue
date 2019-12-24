<template>
  <div class="edit-tag">
    <Edit
      v-on="$listeners"
      v-bind="$attrs"
      @on-edit="onEdit"
      :size="size"
      :border="false"
    >
      <template v-slot:editing="{ value, change, confirm }">
        <Cascader
          :value="value"
          :data="data"
          trigger="hover"
          :size="size"
          @on-change="confirm(value)"
          v-bind="inputProps"
        />
      </template>
      <template v-slot:display="slotProps">
        <slot name="display" v-bind="slotProps"></slot>
      </template>
      <template slot="icon">
        <slot name="icon"></slot>
      </template>
    </Edit>
  </div>
</template>

<script>
  import Edit from '@/components/edit'

  export default {
    name: 'edit-tag',
    components: {
      Edit
    },
    props: {
      size: {
        type: String,
        validator (size) {
          return ['default', 'small', 'large'].includes(size)
        },
        default: 'default'
      },
      data: {
        type: Array,
        default: () => []
      },
      inputProps: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {}
    },
    methods: {
      onEdit (edit) {
        if (edit) {
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        }
      }
    },
    created () {}
  }
</script>

<style lang='less'>
.edit-tag {
  /deep/ .input input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
    &:focus {
      box-shadow: none;
    }
  }
  .input-wrapper {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }
}
</style>
