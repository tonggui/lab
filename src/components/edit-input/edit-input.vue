<template>
  <div class="edit-input">
    <edit
      v-on="$listeners"
      v-bind="$attrs"
      @on-edit="onEdit"
      :size="size"
      :border="false"
    >
      <template v-slot:editing="{ value, change, confirm }">
        <component :is="wrapperComponent" :unit="inputPrefix" class="input-wrapper">
          <component
            :is="inputComponent"
            ref="input"
            class="input"
            :value="value"
            @on-change="e => change(e.target.value)"
            type="text"
            @on-keyup.enter="confirm(value)"
            :size="size"
            v-bind="inputProps"
          >
            <template slot="suffix">
              <slot name="input-suffix" v-bind="{ confirm }"></slot>
            </template>
          </component>
        </component>
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
      },
      wrapperComponent () {
        return this.inputPrefix ? UnitNumber : 'span'
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
    .input-wrapper {
      display: inline-flex;
      align-items: center;
    }
  }
</style>
