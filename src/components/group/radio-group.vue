<template>
  <div class="custom-radio-group">
    <template v-for="item in options">
      <slot
        v-bind:item="item"
        v-bind:disabled="disabled"
        v-bind:selected="isSelected(item)"
        v-bind:clickHandler="() => handleClickEvent(item)"
      />
    </template>
  </div>
</template>

<script>
  export default {
    name: 'RadioGroup',
    props: {
      value: [String, Number, Object],
      options: {
        type: Array,
        default: () => []
      },
      disabled: Boolean
    },
    methods: {
      isSelected (item) {
        return item === this.value
      },
      handleClickEvent (item) {
        if (!this.disabled) {
          if (!this.isSelected(item)) {
            this.triggerSelectedValue(item)
          }
        }
      },
      triggerSelectedValue (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  }
</script>
