import {
  MEDICINE_PRODUCT_BATCH_OP
} from '@/data/enums/product'

export const batchOperation = [
  {
    name: '批量替换',
    id: MEDICINE_PRODUCT_BATCH_OP.CHANGE,
    tip: {
      success: '批量替换商品成功～',
      error: '批量替换商品失败！'
    }
    // statistics: {
    //   bid: 'b_ripg0ips',
    //   custom: {
    //     type: 4
    //   }
    // }
  }
  // {
  //   name: '更多',
  //   id: 'more',
  //   children: [
  //     {
  //       name: '修改库存',
  //       id: PRODUCT_BATCH_OP.MOD_STOCK,
  //       tip: {
  //         success: '批量修改库存成功～',
  //         error: '批量修改库存失败！'
  //       },
  //       statistics: {
  //         bid: 'b_ripg0ips',
  //         custom: {
  //           type: 3
  //         }
  //       }
  //     }
  //   ]
  // }
]
