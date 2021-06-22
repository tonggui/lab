import {
  apiCubeTaskStatus
} from '@/data/merchantApi/cube'
// import { BATCH_REL_TASK_STATUS, BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

export const getCubeTaskStatus = (taskType) => apiCubeTaskStatus(taskType)
