<template>
  <div class="switch-card">
    <div class="switch-card-content">
      <div>
        <p class="switch-card-title">{{ title }}</p>
        <small class="switch-card-description">
          <slot name="description">{{ description }}</slot>
        </small>
      </div>
      <iSwitch v-if="showSwitch" :value="status" @on-change="handleStatus" :loading="submitting" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'switch-card',
    props: {
      showSwitch: Boolean,
      title: {
        type: String,
        required: true
      },
      description: String,
      status: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return { submitting: false }
    },
    methods: {
      handleStatus (status) {
        this.submitting = true
        this.$emit('change-status', status, () => {
          this.submitting = false
        })
      }
    }
  }
</script>
<style lang="less">
  .switch-card {
    text-align: left;
    padding: 10px 32px 20px 32px;
    background: @component-bg;
    box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.30);
    margin-bottom: 20px;
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
    }
    &-title {
      font-size: 18px;
      line-height: 38px;
    }
    &-description {
      font-size: @font-size-small;
      color: @text-tip-color;
      line-height: 26px;
    }
  }
</style>
