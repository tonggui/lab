import Modal from '@components/modal'
import { Message } from '@roo-design/roo-vue'
import { QUALIFICATION_STATUS } from '@/data/enums/product'
import qualificationModal from '@components/qualification-modal'

const ERROR_TYPE = {
  UPC_ILLEGAL: 1013,
  QUALIFICATION: 1014,
  POOR_IMAGE: 1015,
  QUALIFICATION_EXP: QUALIFICATION_STATUS.EXP,
  QUALIFICATION_NO: QUALIFICATION_STATUS.NO
}

const defaultHandler = (message) => () => Message.error(message)

const errorHandler = {
  [ERROR_TYPE.UPC_ILLEGAL]: (message) => () => {
    Modal.error({
      icon: '',
      width: 520,
      title: '条码不合法，请核对是否存在以下几种情况',
      content: message
    })
  },
  [ERROR_TYPE.QUALIFICATION]: () => ({ isBusinessClient }) => {
    Modal.error({
      icon: '',
      width: 520,
      title: '提示',
      render: (h) => {
        const businessLink = h('div', [
          h('br'),
          h('div', ['请前往 ', h('a', { props: { href: '/#/v2/shop/manage/businessQualification', target: '_blank' } }, ['店铺设置-门店管理-营业资质'])])
        ])
        const link = isBusinessClient ? businessLink : h('span', ['请联系商家上传相关资质'])
        return h('div', [
          '保存失败，请上传“第二类医疗器械经营备案凭证”、“医疗器械经营许可证”任意一个资质，才允许售卖[避孕套]和[测孕试纸]商品。',
          link
        ])
      }
    })
  },
  [ERROR_TYPE.POOR_IMAGE]: () => ({ confirm }) => {
    Modal.confirm({
      title: '提示',
      content: '检测到图片质量过差，将影响订单量和店铺排名，请重新上传',
      okText: '继续保存',
      okType: 'danger',
      cancelText: '去看看',
      onOk: () => {
        return new Promise((resolve) => {
          confirm(resolve, { validType: 1015 })
        })
      }
    })
  },
  [ERROR_TYPE.QUALIFICATION_EXP]: (message) => () => qualificationModal(message),
  [ERROR_TYPE.QUALIFICATION_NO]: (message) => () => qualificationModal(message)
}

export default (err) => {
  const handler = errorHandler[err.code] || defaultHandler
  const message = err.message || err || '保存失败'
  return handler(message)
}
