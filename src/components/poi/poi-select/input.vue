<template>
  <div class="ids-input">
    <PoiInput v-model="poiIds" :placeholder="placeholder"/>
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

  // const max = 2000

  export default {
    name: 'IdsInput',
    components: {
      PoiInput
    },
    props: {
      fetchData: {
        type: Function,
        required: true
      },
      max: {
        type: Number,
        default: 2000
      }
    },
    data () {
      return {
        poiIds: [],
        loading: false
      }
    },
    computed: {
      placeholder () {
        return `请输入门店ID，多门店使用换行分隔，每次最多可添加${this.max}个门店ID`
      }
    },
    methods: {
      clear () {
        this.poiIds = []
      },
      async add () {
        if (this.poiIds.length) {
          try {
            this.loading = true
            const _set = new Set(this.poiIds) // 去重
            if (_set.size > this.max) {
              this.$Message.warning(`一次最多可添加${this.max}个门店ID`)
              return
            }
            const pois = await this.fetchData([..._set])
            // 清空已填写的门店信息
            this.poiIds = []
            this.$emit('on-select-pois', pois)
          } catch (e) {
            const error = (e && e.message) || e
            this.$Message.error(error)
          } finally {
            this.loading = false
          }
        } else {
          this.$Message.warning('请添加门店ID')
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
