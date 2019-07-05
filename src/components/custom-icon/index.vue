<template>
  <svg class="svg-icon" :style="{fontSize: `${size}px`}" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/will-be-removed-icons', false, /\.svg$/)
requireAll(req)
export default {
  name: 'icon-svg',
  props: {
    type: {
      type: String,
      required: true
    },
    size: [Number, String]
  },
  computed: {
    iconName () {
      return `#icon-${this.type}`
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
