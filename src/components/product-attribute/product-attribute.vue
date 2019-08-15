<template>
  <div class="attr">
    <Input class="name" v-model="value.name" @on-change="handleNameChanged($event.target.value)"/>
    <div class="values-container">
      <Input
        v-for="(val, idx) in values"
        :key="idx"
        :value="val"
        @on-change="handleValueChanged(idx, $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProductAttribute',
    props: {
      value: {
        type: Object,
        default: () => ({
          name: '',
          value: []
        })
      },
      count: Number
    },
    computed: {
      values () {
        const arr = new Array(this.count).fill('')
        const { value = [] } = this.value
        arr.forEach((item, idx) => {
          const val = value[idx]
          if (val !== undefined) {
            arr[idx] = val
          }
        })
        return arr
      }
    },
    methods: {
      handleNameChanged (name) {
        const { value } = this.value
        this.triggerValueChanged({
          name,
          value
        })
      },
      handleValueChanged (idx, val) {
        const { name, value = [] } = this.value
        const newValue = [].concat(value)
        newValue[idx] = val
        this.triggerValueChanged({
          name,
          value: newValue
        })
      },
      triggerValueChanged (value) {
        this.$emit('input', value)
        this.$emit('on-change', value)
      }
    }
  }
</script>

<style scoped lang="less">
  .attr {
    display: flex;
    .name {
      flex: 2;
      min-width: 100px;
      max-width: 200px;
      margin: 5px;
    }

    .values-container {
      margin-left: 20px;
      flex: 5;
      max-width: 650px;

      > .boo-input-wrapper {
        width: 20%;
        min-width: 60px;
        max-width: 120px;
        margin: 5px;
      }
    }
  }
</style>
