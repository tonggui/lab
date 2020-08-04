<template>
  <div class="fake-input" v-on="$listeners" :class="{ active }">
    <div class="fake-input-prepend" v-if="$slots.prepend">
      <slot name="prepend" />
    </div>
    <div class="fake-input-content">
      <slot>
        <div v-if="placeholder" class="fake-input-placeholder">{{ placeholder }}</div>
      </slot>
    </div>
    <div class="fake-input-append" v-if="$slots.append">
      <slot name="append" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FakeInput',
    props: {
      active: Boolean,
      placeholder: String
    }
  }
</script>

<style lang="less" scoped>
.fake-input {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 450px;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  color: @input-color;
  border: 1px solid @border-color-base;
  border-radius: @border-radius-base;
  cursor: pointer;
  background: transparent;
  overflow: hidden;

  &:hover {
    .hover();
  }

  &.active {
    .hover();
    .active();
  }

  &-content {
    flex: 1;
    strong {
      color:  @link-color;
      margin: 0 4px;
    }
    .fake-input-placeholder {
      color: @input-placeholder-color;
    }
  }
  &-prepend,
  &-append {}
}
</style>
