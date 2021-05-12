<template>
  <Modal
    :value="value"
    :title="title"
    :width="width"
    :mask-closable="false"
    :loading="loading"
    class-name="vertical-center-modal manage-tag-modal"
    @on-cancel="handleCancel"
    @on-ok="handleSubmit"
  >
    <Alert class="manage-tag-modal-error" type="error" showIcon v-show="!!error">
      <Icon slot="icon" type="error" size="16" />
      {{ error }}
    </Alert>
    <Form :label-position="labelPosition" class="manage-tag-modal-form" @on-submit.prevent.stop>
      <FormItem class="manage-tag-modal-item" v-if="showTagLevel" :label-width="labelWidth">
        <RadioGroup v-model="formInfo.level">
          <Radio :label="0">新建一级分类</Radio>
          <Radio :label="1">新建二级分类</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showTagName" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.name" :maxlength="8" placeholder="4个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showParentSelct" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">归属一级分类</span>
        <Select v-model="formInfo.parentId" class="manage-tag-modal-select">
          <template v-for="tag in tagList">
            <Option
              v-if="tag.id !== item.id && !tag.isUnCategorized"
              :value="tag.id"
              :key="tag.id"
              :disabled="tag.isLeaf && tag.productCount > 0"
              :support-top-time="supportTopTime"
            >
              {{ tag.name }}
            </Option>
          </template>
        </Select>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showParentTag" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">一级分类</span>
        <span class="manage-tag-modal-parent-name">
          {{ item.name }}
        </span>
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showSubTagName" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">分类名称</span>
        <Input v-model="formInfo.childName" :maxlength="8" placeholder="4个字以内展示最佳" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showAppCode" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">分类code</span>
        <Input v-model="formInfo.appTagCode" placeholder="" class="manage-tag-modal-input" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showTopTime" :label-width="labelWidth">
        <span slot="label" class="manage-tag-modal-label">
          限时置顶
          <small class="manage-tag-modal-helper">根据该品类的热销时段进行设置，有利于提高单量，促进转化</small>
        </span>
        <TopTime ref="topTime" :transition-name="topTimeTransitionName" class="manage-tag-modal-top-time" :status="formInfo.topFlag" :value="formInfo.timeZone" @change="handleTopTimeChange" />
      </FormItem>
      <FormItem class="manage-tag-modal-item" v-if="showDelete">
        <RadioGroup v-model="formInfo.deleteType" vertical>
          <Radio :label="DELETE_TYPE.PRODUCT">
            <template v-if="isMerchant">
              <span>同时删除分类中的商品（总部+分店商品都删除）</span>
            </template>
            <template v-else>
              <span v-if="!item.isLeaf">删除分类中的商品及二级分类</span>
              <span v-else>同时删除分类中的商品</span>
            </template>
          </Radio>
          <Radio :label="DELETE_TYPE.MERCHAHT_TAG" v-if="isMerchant">
            <span>同时删除分类中的商品（仅删总部商品)</span>
          </Radio>
          <Radio :label="DELETE_TYPE.TAG">
            <span>仅删除分类，商品将全部移入“未分类”中</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
  import { validate } from '@sgfe/product-validate'
  import { isEmpty } from 'lodash'
  import TopTime from '@components/sell-time'
  import {
    TAG_OPERATION_TYPE as TYPE,
    TAG_DELETE_TYPE as DELETE_TYPE
  } from '@/data/enums/category'

  export default {
    name: 'manage-tag-modal',
    props: {
      isMerchant: Boolean,
      loading: Boolean,
      type: [Number, String],
      value: Boolean,
      item: {
        type: Object,
        default: () => ({})
      },
      tagList: {
        type: Array,
        default: () => []
      },
      supportAppCode: Boolean,
      supportTopTime: Boolean
    },
    data () {
      const formInfo = this.getFormInfo(this.item, this.type)
      return {
        formInfo,
        error: '',
        topTimeTransitionName: ''
      }
    },
    watch: {
      value (visible) {
        if (visible) {
          this.formInfo = this.getFormInfo(this.item, this.type)
          this.$nextTick(() => {
            this.topTimeTransitionName = 'list-vertical-animation'
          })
        } else {
          this.topTimeTransitionName = ''
        }
      }
    },
    computed: {
      showAppCode () {
        return this.supportAppCode && [TYPE.CREATE, TYPE.TITLE, TYPE.TOP_TIME, TYPE.ADD_CHILD_TAG].includes(this.type)
      },
      labelPosition () {
        let position = 'left'
        if ([TYPE.CREATE, TYPE.TOP_TIME].includes(this.type)) {
          position = 'top'
        } else if (this.type === TYPE.TITLE && this.formInfo.level === 0) {
          position = 'top'
        }
        return position
      },
      labelWidth () {
        if (this.labelPosition === 'left') {
          return 100
        }
        return undefined
      },
      width () {
        if (this.labelPosition === 'left') {
          return 400
        }
        return 600
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
      showTagLevel () {
        return this.type === TYPE.CREATE
      },
      showParentSelct () {
        if (this.type === TYPE.CREATE) {
          return this.formInfo.level === 1
        }
        return this.type === TYPE.SET_CHILD_TAG
      },
      showTagName () {
        return [TYPE.CREATE, TYPE.TITLE, TYPE.TOP_TIME].includes(this.type)
      },
      showParentTag () {
        return this.type === TYPE.ADD_CHILD_TAG
      },
      showSubTagName () {
        return this.type === TYPE.ADD_CHILD_TAG
      },
      showTopTime () {
        /**
         * 1. 非药品
         * 2. 一级分类的修改 名称/限时置顶
         * 3. 创建分类 -> 创建一级分类
         */
        if (!this.supportTopTime) {
          return false
        }
        if ([TYPE.TITLE, TYPE.TOP_TIME].includes(this.type)) {
          return this.item && this.item.level === 0
        }
        return this.type === TYPE.CREATE && this.formInfo.level === 0
      },
      showDelete () {
        return this.type === TYPE.DELETE
      }
    },
    components: {
      TopTime
    },
    methods: {
      getFormInfo (item, type) {
        let formInfo = {}
        if (type === TYPE.SET_CHILD_TAG) {
          formInfo = {
            parentId: undefined
          }
        } else if (type === TYPE.ADD_CHILD_TAG) {
          formInfo = {
            childName: '',
            parentId: item.id
          }
        } else if (type === TYPE.DELETE) {
          formInfo = {
            deleteType: DELETE_TYPE.PRODUCT
          }
        } else {
          formInfo = {
            name: item.name, // 分类名称
            level: item.level || 0, // 新建分类类别
            parentId: undefined, // 设置为二级分类 父分类id
            timeZone: item.timeZone, // 分时置顶
            appTagCode: item.appTagCode, // 药品的appcode
            topFlag: item.topFlag || false // 限时置顶
          }
        }
        return formInfo
      },
      filterTimeZone (timeZone) {
        let { timeList } = timeZone
        timeList = timeList.filter(time => !isEmpty(time))
        return {
          ...timeZone,
          timeList
        }
      },
      validatorTagName (name) {
        if (!name) {
          return '分类名称不能为空'
        }
        const result = validate('tagName', name)
        if (result.code > 0) {
          return result.msg || '分类名称输入异常'
        }
        return ''
      },
      validatorSubTag () {
        const name = this.formInfo.childName
        let error = this.validatorTagName(name) || ''
        if (!error) {
          if (this.item.children && this.item.children.find(i => i.name === name)) {
            error = `分类名称已存在：${this.formInfo.childName}`
          }
        }
        return error
      },
      validator () {
        if (this.showParentSelct && !this.formInfo.parentId) {
          this.error = '请选择归属的一级分类'
          return true
        }
        if (this.showTagName) {
          this.error = this.validatorTagName(this.formInfo.name)
          if (this.error) {
            return true
          }
        }
        if (this.showSubTagName) {
          this.error = this.validatorSubTag()
          if (this.error) {
            return true
          }
        }
        if (this.showTopTime && this.formInfo.topFlag) {
          this.error = this.$refs.topTime.validate() || ''
          if (this.error) {
            return true
          }
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
          let params = {}
          switch (this.type) {
          case TYPE.TOP_TIME:
          case TYPE.TITLE:
            params = {
              name: this.formInfo.name,
              topFlag: this.formInfo.topFlag,
              timeZone: this.formInfo.timeZone,
              appTagCode: this.formInfo.appTagCode
            }
            break
          case TYPE.CREATE:
            params = {
              name: this.formInfo.name,
              level: this.formInfo.level,
              topFlag: this.formInfo.topFlag,
              timeZone: this.formInfo.timeZone,
              appTagCode: this.formInfo.appTagCode,
              parentId: this.formInfo.parentId
            }
            break
          case TYPE.SET_CHILD_TAG:
            params = {
              parentId: this.formInfo.parentId
            }
            break
          case TYPE.ADD_CHILD_TAG:
            params = {
              name: this.formInfo.childName,
              appTagCode: this.formInfo.appTagCode
            }
            break
          case TYPE.DELETE:
            params = {
              deleteType: this.formInfo.deleteType
            }
            break
          }
          console.log('handleSubmit', params)
          this.$emit('on-ok', params)
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
  @prefix-cls: ~"manage-tag-modal";

 .@{prefix-cls} {
   &-error {
     font-size: @font-size-base;
     color: rgba(0,0,0,0.65);
     padding-bottom: 10px;
   }
   &-form {
     &.boo-form-label-left {
        .@{prefix-cls} {
          &-input, &-select {
            font-size: @font-size-small;
            width: 225px;
          }
          &-item {
            margin-bottom: 14px;
          }
        }
     }
     .boo-modal-footer {
       padding-top: 30px;
     }
     .boo-radio-wrapper.boo-radio-default {
       margin-right: 30px;
     }
   }
   &-item:last-child {
     margin-bottom: 0;
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
   &-parent-name {
     font-size: @font-size-base;
     color: #fff;
     line-height: 32px;
     padding: 4px 8px;
     background: @link-color;
     cursor: pointer;
     border-radius: @border-radius-base;
   }
  //  &-top-time {
  //    height: 300px;
  //  }
 }
</style>
