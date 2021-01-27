import {
  MEDICINE_REGISTER_BATCH_OPARATION_ENUM
} from '@/data/enums/register'

export const batchOperation = [
  {
    name: '删除配置',
    type: MEDICINE_REGISTER_BATCH_OPARATION_ENUM.DELETE,
    tip: {
      success: '批量删除配置成功',
      error: '批量删除配置失败！'
    }
  }
]
