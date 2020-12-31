<template>
  <div>
    <Input @on-change="handleChange">
      <span v-if="type==='MOD_PRICE'" slot="prefix">¥</span>
    </Input>
  </div>
</template>
<script>
  export default {
    name: 'product-modify-modal',
    props: {
      // value: {
      //   type: Number,
      //   default: 0
      // },
      type: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // inputValue: ''
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
        this.$emit('change', e.target.value)
      }
    },
    mounted () {
      // this.inputValue = this.value
    }
  }
</script>
