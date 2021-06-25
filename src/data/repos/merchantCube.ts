import {
  apiCubeTaskStatus,
  apiCubeTaskConfirm,
  apiCubeBatchSaveProduct,
  apiCubeSwitch
} from '@/data/merchantApi/cube'

export const getCubeTaskStatus = () => apiCubeTaskStatus()

export const getCubeTaskConfirm = (taskId) => apiCubeTaskConfirm({ taskId })

export const getCubeBatchSaveProduct = (params) => apiCubeBatchSaveProduct({
  params
})

export const getCubeSwitch = () => apiCubeSwitch()
