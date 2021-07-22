import LocalStorage, { KEYS as STORAGE_KEYS } from '@/common/local-storage'
import stepTour, {
  oldMerchantSteps,
  stepsFromPoi,
  stepsFromSelf,
  stepsProductOperation,
  stepsMerchantCube,
  tourState
} from '@/step-tour'
import Modal from '@components/modal'
import router from '@/router'

function triggerTouchEvent (disable) {
  const element = document.querySelector('#app') || document.body
  if (disable) element.style.pointerEvents = 'none'
  else element.style.pointerEvents = 'unset'
}

/**
 * 由于延时的问题，用户可能会快速操作
 * @param fn
 * @param time
 */
function delayTriggerTour (fn, time = 2000) {
  if (typeof fn !== 'function') throw Error('delayTriggerTour 需要传入函数')
  triggerTouchEvent(true)
  setTimeout(fn, time)
}

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
  triggerTouchEvent(false)
}

export const triggerTour = ({ inExistSteps = [] }) => {
  if (LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE] && !LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE]) {
    tourState.visible = true
    triggerMerchantCubeTour({ inExistSteps })
  } else if (!LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE]) {
    tourState.visible = true
    if (LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] === null) {
      // 老商家
      delayTriggerTour(() => {
        stepTour({
          steps: oldMerchantSteps.filter(item => !inExistSteps.includes(item.element)),
          oncomplete,
          onbeforeexit
        }).start()
      })
    } else { // 新商家
      // 因为存在一些异步获取的接口，所以一定延迟加载引导
      if (LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_WAY] === 'fromPoi') {
        delayTriggerTour(() => {
          stepTour({
            steps: stepsFromPoi.filter(item => !inExistSteps.includes(item.element)),
            oncomplete: function () {
              oncomplete()
              toastModal()
            },
            onbeforeexit
          }).start()
        })
      } else {
        delayTriggerTour(() => {
          stepTour({
            steps: stepsFromSelf.filter(item => !inExistSteps.includes(item.element)),
            oncomplete,
            onbeforeexit
          }).start()
        })
      }
    }
  }
}

export const triggerProductOperation = () => {
  if (LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] && LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_WAY] !== 'fromPoi' && LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] !== null && LocalStorage[STORAGE_KEYS.MERCHANT_GUIDE] && !LocalStorage[STORAGE_KEYS.MERCHANT_OPERATION_GUIDE]) {
    delayTriggerTour(() => {
      stepTour({
        steps: stepsProductOperation,
        oncomplete: function () {
          LocalStorage[STORAGE_KEYS.MERCHANT_OPERATION_GUIDE] = true
          triggerTouchEvent(false)
        }
      }).start()
    })
  }
}

export const triggerMerchantCubeTour = ({ inExistSteps = [] }) => {
  if (!LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] && !inExistSteps.includes('#cubeCreate')) {
    delayTriggerTour(() => {
      stepTour({
        steps: stepsMerchantCube,
        oncomplete: function () {
          LocalStorage[STORAGE_KEYS.MERCHANT_CUBE_GUIDE] = true
          onbeforeexit()
        },
        onbeforeexit
      }).start()
    })
  }
}
