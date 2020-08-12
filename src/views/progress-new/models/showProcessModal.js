import ContentPoi from '@/views/progress/components/ModalContentPoi'
import DetailUpdate from '@/views/progress/components/ModalContentDetailUpdate'
import DetailCommon from '@/views/progress/components/ModalContentDetailCommon'
import DetailUploadImgs from '@/views/progress/components/ModalContentDetailUploadImgs'
import Exception from '@/views/progress/components/ModalContentException'
import Merchant from '@/views/progress/components/ModalContentMerchant'
import Modal from '@/components/modal'

// TODO 解决tsx编译问题，可废除本文件通过OOP实现分层封装处理

export const ContentMap = {
  'POI': ContentPoi,
  'DETAIL_UPDATE': DetailUpdate,
  'DETAIL_COMMON': DetailCommon,
  'DETAIL_UPLOAD_IMGS': DetailUploadImgs,
  'EXCEPTION': Exception,
  'EXCEPTION_MERCHANT': Merchant,
  'DETAIL_MERCHANT': Merchant
}

export const showModal = (type, title, data, error) => {
  const ContentComponent = ContentMap[type]
  if (ContentComponent) {
    const $modal = Modal.open({
      title: title,
      width: type === 'DETAIL_UPDATE' ? 1000 : 520,
      render: (h) => <ContentComponent dataSource={data} taskType={type} vOn:close={() => $modal.destroy()} />,
      footerHide: true
    })
    return $modal
  }
}

export default showModal
