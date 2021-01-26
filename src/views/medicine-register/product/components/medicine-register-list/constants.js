import {
  MEDICINE_REGISTER_BATCH_OPARATION_ENUM
} from '@/data/enums/register'

export const batchOperation = [
  {
    name: '清除配置',
    type: MEDICINE_REGISTER_BATCH_OPARATION_ENUM.DELETE,
    tip: {
      success: '批量清除配置成功',
      error: '批量清除配置失败！'
    }
  }
]
