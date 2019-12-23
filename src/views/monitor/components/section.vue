<template>
  <div class="problem-section">
    <div class="problem-section-header">
      <slot name="header" />
    </div>

    <div class="problem-section-body">
      <slot />
    </div>
  </div>
</template>

<style lang='less'>
@innerVerticalGap: 8px;
@innerHorizontalGap: 16px;
.problem-section {
  padding: @innerVerticalGap 0;
  background-color: @component-bg;
  .problem-section-header {
    padding: @innerVerticalGap @innerHorizontalGap;
  }
  .problem-section-body {
    padding: @innerVerticalGap @innerHorizontalGap;
  }
}
</style>
