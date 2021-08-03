import Vue from 'vue'
import 'intro.js/minified/introjs.min.css'
import './custom.less'
import introJs from 'intro.js/minified/intro.min'
export * from './configs'

const stepTour = function (steps) {
  return introJs().setOptions({
    disableInteraction: true,
    steps,
    nextLabel: '下一步',
    prevLabel: '上一步',
    skipLabel: '跳过引导',
    doneLabel: '我知道了',
    exitOnOverlayClick: false
  })
}

export const tourState = Vue.observable({
  visible: false
})

export default ({ steps, oncomplete, onbeforeexit, onbeforechange }) => {
  if (!steps) throw Error('不存在步骤')
  let step = stepTour(steps)
  if (onbeforechange) step = step.onbeforechange(onbeforechange)
  if (oncomplete) step = step.oncomplete(oncomplete)
  if (onbeforeexit) step = step.onbeforeexit(onbeforeexit)
  return step
}
