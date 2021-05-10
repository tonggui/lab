import Vue from 'vue'
import createForm from './form'
import { get, merge, find, intersectionBy, differenceWith } from 'lodash'
import FormFooter from '../../components/footer'
import { splitCategoryAttrMap } from '@/data/helper/category/operation'
// import { createSku } from '@/data/helper/product/operation'

/**
 * 实例化 form 组件的高阶组件
 */
// 获取类目属性
export default (service) => ({ data = {}, context = {}, initialData = {} } = {}, {
  components = {},
  plugins = [],
  validate = []
} = {}) => {
  return Vue.extend({
    name: 'base-form',
    props: {
      navigation: Boolean, // 是否支持导航
      value: { // form 表单值
        type: Object,
        default: () => ({})
      },
      context: { // 控制的context，外部传入的优先级最高，会覆盖从接口获取的值
        type: Object,
        default: () => ({})
      },
      disabled: Boolean, // 字面意识
      isEditMode: Boolean, // 是否是编辑模式，主要是控制底部footer按钮是否吸底，编辑时 吸底，新建不吸
      hideCancel: Boolean, // 是否隐藏 cancel 按钮
      confirmText: String, // 提交按钮 展示文案
      cancelText: String, // 取消按钮 展示文案
      hideFooter: Boolean, // 是否隐藏 footer
      footerBtnType: String, // 提交按钮的权限类型
      needPermission: Boolean // 提交按钮是否需要使用权限
    },
    data () {
      return {
        submitting: false // 是否提交中，控制footer的按钮的loading状态
      }
    },
    beforeCreate () {
      // 实例化form，每次新建组件的时候，实例化一次，避免 form 复用
      this.form = createForm({ data, context, initialData }, { components, plugins, validate })
      // 更新 data和context
      this.form.setData(this.$options.propsData.value)
      this.form.setContext(this.$options.propsData.context)
    },
    watch: {
      disabled: {
        immediate: true,
        handler () {
          // disabled 同步
          this.formContext = { ...this.formContext, disabled: this.disabled }
        }
      },
      'formData.category.id' () {
        // 分类变化，获取新的 context，context现在只跟类目id和门店id相关，逻辑写死的
        this.getContext()
      },
      formData (newValue, oldValue) {
        // 表单值变化时，判断是否是类目变化，去获取类目属性
        const newCategoryId = get(newValue, 'category.id')
        const oldCategoryId = get(oldValue, 'category.id')
        if (newCategoryId !== oldCategoryId) {
          // TODO 拉标品的时候，也是会更新 类目id，但是此时不需要去获取类目属性，因为类目属性跟着标品信息已经获取到了
          // TODO 所以判断一下，类目变化，但是类目属性没有变化的时候，那就是只有类目变化，需要去获取类目属性
          // TODO 可以考虑优化
          if (newValue.normalAttributes === oldValue.normalAttributes) {
            this.getCategoryAttrs()
          }
        }
        // 表单值变化，同步外部
        this.$emit('input', this.formData)
        this.$emit('change', this.formData)
      },
      formContext () {
        // context 的变化，同步外部
        this.$emit('context-change', this.formContext)
      },
      context: {
        immediate: true,
        handler (value) {
          // 外部context变化，同步到form内部
          if (value === this.formContext) {
            return
          }
          this.formContext = value
        }
      },
      value: {
        immediate: true,
        handler (value) {
          // 外部value变化，同步到form内部
          if (value === this.formData) {
            return
          }
          this.formData = value
        }
      }
    },
    computed: {
      formData: {
        // 获取formData，根据 form的store中的data
        get () {
          return this.form.store.data
        },
        // 设置formData，需要使用form的setData
        set (data) {
          this.form.setData(data)
        }
      },
      // 同上
      formContext: {
        get () {
          return this.form.store.context
        },
        set (context) {
          this.form.setContext(context)
        }
      }
    },
    methods: {
      // 接口获取 context
      async getContext () {
        const context = await service.getContext(this.formData.category.id)
        this.formContext = merge({}, context, this.context)
      },
      // 接口获取类目属性
      async getCategoryAttrs () {
        const categoryId = this.formData.category.id
        let categoryAttrList = []
        let categoryAttrValueMap = {}
        try {
          if (categoryId) {
            categoryAttrList = await service.getCategoryAttrs(this.formData.category.id)
            const currentCategoryList = [].concat(this.formData.normalAttributes, this.formData.sellAttributes)
            // 找到属性ID相同，但渲染类型不同的属性，过滤掉这部分的属性值回填逻辑。
            // https://tt.sankuai.com/ticket/detail?id=7522228
            const intersectionCategoryAttrListWithDifferentValueType = differenceWith(
              intersectionBy(categoryAttrList, currentCategoryList, 'id'),
              currentCategoryList,
              (left, right) => left.id === right.id && left.valueType === right.valueType
            )

            // 获取的类目属性和当前已经存在的类目属性的值进行 传递，避免用户已填写的相同属性值丢失
            const currentAttrValueMap = { ...this.formData.normalAttributesValueMap, ...this.formData.sellAttributesValueMap }
            categoryAttrValueMap = categoryAttrList.reduce((prev, attr) => {
              const invalidAttr = find(intersectionCategoryAttrListWithDifferentValueType, ['id', attr.id])
              if (invalidAttr) {
                console.warn(`非预期数据警告：类目属性（${attr.name}，ID: ${attr.id}）在不同类目下的类型[${attr.valueType}, ${get(find(currentCategoryList, ['id', attr.id]), 'valueType')}]不同！`)
                prev[attr.id] = undefined
              } else {
                prev[attr.id] = currentAttrValueMap[attr.id]
              }
              return prev
            }, {})
          }
        } catch (err) {
          console.error(err)
        } finally {
          // 将类目属性拆分成，销售属性和非销售属性
          const categoryAttr = splitCategoryAttrMap(categoryAttrList, categoryAttrValueMap)
          // TODO 获取新类目重新设置空skuList
          // const skuList = (this.formData.skuList || []).map(item => createSku())
          this.formData = { ...this.formData, ...categoryAttr }
        }
      },
      async validate (options) {
        try {
          let error
          // 外部的validate
          if (this.$listeners.validate) {
            error = await new Promise((resolve) => {
              this.$emit('validate', resolve)
            })
          }
          if (!error) {
            // 触发form的validate
            error = await this.form.validate(options)
          }
          return error
        } catch (err) {
          return err.message || err
        }
      },
      async submit () {
        // form的提交流程
        const stop = await this.form.submit()
        return stop
      },
      handleCancel () {
        // 取消
        this.$emit('cancel')
      },
      // 提交处理逻辑
      async handleConfirm () {
        try {
          // 用于埋点
          this.$emit('confirm-click')
          // 状态设置
          this.submitting = true
          // 校验流程
          const error = await this.validate()
          // 校验存在错误
          if (error) {
            this.$Message.warning(error) // warning 错误
            this.$emit('validate-error', error)
            this.submitting = false // 更新提交状态
            return
          }
          // 走提交流程，部分plugin里面，会有提交前的确认在
          // TODO 待优化，此流程不是很正规
          const stop = await this.submit()
          // 某个plugin把提交流程阻断了
          if (stop) {
            this.submitting = false // 更新提交状态
            return
          }
          // 触发外部提交
          this.$emit('confirm', () => {
            // 提交的callback，外部不论成功与否，记得调用，去更新提交状态
            this.submitting = false
          })
        } catch (err) {
          // 错误兜底处理
          this.submitting = false
          console.error(err.message)
        }
      },
      renderForm (h) {
        // 渲染form 通过form.render的方法，navigation是根据config渲染出来的，所以交给form处理
        return this.form.render(h, { navigation: this.navigation })
      },
      // 渲染底部footer 按钮组，支持slot footer，重写footer
      renderFooter () {
        let content = null
        if (this.$slots.footer) {
          content = this.$slots.footer
        } else {
          const submit = <PermissionBtn btnType={this.footerBtnType} needPermission={this.needPermission} style="min-width: 120px" type="primary" onClick={this.handleConfirm} loading={this.submitting}>{ this.confirmText || (this.isEditMode ? '保存商品' : '确认发布商品') }</PermissionBtn>
          const cancel = this.hideCancel ? null : <Button style="min-width: 120px" onClick={this.handleCancel} disabled={this.submitting}>{ this.cancelText || '取消' }</Button>
          content = [cancel, submit]
        }
        return (
          <FormFooter sticky={this.isEditMode}>{ content }</FormFooter>
        )
      }
    },
    mounted () {
      // 初始获取 context
      this.getContext()

      // form start
      this.form.start()
    },
    render (h) {
      // 渲染 form + footer
      const form = this.renderForm(h)
      const footer = this.hideFooter ? null : this.renderFooter(h)
      return h('div', [form, footer])
    }
  })
}
