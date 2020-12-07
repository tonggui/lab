<template>
  <Form ref="form" class="modify-field-form" label-position="left" :label-width="80" :rules="rules" :model="formData">
    <FormItem label="商品标题" prop="name">
      <Input v-model="formData.name" @input="handleNameChange" />
    </FormItem>
    <div class="form-flex">
      <FormItem label="商品价格" prop="price">
        <ProductPrice size="default" v-model="formData.price" prefix="" style="width: 90px" />
      </FormItem>
      <FormItem label="库存" prop="stock" :label-width="40">
        <ProductStock size="default" v-model="formData.stock" :with-zero="false" style="width: 90px" />
      </FormItem>
      <FormItem label="售卖状态" prop="sellStatus">
        <Select v-model="formData.sellStatus" style="width: 105px">
          <Option value="">请选择</Option>
          <Option value="0">上架</Option>
          <Option value="1">下架</Option>
        </Select>
      </FormItem>
    </div>
    <FormItem label="商品类目" prop="category">
      <CategoryPath :value="formData.category" @on-change="handleChangeCategory" />
      <Tooltip type="help" placement="top" :max-width="260" transfer content="商品类目是大众统一认知的分类，是为买家推荐和搜索的重要依据之一，请认真准确填写，否则将影响曝光和订单转化。" />
    </FormItem>
    <FormItem label="店内分类" prop="tagList" v-if="context.isSinglePoi">
      <TagList :maxCount="context.maxTagCount" :value="formData.tagList" @change="handleTagListChange" :source="context.tagList" />
    </FormItem>
    <FormItem label="商品图片" prop="pictureList">
      <small class="description">
        图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传8张图
        <a target="_blank" href="//collegewm.meituan.com/sg/post/detail?id=177&contentType=0">查看详细说明&gt;</a>
      </small>
      <ProductPicture style="width: 650px" :max="8" :poiIds="context.poiIdList" :value="formData.pictureList" @change="handlePictureListChange" :autoCropArea="1" />
    </FormItem>
    <FormItem label="商品标签" prop="labelList">
      <ProductLabel v-model="formData.labelList" />
    </FormItem>
    <FormItem label="商品描述" prop="description">
      <Input type="textarea" :maxlength="200" :rows="4" v-model="formData.description" placeholder="请填写商品的核心卖点，200字以内" />
    </FormItem>
    <FormItem label="图片详情" prop="pictureContentList" v-if="context.showPicContent">
      <PicDetails :value="formData.pictureContentList" @change="handleChangePictureContentList" />
    </FormItem>
  </Form>
</template>
<script>
  import CategoryPath from '@components/category-path'
  import TagList from '@components/taglist'
  import ProductPicture from '@components/product-picture'
  import ProductLabel from '@components/product-label'
  import PicDetails from '@components/pic-details'
  import ProductPrice from '@/views/components/product-sku-edit/edit/inline/price'
  import ProductStock from '@/views/components/product-sku-edit/edit/inline/stock'
  import { validate } from '@sgfe/product-validate'

  const createFieldValidator = (nodeName, options = { nodeConfig: { required: false } }) => (rule, value, callback) => {
    const res = validate(nodeName, value, options)
    console.log(nodeName, value, options, res)
    const error = res.code > 0 ? res.msg : undefined
    callback(error)
  }

  export const createModifyData = () => {
    return {
      name: '', // 商品标题
      stock: undefined, // 商品库存
      price: undefined, // 商品价格
      sellStatus: '', // 售卖状态
      category: {},
      tagList: [],
      pictureList: [], // 商品图片
      labelList: [], // 商品标签
      description: '', // 商品描述
      pictureContentList: [] // 图文详情
    }
  }

  export default {
    name: 'modify-field-form',
    props: {
      value: Object,
      context: {
        type: Object,
        default: () => ({
          isSinglePoi: false,
          maxTagCount: 1,
          tagList: [],
          poiIdList: [],
          showPicContent: false
        })
      }
    },
    components: {
      CategoryPath,
      TagList,
      ProductPicture,
      ProductLabel,
      PicDetails,
      ProductPrice,
      ProductStock
    },
    data () {
      return {
        rules: {
          name: [{ validator: createFieldValidator('title') }],
          price: [{ validator: createFieldValidator('sku.price') }],
          stock: [{ validator: createFieldValidator('sku.stock') }],
          pictureList: [{
            validator: (rule, value, callback) => {
              let error
              if (value && value.filter(s => s).length > 0) {
                const { code, msg } = validate('picture', value, { nodeConfig: { noGap: true } })
                console.log(code, msg)
                error = code > 0 ? msg : undefined
              }
              callback(error)
            },
            trigger: 'change'
          }],
          description: [{ type: 'string', max: 200, message: '商品描述最多200字' }]
        }
      }
    },
    computed: {
      formData: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('change', value)
        }
      }
    },
    methods: {
      handleNameChange (val) {
        this.$emit('on-name-change', val)
      },
      handleChangeCategory (category) {
        this.formData.category = category
      },
      handlePictureListChange (pictureList) {
        this.formData.pictureList = pictureList
      },
      handleChangePictureContentList (pictureContentList) {
        this.formData.pictureContentList = pictureContentList
      },
      handleTagListChange (tagList) {
        this.formData.tagList = tagList
      },
      async validate () {
        const $form = this.$refs.form
        const valid = await $form.validate()
        if (!valid) {
          $form.$el.scrollIntoViewIfNeeded()
          return '请正确填写修改字段！'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .modify-field-form {
    .description {
      display: block;
      color: @text-tip-color;
    }
    .form-flex {
      display: flex;
      .boo-form-item {
        margin-right: 18px
      }
    }
    /deep/ .boo-form-item-content > .boo-input-wrapper {
      width: 440px;
    }
  }
</style>
