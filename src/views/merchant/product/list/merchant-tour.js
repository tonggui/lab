import LocalStorage, { KEYS as STORAGE_KEYS } from '@/common/local-storage'
import stepTour, {
  oldMerchantSteps,
  stepsFromPoi,
  stepsFromSelf,
  stepsProductOperation,
  stepsMerchantCube, tourState
} from '@/step-tour'
import Modal from '@components/modal'
import router from '@/router'

function toastModal () {
  Modal.confirm({
    title: '请将总部商品与分店关联',
    content: '总部商品与分店建⽴关联后，才可实现“总部商品修改后，已建⽴关联分店的商品⾃动更新”',
    maskClosable: true,
    okText: '立即关联',
    onOk: () => {
      router.push({ name: 'newBatchRel' })
    }
  })
}
const oncomplete = () => {
  LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE] = true
  LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] = true
  LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] = true
  tourState.visible = false
}
const onbeforeexit = () => {
  tourState.visible = false
}

export const triggerTour = ({ inExistSteps = [] }) => {
  if (LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE] && !LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE]) {
    tourState.visible = true
    triggerMerchantCubeTour({ inExistSteps })
  } else if (!LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE]) {
    tourState.visible = true
    if (LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] === null) {
      // 老商家
      setTimeout(() => {
        stepTour({
          steps: oldMerchantSteps.filter(item => !inExistSteps.includes(item.element)),
          oncomplete,
          onbeforeexit
        }).start()
      }, 2000)
    } else { // 新商家
      // 因为存在一些异步获取的接口，所以一定延迟加载引导
      if (LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_WAY] === 'fromPoi') {
        setTimeout(() => {
          stepTour({
            steps: stepsFromPoi.filter(item => !inExistSteps.includes(item.element)),
            oncomplete: function () {
              oncomplete()
              toastModal()
            },
            onbeforeexit
          }).start()
        }, 2000)
      } else {
        setTimeout(() => {
          stepTour({
            steps: stepsFromSelf.filter(item => !inExistSteps.includes(item.element)),
            oncomplete,
            onbeforeexit
          }).start()
        }, 2000)
      }
    }
  }
}

export const triggerProductOperation = () => {
  if (LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] && LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_WAY] !== 'fromPoi' && LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] !== null && LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE] && !LocalStorage[STORAGE_KEYS.MERCHANT_OPERATION_GUIDE]) {
    setTimeout(() => {
      stepTour({
        steps: stepsProductOperation,
        oncomplete: function () {
          LocalStorage[STORAGE_KEYS.MERCHANT_OPERATION_GUIDE] = true
        }
      }).start()
    }, 2000)
  }
}

export const triggerMerchantCubeTour = ({ inExistSteps = [] }) => {
  if (!LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] && !inExistSteps.includes('#cubeCreate')) {
    setTimeout(() => {
      stepTour({
        steps: stepsMerchantCube,
        oncomplete: function () {
          LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] = true
          onbeforeexit()
        },
        onbeforeexit
      }).start()
    }, 2000)
  }
}
