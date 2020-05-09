import Modal from '@/components/modal'
import { bridgeJumpTo } from '@/components/link'
import lx from '@/common/lx/lxReport'

export default (message, props = {}) => {
  // 缺少资质或资质过期提示埋点
  lx.mv({
    bid: 'b_shangou_online_e_pz7m7ncm_mv',
    val: { type: 2 } // 缺少资质或资质过期
  })
  if (message) {
    Modal.confirm({
      title: '错误提示',
      content: message,
      maskClosable: true,
      okText: '去上传资质',
      onOk: () => {
        lx.mc({ bid: 'b_shangou_online_e_scbmwuda_mc' })
        bridgeJumpTo('/v2/shop/manage/businessQualification')
      },
      ...props
    })
  }
}
