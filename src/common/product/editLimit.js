/**
 * 活动卡控 https://km.sankuai.com/page/453807141
 */
import Modal from '@/components/modal'
import { isFunction } from 'lodash'
import lx from '@/common/lx/lxReport'

export const isEditLimit = (api, context, cb) => {
  return new Promise((resolve, reject) => {
    const { product, params, extra, others } = context
    api(product, params, extra, others).then(res => {
      resolve(res)
    }).catch(err => {
      if (err.code === 11001) {
        lx.mv({ bid: 'b_shangou_online_e_pkdzom2e_mv',
          val: {
            spu_id: product.id
          } })
        Modal.confirm({
          title: '编辑商品',
          width: 600,
          render: (h) => {
            return h('div', {
              style: 'max-height: 492px; overflow: auto'
            }, err.message)
          },
          centerLayout: true,
          okText: '修改并退出活动',
          cancelText: '取消编辑',
          onOk: () => {
            lx.mc({ bid: 'b_shangou_online_e_88ppio0h_mc',
              val: {
                spu_id: product.id
              } })
            if (isFunction(cb)) cb()
            resolve(true)
          },
          onCancel: () => {
            lx.mc({ bid: 'b_shangou_online_e_sem0g171_mc',
              val: {
                spu_id: product.id
              } })
            reject(new Error('取消编辑'))
          }
        })
      } else {
        reject(err)
      }
    })
  })
}
