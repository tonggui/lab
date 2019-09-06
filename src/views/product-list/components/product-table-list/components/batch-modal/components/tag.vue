<template>
  <Form>
    <FormItem v-if="typeSelectable" label="修改方式">
      <RadioGroup v-model="type">
        <Radio :label="TYPE.ADD">新增</Radio>
        <Radio :label="TYPE.REPLACE">替换</Radio>
        <Radio :label="TYPE.DELETE">删除</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="目标分类" v-model="tagIdList">
      <TagList
        :width="300"
        triggerMode="hover"
        placeholder="请选择分类"
        :source="tagList"
        :maxCount="tagCount"
      />
    </FormItem>
  </Form>
</template>
<script>
  import {
    POI_IS_MEDICINE,
    PRODUCT_TAG_COUNT
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import TagList from '@components/taglist'

  const TYPE = {
    ADD: 1,
    REPLACE: 2,
    DELETE: 3
  }
  export default {
    name: 'product-batch-modify-tag',
    mixins: [withModules({
      isMedicine: POI_IS_MEDICINE,
      tagCount: PRODUCT_TAG_COUNT
    })],
    props: {
      tagList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        type: undefined,
        tagIdList: []
      }
    },
    computed: {
      TYPE () {
        return TYPE
      },
      typeSelectable () {
        return this.isMedicine || this.tagCount > 1
      }
    },
    components: {
      TagList
    },
    methods: {
      submit () {
        const { type, tagIdList } = this
        let error
        if (!type && this.typeSelectable) {
          error = '请选择操作类型'
        } else if (!tagIdList || tagIdList.length <= 0) {
          error = '请选择分类'
        }
        this.$emit('submit', error, {
          type: this.typeSelectable ? type : TYPE.REPLACE,
          tagIdList
        })
      }
    }
  }
</script>
