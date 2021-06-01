<template>
  <Form>
    <FormItem label="选择删除范围">
      <RadioGroup v-model="poiType">
        <Radio v-for="option in options" :label="option.value" :key="option.value">
          <span>{{ option.label }}</span>
        </Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>
<script>
  import { defaultPoiType, MERCHANT_OPTIONS } from '../config'

  const TYPE = {
    ADD: 1,
    REPLACE: 2,
    DELETE: 3
  }
  export default {
    name: 'product-batch-modify-tag',
    props: {
      range: {
        type: Number,
        default: defaultPoiType
      },
      tagList: {
        type: Array,
        required: true
      },
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data () {
      return {
        type: undefined,
        tagIdList: [],
        poiType: undefined
      }
    },
    computed: {
      options () {
        return MERCHANT_OPTIONS
      },
      TYPE () {
        return TYPE
      }
    },
    watch: {
      range: {
        immediate: true,
        handler (val) {
          if (val) this.poiType = val
        }
      }
    },
    methods: {
      submit () {
        let error
        if (this.poiType === undefined) {
          error = '请选择删除范围'
        }
        this.$emit('submit', error, {
          range: this.poiType
        })
      }
    }
  }
</script>
