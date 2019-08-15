/*
 * @description
 *   Please write the withAsyncTask script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-06-01)
 */
import Vue from 'vue'
import { pascalCase } from '@/common/utils'

export default (asyncTask, options = {}) => (WrapperComponent) => {
  const {
    Loading = 'Spin', // 加载过程中组件, 默认使用Spin
    loadingOptions = {}, // loading组件render时的配置
    Error = null, // 错误场景下组件
    mounted = true, // 加载的时机，true--mounted后触发task，否则初始化时触发
    key = 'value', // 返回数据对应的Props Key值
    excuterKey = false, // 执行器Key，默认false（不向下传递），true--向下传递（key: excuter），String时则向下传递[Key]
    initData = undefined, // 初始值/默认值
    paramsConverter = props => props, // AsyncTask的入参转换器
    convertor = data => data,
    mapper = (k, v) => ({ [k]: v })
  } = options

  return Vue.extend({
    name: 'WithAsyncTask' + pascalCase(WrapperComponent.name),
    props: WrapperComponent.props,
    data () {
      return {
        data: initData,
        loading: true,
        error: null
      }
    },
    methods: {
      async excuteAsyncTask () {
        this.loading = true
        try {
          const data = await asyncTask(paramsConverter(this.props, this.$data))
          this.data = convertor(data)
          this.loading = false
        } catch (error) {
          this.loading = false
          this.error = (error && error.message) || error
        }
      }
    },
    created () {
      if (!mounted) {
        this.excuteAsyncTask()
      }
    },
    mounted () {
      if (mounted) {
        this.excuteAsyncTask()
      }
    },
    render (h) {
      if (this.error && Error) {
        return h(Error, {
          error: this.error
        })
      }
      if (this.loading && Loading) {
        return h(Loading, {
          error: this.error,
          ...loadingOptions
        })
      }
      const props = {
        ...this.$props,
        ...mapper(key, this.data)
      }
      if (excuterKey) {
        props[excuterKey === true ? 'excuter' : excuterKey] = this.excuteAsyncTask
      }
      return h(WrapperComponent, {
        props,
        attrs: this.$attrs,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots
      })
    }
  })
}
