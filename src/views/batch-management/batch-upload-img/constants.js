import { BATCH_UPLOAD_IMG_TYPE } from '@/data/enums/batch'

import exampleImg from '@/assets/img-example/batch-upload-example.png'
import fuzzyImg from '@/assets/img-example/fuzzy.png'
import goodImg from '@/assets/img-example/good.png'
import masaicImg from '@/assets/img-example/masaic.png'
import qrcodeImg from '@/assets/img-example/qrcode.png'
import rotateImg from '@/assets/img-example/rotate.png'

export const PictureUploadRuleTypeList = [{
  title: '用商品标题命名',
  value: BATCH_UPLOAD_IMG_TYPE.PRODUCT_NAME,
  desc: '示例：柠檬 100g',
  content: exampleImg
}, {
  title: '用UPC/EAN码命名',
  value: BATCH_UPLOAD_IMG_TYPE.UPC,
  desc: '示例：11223344',
  content: exampleImg
}, {
  title: '用SKU码/货号命名',
  value: BATCH_UPLOAD_IMG_TYPE.SKU,
  desc: '示例：abcdddd',
  content: exampleImg
}]

export const PICTURE_MEMOS = [
  {
    src: goodImg,
    memo: '优秀案例'
  },
  {
    src: qrcodeImg,
    memo: '不能含有二维码'
  },
  {
    src: fuzzyImg,
    memo: '图片避免模糊'
  },
  {
    src: rotateImg,
    memo: '图片不能翻转、变形'
  },
  {
    src: masaicImg,
    memo: '不能含有马赛克'
  }
]
