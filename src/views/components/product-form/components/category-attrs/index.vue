<template>
  <div class="category-attrs-form">
    <slot name="attrs"></slot>
    <div v-if="allowApply">
      <small>想要填写的信息这里没有？<a @click="applyModalVisible = true">申请商品信息</a></small>
    </div>
    <Drawer
      title="申请商品信息"
      width="40%"
      v-model="applyModalVisible"
    >
      <CategroyAttrsApply />
    </Drawer>
  </div>
</template>

<script>
  import CategroyAttrsApply from './category-attrs-apply'

  export default {
    name: 'CategoryAttrsForm',
    components: { CategroyAttrsApply },
    props: {
      allowApply: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        applyModalVisible: false
      }
    }
  }
</script>

<style scoped lang="less">
  @column-mode-width: 300px;

  .category-attrs-form {
    /deep/ .column-mode {
      display: flex;
      flex-wrap: wrap;
      .form-item-layout {
        flex-basis: 36%;
        flex-shrink: 0;
        margin-right: 20px;

        .boo-input-wrapper
        , .boo-select {
          width: @column-mode-width;
        }
      }
    }
  }
</style>
