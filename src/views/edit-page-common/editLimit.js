/**
 * 活动卡控 https://km.sankuai.com/page/453807141
 */
import Modal from '@/components/modal'
import { isFunction } from 'lodash'

export const isEditLimit = (api, context, cb) => {
  return new Promise((resolve, reject) => {
    const { product, params, extra } = context
    api(product, params, extra).then(res => {
      resolve(false)
    }).catch(err => {
      if (err.code === 11001) {
        Modal.confirm({
          title: '编辑商品',
          width: 600,
          centerLayout: true,
          content: err.message,
          okText: '修改并退出活动',
          cancelText: '取消编辑',
          onOk: () => {
            if (isFunction(cb)) cb()
            resolve(true)
          },
          onCancel: () => {
            reject(new Error('取消编辑'))
          }
        })
      } else {
        reject(err.message)
      }
    })
  })
}
