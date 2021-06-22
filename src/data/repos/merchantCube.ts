import {
  apiCubeTaskStatus,
  apiCubeTaskConfirm
} from '@/data/merchantApi/cube'

export const getCubeTaskStatus = (taskType) => apiCubeTaskStatus({ taskType })

export const getCubeTaskConfirm = (taskId) => apiCubeTaskConfirm({ taskId })
