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

export const UPC_PICTURE_MEMOS = [
  {
    src: '//p1.meituan.net/scproduct/16e8403b7b347867cf1d4aa86e2e373166095.jpg',
    memo: '优秀案例'
  },
  {
    src: '//p0.meituan.net/wmproduct/4601b2b1d135d2c49542f083fa44ac1a40118.jpg',
    memo: '条形码模糊'
  },
  {
    src: '//p0.meituan.net/wmproduct/f751a693f54dcc75c9a56317e2713816137214.jpg',
    memo: '条形码补全'
  }
]
