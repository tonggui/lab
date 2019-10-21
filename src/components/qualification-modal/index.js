import { Modal } from '@roo-design/roo-vue'
import { bridgeJumpTo } from '@/components/link'

export default (message) => {
  if (message) {
    Modal.confirm({
      title: '错误提示',
      content: message,
      maskClosable: true,
      okText: '去上传资质',
      onOk: () => bridgeJumpTo('/v2/shop/manage/businessQualification')
    })
  }
}
