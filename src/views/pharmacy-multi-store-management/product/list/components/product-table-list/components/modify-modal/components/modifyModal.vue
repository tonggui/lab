<template>
  <div>
    <Input :value="value" @on-change="handleChange">
      <span v-if="type==='MOD_PRICE'" slot="prefix">¥</span>
    </Input>
  </div>
</template>
<script>
  export default {
    name: 'product-modify-modal',
    props: {
      value: Number,
      type: String
    },
    data () {
      return {
        inputValue: ''
      }
    },
    watch: {
      // inputValue (newValue, oldValue) {
      //   console.log(newValue, oldValue)
      // }
    },
    computed: {

    },
    methods: {
      handleChange (e) {
        console.log(e.target.value)
        this.$emit('onChange', e.target.value)
      }
    },
    mounted () {
      // this.inputValue = this.value
    }
  }
</script>
