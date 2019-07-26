<template>
  <Modal
    :value="value"
    :title="title"
    :hide-footer="true"
    :mask-closable="false"
    :width="600"
    class-name="vertical-center-modal manage-tag-modal"
    @on-cancel="handleCancel"
  >
    <Alert class="manage-tag-modal-error" type="error" showIcon v-show="error">
      <Icon slot="icon" type="error" size="16" />
      {{ error }}
    </Alert>
    <Form :label-position="labelPosition" class="manage-tag-modal-form">
      <FormItem class="manage-tag-modal-item" v-if="type === TYPE.CREATE">
        <RadioGroup v-model="formInfo.level">
          <Radio :label="0">新建一级分类</Radio>
          <Radio :label="1">新建二级级分类</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showParentTag">
        <span slot="label" class="manage-tag-modal-label">归属一级分类</span>
        <Select v-model="formInfo.parentId" size="small" class="manage-tag-modal-select">
          <template v-for="tag in tagList">
            <Option
              v-if="tag.id !== item.id && !tag.isUnCategorized"
              :value="tag.id"
              :key="tag.id"
              :disabled="tag.isLeaf && tag.productCount > 0"
            >
              {{ tag.name }}
            </Option>
          </template>
        </Select>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="[TYPE.CREATE, TYPE.TITLE, TYPE.TOP_TIME].includes(type)">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.name" placeholder="4个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="isMedcinie">
        <span slot="label" class="manage-tag-modal-label">分类code</span>
        <Input v-model="formInfo.appTagCode" size="small" placeholder="" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="type === TYPE.ADD_CHILD_TAG">
        <span slot="label" class="manage-tag-modal-label">一级分类</span>
        <span class="manage-tag-modal-parent-name">{{ formInfo.name }}</span>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="type === TYPE.ADD_CHILD_TAG">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.childName" size="small" placeholder="四个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showTopTime">
        <span slot="label" class="manage-tag-modal-label">
          限时置顶
          <small class="manage-tag-modal-helper">根据该品类的热销时段进行设置，有利于提高单量，促进转化</small>
        </span>
        <TopTime class="manage-tag-modal-top-time" :status="formInfo.topFlag" :value="formInfo.timeZone" @change="handleTopTimeChange" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="type === TYPE.DELETE">
        <RadioGroup v-model="formInfo.deleteType" vertical>
          <Radio :label="DELETE_TYPE.PRODUCT">
            <span v-if="!item.isLeaf">删除分类中的商品及二级分类</span>
            <span v-else>同时删除分类中的商品</span>
          </Radio>
          <Radio :label="DELETE_TYPE.TAG">
            <span>仅删除分类，商品将全部移入“未分类”中</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="manage-tag-modal-footer" slot="footer">
      <Button @click="handleCancel">取消</Button>
      <Button @click="handleSubmit" type="primary">确定</Button>
    </div>
  </Modal>
</template>
<script>
  import { isEmpty } from 'lodash'
  import TopTime from '@components/sell-time'
  import {
    TAG_OPERATION_TYPE as TYPE,
    TAG_DELETE_TYPE as DELETE_TYPE
  } from '@/data/enums/category'
  import {
    POI_IS_MEDICINE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import {
    initTag, createSubTag
  } from '@/data/helper/category/operation'
  import {
    defaultTagId
  } from '@/data/constants/poi'

  export default {
    name: 'manage-tag-modal',
    mixins: [withModules({ isMedcinie: POI_IS_MEDICINE })],
    props: {
      type: [Number, String],
      value: Boolean,
      item: {
        type: Object,
        default: () => ({
          ...initTag
        })
      },
      tagList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      const formInfo = this.getFormInfo(this.item, this.type)
      return {
        formInfo,
        error: ''
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
      labelPosition () {
        let position = 'left'
        if ([TYPE.CREATE, TYPE.TOP_TIME].includes(this.type)) {
          position = 'top'
        } else if (this.type === TYPE.TITLE && this.formInfo.level === 0) {
          position = 'top'
        }
        return position
      },
      TYPE () {
        return TYPE
      },
      DELETE_TYPE () {
        return DELETE_TYPE
      },
      title () {
        const name = (this.item || {}).name
        const map = {
          [TYPE.CREATE]: '新增分类',
          [TYPE.TITLE]: '修改名称',
          [TYPE.TOP_TIME]: '修改限时置顶',
          [TYPE.SET_CHILD_TAG]: '设为二级分类',
          [TYPE.ADD_CHILD_TAG]: '新增二级分类',
          [TYPE.DELETE]: `确定删除 ${name} 吗`
        }
        return map[this.type] || ''
      },
      showParentTag () {
        /**
         * 1. 创建分类 -> 创建二级分类
         * 2. 设置为二级分类
         * 以上两种情况才会展示 归属一级分类
         */
        if (this.type === TYPE.CREATE) {
          return this.formInfo.level === 1
        }
        return this.type === TYPE.SET_CHILD_TAG
      },
      showTopTime () {
        /**
         * 1. 非药品
         * 2. 一级分类的修改 名称/限时置顶
         * 3. 创建分类 -> 创建一级分类
         */
        if (this.isMedcinie) {
          return false
        }
        if ([TYPE.TITLE, TYPE.TOP_TIME].includes(this.type)) {
          return this.item && this.item.level === 0
        }
        return this.type === TYPE.CREATE && this.formInfo.level === 0
      }
    },
    components: {
      TopTime
    },
    methods: {
      getFormInfo (item, type) {
        return {
          name: item.name, // 分类名称
          level: item.level, // 新建分类类别
          parentId: undefined, // 设置为二级分类 父分类id
          timeZone: item.timeZone, // 分时置顶
          appTagCode: item.appTagCode, // 药品的appcode
          childName: '', // 新增的二级分类名称
          topFlag: item.topFlag, // 限时置顶
          deleteType: DELETE_TYPE.PRODUCT
        }
      },
      filterTimeZone (timeZone) {
        let { timeList } = timeZone
        timeList = timeList.filter(time => !isEmpty(time))
        return {
          ...timeZone,
          timeList
        }
      },
      validator () {
        if (this.type === TYPE.CREATE && !this.formInfo.parentId) {
          this.error = '请选择归属的一级分类'
        }
        if (!this.formInfo.name) {
          this.error = '分类名称不能为空'
          return true
        }
        if (this.formInfo.topFlag) {
          const { timeZone } = this.formInfo
          if (!timeZone || !timeZone.timeList || timeZone.timeList.every(i => isEmpty(i))) {
            this.error = '请至少选择一个时间段'
            return true
          }
          if (timeZone && timeZone.days && timeZone.days.length <= 0) {
            this.error = '请至少选择一个日子'
            return true
          }
        }
        if (this.type === TYPE.ADD_CHILD_TAG && !this.formInfo.childName) {
          this.error = '分类名称不能为空'
          return true
        }
        if (this.type === TYPE.SET_CHILD_TAG && !this.formInfo.parentId) {
          this.error = '请选择归属的一级分类'
          return true
        }
        this.error = ''
        return false
      },
      handleTopTimeChange (topFlag, timeZone) {
        this.formInfo.topFlag = topFlag
        if (topFlag) {
          this.formInfo.timeZone = timeZone
        } else {
          this.formInfo.timeZone = undefined
        }
      },
      handleSubmit () {
        try {
          if (this.validator()) {
            this.$Message.error(this.error)
            return
          }
          let tagInfo = {
            ...this.item,
            name: this.formInfo.name,
            level: this.formInfo.level,
            parentId: this.formInfo.parentId || this.item.parentId || defaultTagId,
            appTagCode: this.formInfo.appTagCode,
            topFlag: this.formInfo.topFlag,
            timeZone: this.formInfo.topFlag ? this.filterTimeZone(this.formInfo.timeZone) : {}
          }
          if (this.type === TYPE.SET_CHILD_TAG) {
            tagInfo.level = 1
            tagInfo.topFlag = false
            tagInfo.timeZone = undefined
          }
          if (this.type === TYPE.ADD_CHILD_TAG) {
            const tag = createSubTag(this.item)
            tagInfo = { ...tag, name: this.formInfo.childName }
          }
          console.log('handleSubmit', tagInfo)
          this.$emit('on-ok', tagInfo, this.formInfo.deleteType)
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      },
      handleCancel () {
        this.error = ''
        this.$emit('on-cancel')
      }
    }
  }
</script>
<style lang="less">
 .manage-tag-modal {
   &-error {
     font-size: @font-size-base;
     color: rgba(0,0,0,0.65);
     padding-bottom: 10px;
   }
   &-form {
     padding-top: 10px;
   }
   &-label {
     font-weight: bold;
     font-size: @font-size-base;
   }
   &-helper {
     font-size: @font-size-small;
     font-weight: normal;
     color: @text-helper-color;
     margin-left: 6px;
   }
   &-item:not(:last-child) {
     margin-bottom: 30px;
   }
   &-input, &-select {
     font-size: @font-size-small;
     width: 300px;
   }
 }
</style>
