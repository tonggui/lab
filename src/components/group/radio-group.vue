<template>
  <div class="custom-radio-group">
    <template v-for="(item, idx) in options">
      <slot
        v-bind:item="item"
        v-bind:disabled="disabled"
        v-bind:selected="isSelected(item)"
        v-bind:clickHandler="() => handleClickEvent(item)"
      >
        <span :key="idx" @click="() => handleClickEvent(item)">
          <Radio
            :value="isSelected(item)"
            :disabled="disabled"
            :name="name"
            :label="formatter(item).label"
          />
        </span>
      </slot>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'CustomRadioGroup',
    props: {
      value: [String, Number, Object],
      options: {
        type: Array,
        default: () => []
      },
      name: {
        type: String,
        default: () => `CustomRadioGroup_Random_${Date.now()}`
      },
      disabled: Boolean,
      formatter: {
        type: Function,
        default: item => ({
          value: `${item}`,
          label: `${item}`
        })
      }
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
