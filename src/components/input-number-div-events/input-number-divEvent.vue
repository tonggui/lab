<template>
  <div
    id="div1" tabindex="0" @mouseleave="asideBlur()" @focus="$emit('on-div-focus')" outline=0
    hidefocus="true" style="outline:none">
    <InputNumber
      v-bind="$attrs"
      :value="value"
      :precision="precision"
      :disabled="disabled"
      @on-change="$emit('on-change') "
      class="input"
      @on-focus="$emit('on-focus')"
      @on-blur="$emit('on-blur')"
      @input="handleInput"
      :min="min"
      :max="max"
    />
  </div>
</template>

<script>
  export default {
    name: 'input-number-divEvent',
    props: {
      value: Number,
      disabled: Boolean,
      min: [Object, Number],
      max: [Object, Number],
      precision: Number
    },
    computed: {
    },
    methods: {
      handleInput (v) {
        this.$emit('on-change', v)
        this.$emit('input', v)
      },
      asideBlur () {
        document.getElementById('div1').blur()
        this.$emit('on-div-blur')
      }
    }
  }
</script>

<style scoped>

</style>
