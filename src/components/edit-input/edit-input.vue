<template>
  <div class="edit-input">
    <edit
      v-on="$listeners"
      v-bind="$attrs"
      @on-edit="onEdit"
      :size="size"
      :border="false"
    >
      <template v-slot:editing="slotProps">
        <UnitNumber :unit="inputPrefix">
          <component
            :is="inputComponent"
            ref="input"
            class="input"
            :value="slotProps.value"
            @input="e => slotProps.change(e.target.value)"
            type="text"
            @keyup.enter="slotProps.confirm"
            :size="size"
            v-bind="inputProps"
          />
        </UnitNumber>
      </template>
      <template v-slot:display="slotProps">
        <slot name="display" v-bind="slotProps"></slot>
      </template>
      <template slot="icon">
        <slot name="icon"></slot>
      </template>
    </edit>
  </div>
</template>

<script>
  import Edit from '../edit/index'
  import UnitNumber from '@components/unit-number'

  export default {
    name: 'edit-input',
    props: {
      size: {
        type: String,
        validator (size) {
          return ['default', 'small', 'large'].includes(size)
        },
        default: 'default'
      },
      input: {
        type: String,
        default: 'Input'
      },
      inputProps: {
        type: Object,
        default: () => ({})
      },
      inputPrefix: String
    },
    computed: {
      inputComponent () {
        return this.input
      }
    },
    components: { Edit, UnitNumber },
    methods: {
      onEdit (edit) {
        if (edit) {
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .edit-input {
    /deep/ .input input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      &:focus {
        box-shadow: none;
      }
    }
  }
</style>
