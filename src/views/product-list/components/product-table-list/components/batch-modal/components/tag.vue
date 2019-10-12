<template>
  <Form>
    <FormItem v-if="typeSelectable" label="修改方式">
      <RadioGroup v-model="type">
        <Radio :label="TYPE.ADD">新增</Radio>
        <Radio :label="TYPE.REPLACE">替换</Radio>
        <Radio :label="TYPE.DELETE">删除</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="目标分类">
      <TagList
        @change="handleTagChange"
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
    PRODUCT_TAG_COUNT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import TagList from '@components/taglist'

  const TYPE = {
    ADD: 1,
    REPLACE: 2,
    DELETE: 3
  }
  export default {
    name: 'product-batch-modify-tag',
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
      ...mapModule({
        tagCount: PRODUCT_TAG_COUNT
      }),
      TYPE () {
        return TYPE
      },
      typeSelectable () {
        return this.tagCount > 1
      }
    },
    components: {
      TagList
    },
    methods: {
      handleTagChange (tagList) {
        this.tagIdList = tagList.map(tag => tag.id)
      },
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
