<template>
  <Modal
    :value="value"
    :title="title"
    class-name="vertical-center-modal"
    @on-ok="handleSubmit"
    @on-cancel="$emit('on-cancel')"
  >
    <Form label-position="top">
      <FormItem class="manage-tag-modal-item" v-if="type === MODEL_TYPE.CREATE">
        <RadioGroup v-model="formInfo.level">
          <Radio :label="0" size="default">新建一级分类</Radio>
          <Radio :label="1" size="default">新建二级级分类</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showParentTag">
        <span slot="label" class="manage-tag-modal-label">归属一级分类</span>
        <Select v-model="formInfo.parentId" size="small" class="manage-tag-modal-select"></Select>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="[MODEL_TYPE.CREATE, MODEL_TYPE.TITLE, MODEL_TYPE.TOP_TIME].includes(type)">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.name" size="small" placeholder="四个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="isMedcinie">
        <span slot="label" class="manage-tag-modal-label">分类code</span>
        <Input v-model="formInfo.appTagCode" size="small" placeholder="" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="type === MODEL_TYPE.ADD_CHILD_TAG">
        <span slot="label" class="manage-tag-modal-label">一级分类</span>
        <span>{{ formInfo.name }}</span>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="type === MODEL_TYPE.ADD_CHILD_TAG">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.childName" size="small" placeholder="四个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showTopTime">
        <span slot="label" class="manage-tag-modal-label">
          限时置顶
          <small class="manage-tag-modal-helper">根据该品类的热销时段进行设置，有利于提高单量，促进转化</small>
        </span>
        <div>限时置顶组件</div>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { MODEL_TYPE } from './constants'
import {
  POI_IS_MEDICINE
} from '@/common/cmm'
import withModules from '@/mixins/withModules'
import {
  fetchSubmitAddTag,
  fetchSubmitChangeTagLevel
} from '@/data/repos/category'

export default {
  name: 'manage-tag-modal',
  mixins: [withModules({ isMedcinie: POI_IS_MEDICINE })],
  props: {
    type: [Number, String],
    value: Boolean,
    item: Object
  },
  data () {
    const formInfo = this.getFormInfo(this.item, this.type)
    return {
      formInfo
    }
  },
  watch: {
    item (newValue) {
      this.formInfo = this.getFormInfo(newValue, this.type)
    },
    type (newValue) {
      this.formInfo = this.getFormInfo(this.item, newValue)
    }
  },
  computed: {
    MODEL_TYPE () {
      return MODEL_TYPE
    },
    title () {
      let title = ''
      switch (this.type) {
        case MODEL_TYPE.CREATE:
          title = '新增分类'
          break
        case MODEL_TYPE.TITLE:
          title = '修改名称'
          break
        case MODEL_TYPE.TOP_TIME:
          title = '修改限时置顶'
          break
        case MODEL_TYPE.SET_CHILD_TAG:
          title = '设为二级分类'
          break
        case MODEL_TYPE.ADD_CHILD_TAG:
          title = '新增二级分类'
          break
        case MODEL_TYPE.DELETE:
          title = `确定删除${this.item.name}吗`
          break
      }
      return title
    },
    showParentTag () {
      if (this.type === MODEL_TYPE.CREATE) {
        return this.formInfo.level === 1
      }
      return this.type === MODEL_TYPE.SET_CHILD_TAG
    },
    showTopTime () {
      if (this.isMedcinie) {
        return false
      }
      if ([MODEL_TYPE.TITLE, MODEL_TYPE.TOP_TIME].includes(this.type)) {
        return this.item && this.item.level === 0
      }
      return this.type === MODEL_TYPE.CREATE && this.formInfo.level === 0
    }
  },
  methods: {
    getFormInfo (item, type) {
      item = item || {}
      let level = item.level
      if (type === MODEL_TYPE.CREATE) {
        level = 0
      } else if (type === MODEL_TYPE.SET_CHILD_TAG) {
        level = 1
      } else if (type === MODEL_TYPE.ADD_CHILD_TAG) {
        level = 1
      }
      return {
        name: item.name, // 分类名称
        level, // 新建分类类别
        parentId: undefined, // 设置为二级分类 父分类id
        timeZone: item.timeZone, // 分时置顶
        appTagCode: item.appTagCode, // 药品的appcode
        childName: '' // 新增的二级分类名称
      }
    },
    async handleSubmit () {
      try {
        let tagInfo = {
          name: this.formInfo.name,
          id: this.item.id,
          level: this.formInfo.level,
          parentId: this.formInfo.parentId || this.item.parentId,
          appTagCode: this.formInfo.appTagCode,
          timeZone: this.formInfo.timeZone
        }
        if (this.type === MODEL_TYPE.ADD_CHILD_TAG) {
          tagInfo.name = this.formInfo.childName
        }
        if ([MODEL_TYPE.CREATE, MODEL_TYPE.ADD_CHILD_TAG].includes(this.type)) {
          tagInfo.id = ''
        }
        if (this.type === MODEL_TYPE.ADD_CHILD_TAG) {
          tagInfo.parentId = this.item.id
        }

        if (this.type === MODEL_TYPE.DELETE) {
        } else if (this.type === MODEL_TYPE.SET_CHILD_TAG) {
          await fetchSubmitChangeTagLevel(tagInfo.id, tagInfo.parentId)
        } else {
          await fetchSubmitAddTag(tagInfo)
        }
        this.$emit('on-ok', tagInfo)
      } catch (err) {
        this.$Message.error(err.message || err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .manage-tag-modal {
   &-label {
     font-weight: bold;
   }
   &-helper {
     font-weight: normal;
     color: @text-helper-color;
     margin-left: 6px;
   }
   &-item {
     margin-bottom: 16px;
   }
   &-input, &-select {
     font-size: @font-size-small;
   }
 }
</style>
