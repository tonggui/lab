<template>
  <div class="edit-input">
    <edit
      v-on="$listeners"
      v-bind="$attrs"
      @on-edit="onEdit"
    >
      <template v-slot:editing="slotProps">
        <input
          ref="input"
          :value="slotProps.value"
          @input="e => slotProps.change(e.target.value)"
          class="input"
          type="text"
          @keyup.enter="slotProps.confirm"
        >
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

  export default {
    name: 'edit-input',
    components: { Edit },
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

<style lang="less">
  .edit-input {
    display: inline-block;
    max-width: 100%;
    .input {
      outline: 0;
      box-shadow: none;
      border-radius: inherit;
      border: none;
      width: 100%;
      height: 100%;
      padding: 8px 10px;
    }
  }
</style>
