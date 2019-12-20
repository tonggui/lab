<template>
  <div class="problem-section">
    <div class="header">
      <slot name="header" />
      <slot />
    </div>
  </div>
</template>

<style lang='less'>
@innerVerticalGap: 8px;
@innerHorizontalGap: 16px;
.problem-section {
  background-color: @component-bg;
  padding: @innerVerticalGap 0;
  .header {
    padding: @innerVerticalGap @innerHorizontalGap;
  }
}
</style>
