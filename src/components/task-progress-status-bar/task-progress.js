import { BATCH_REL_TASK_STATUS, BATCH_TASK_RESULT_STATUS } from '@/data/enums/batch'
import moment from 'moment'
import { get } from 'lodash'

const STATUS = {
  [BATCH_REL_TASK_STATUS.INLINE]: 'INLINE',
  [BATCH_REL_TASK_STATUS.IN_PROCESS]: 'IN_PROCESS',
  [BATCH_REL_TASK_STATUS.FINISH]: 'FINISH'
}

const STATUS_COLLECTION = {
  [BATCH_REL_TASK_STATUS.INLINE]: {
    tag: {
      tagText: '处理中',
      color: '#198CFF'
    },
    buttons: [{
      btnText: '查看进度',
      link: ''
    }],
    displayText: '于@{time}提交的@{task_name}处理中，请耐心等待。'
  },
  [BATCH_REL_TASK_STATUS.IN_PROCESS]: {
    tag: {
      tagText: '处理中',
      color: '#198CFF'
    },
    buttons: [{
      btnText: '查看详情',
      link: ''
    }],
    displayText: '于@{time}提交的@{task_name}处理中，请耐心等待。'
  },
  [BATCH_TASK_RESULT_STATUS.ALL_SUCCESS]: {
    tag: {
      tagText: '创建成功',
      color: '#00BF7F'
    },
    buttons: [{
      btnText: '查看详情',
      link: ''
    }, {
      btnText: '我知道了',
      color: '#666666',
      link: () => {}
    }],
    displayText: '于@{time}提交的@{task_name}已处理完成。全部商品创建并关联成功。'
  },
  [BATCH_TASK_RESULT_STATUS.PART_SUCCESS]: {
    tag: {
      tagText: '创建失败',
      color: '#FF192D'
    },
    buttons: [{
      btnText: '查看详情',
      link: ''
    }],
    displayText: '于@{time}提交的@{task_name}已处理完成。部分商品创建并关联失败，请查看。'
  },
  [BATCH_TASK_RESULT_STATUS.FAIL]: {
    tag: {
      tagText: '创建失败',
      color: '#FF192D'
    },
    buttons: [{
      btnText: '查看详情',
      link: ''
    }],
    displayText: '于@{time}提交的@{task_name}已处理完成。全部商品创建并关联失败，请查看。'
  }
}

class BaseTaskProcess {
  constructor (props) {
    this.id = props.taskId
    this.name = props.name
    this.taskName = props.taskName
    this.submitTime = props.submitTime
    this.link = props.link
    this.status = STATUS[props.status] || STATUS[BATCH_REL_TASK_STATUS.INLINE]
    this.text = this.displayText(props)
    this.tag = this.displayTag(props)
    this.buttons = this.displayBtn(props)
  }
  displayBtn ({ status, resultStatus }) {
    if ([BATCH_REL_TASK_STATUS.INLINE, BATCH_REL_TASK_STATUS.IN_PROCESS].includes(status)) {
      return get(STATUS_COLLECTION[status], 'buttonss')
    } else if (BATCH_REL_TASK_STATUS.FINISH === status) {
      return get(STATUS_COLLECTION[resultStatus], 'buttons')
    }
    return {}
  }
  displayTag ({ status, resultStatus }) {
    if ([BATCH_REL_TASK_STATUS.INLINE, BATCH_REL_TASK_STATUS.IN_PROCESS].includes(status)) {
      return get(STATUS_COLLECTION[status], 'tag')
    } else if (BATCH_REL_TASK_STATUS.FINISH === status) {
      return get(STATUS_COLLECTION[resultStatus], 'tag')
    }
    return {}
  }
  displayText ({ status, submitTime, resultStatus }) {
    let text = ''
    if ([BATCH_REL_TASK_STATUS.INLINE, BATCH_REL_TASK_STATUS.IN_PROCESS].includes(status)) {
      text = get(STATUS_COLLECTION[status], 'displayText', '')
    } else if (BATCH_REL_TASK_STATUS.FINISH === status) {
      text = get(STATUS_COLLECTION[resultStatus], 'displayText', '')
    }
    return text.replace('@{time}', moment(submitTime).format('YYYY-MM-DD HH:mm:ss')).replace('@{task_name}', this.taskName)
  }
}

export default BaseTaskProcess
