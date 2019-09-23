import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload' // 图片懒加载
import ErrorImg from '@/assets/picture-broken.png'

Vue.use(VueLazyLoad, {
  throttleWait: 200,
  error: ErrorImg
})
