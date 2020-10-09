import Modal from '@/components/modal'

export const isEditLimit = (api, context) => {
  return new Promise((resolve, reject) => {
    const { product, params, extra } = context
    api(product, params, extra).then(res => {
      resolve()
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
            resolve()
          },
          onCancel: () => {
            reject(err.message)
          }
        })
      }
    })
  })
}
