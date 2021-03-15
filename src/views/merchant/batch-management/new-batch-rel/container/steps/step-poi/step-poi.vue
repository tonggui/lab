<template>
  <div>
    <Row>
      <Col span="4">
        选择关联门店
      </Col>
      <Col span="20">
        <RadioGroup v-model="poiType">
          <Radio label="all">
            <span>全部门店</span>
          </Radio>
          <Radio label="parts">
            <span>指定门店</span>
          </Radio>
        </RadioGroup>
      </Col>
      <Col span="4">
        目标门店
      </Col>
      <Col span="20">
        <PoiSelect v-model="list" />
      </Col>
    </Row>
  </div>
</template>

<script>
  import PoiSelect from '../../../components/poi-select'
  export default {
    name: 'step-poi',
    props: {
      poiSelect: String,
      poiIdList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
      }
    },
    computed: {
      poiType: {
        get () {
          return this.poiSelect
        },
        set (data) {
          this.$emit('data-change', 'poiSelect', data)
        }
      },
      list: {
        get () {
          return this.poiIdList
        },
        set (list) {
          this.$emit('data-change', 'poiIdList', list)
        }
      }
    },
    components: {
      PoiSelect
    }
  }
</script>

<style scoped>

</style>
