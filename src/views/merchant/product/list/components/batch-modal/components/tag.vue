<template>
  <Form>
    <FormItem v-if="typeSelectable" label="修改方式">
      <RadioGroup v-model="type">
        <Radio :label="TYPE.ADD">新增<Tooltip :width="250" content="保留商品当前所在分类，额外再新增一个或多个分类。要新增的分类请填写到“目标分类”中"><Icon local="question-circle" /></Tooltip></Radio>
        <Radio :label="TYPE.REPLACE">替换<Tooltip :width="250" content="不保留商品当前所在分类，给所选商品更新分类。要替换到哪个分类请填写到“目标分类”中"><Icon local="question-circle" /></Tooltip></Radio>
        <Radio :label="TYPE.DELETE">删除<Tooltip :width="250" content="移除商品当前所在分类。要移除的分类请填写到“目标分类”中。注：如果移除分类后商品无店内分类，则商品会自动放到“未分类”中"><Icon local="question-circle" /></Tooltip></Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="目标分类">
      <TagList
        @change="handleTagChange"
        :width="300"
        triggerMode="hover"
        placeholder="请选择分类"
        :source="tagList"
        :maxCount="maxCount"
      />
    </FormItem>
    <FormItem label="选择设置范围">
      <RadioGroup v-model="poiType">
        <Radio v-for="option in options" :label="option.value" :key="option.value">
          <span>{{ option.label }}</span>
        </Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>
<script>
  import {
    PRODUCT_TAG_COUNT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import TagList from '@components/taglist/tag-list-with-suggest'
  import { POI_SELECT_OPTIONS, defaultPoiType } from '../config'

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
        poiType: null
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
    computed: {
      ...mapModule({
        tagCount: PRODUCT_TAG_COUNT
      }),
      options () {
        return POI_SELECT_OPTIONS
      },
      TYPE () {
        return TYPE
      },
      typeSelectable () {
        return this.maxCount > 1
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
          error = '请选择修改方式'
        } else if (!tagIdList || tagIdList.length <= 0) {
          error = '请选择目标分类'
        } else if (!this.poiType) {
          error = '请选择设置范围'
        }
        this.$emit('submit', error, {
          type: this.typeSelectable ? type : TYPE.REPLACE,
          tagIdList,
          range: this.poiType
        })
      }
    }
  }
</script>
