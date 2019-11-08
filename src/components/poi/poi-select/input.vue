<template>
  <div class="ids-input">
    <PoiInput v-model="poiIds"/>
    <Button
      class="ids-input-add"
      :loading="loading"
      type="primary"
      @click="add"
    >添加</Button>
  </div>
</template>

<script>
  import PoiInput from '../poi-input'
  export default {
    name: 'IdsInput',
    components: {
      PoiInput
    },
    props: {
      fetchData: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        poiIds: [],
        loading: false
      }
    },
    methods: {
      clear () {
        this.poiIds = []
      },
      async add () {
        let error
        if (this.poiIds.length) {
          try {
            this.loading = true
            const _set = new Set(this.poiIds) // 去重
            const pois = await this.fetchData([..._set])
            // 清空已填写的门店信息
            this.poiIds = []
            this.$emit('on-select-pois', pois)
          } catch (e) {
            error = (e && e.message) || e
          } finally {
            this.loading = false
          }
        } else {
          error = '请添加门店ID'
        }

        if (error) {
          this.$Message.error(error)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .ids-input {
    display: flex;
    height: 100%;
    flex-direction: column;
    background: @component-bg;

    /deep/ .poi-input {
      flex: 1;

      > textarea {
        padding: 0;
        border: none;
        resize: none;
      }
    }

    .ids-input-add {
      width: 100px;
      display: inline-block;
      align-self: flex-end;
      margin-top: 12px;
    }
  }
</style>
