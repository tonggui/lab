// TODO 待优化，事件机制没有
// 由于upc输入框，需要进行重置表单，此方法只有表单中存在，所有简单定义了一下
// 通过动态表单的 triggerEvent进行响应
export const EVENTS_TYPE = {
  RESET: 'reset',
  SET_DATA: 'setData'
}
