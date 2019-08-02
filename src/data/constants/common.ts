import { Pagination, TimeZone } from '../interface/common'

export const defaultPagination: Pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
  pageSizeOpts: [20, 50, 100],
  showElevator: true,
  showSizer: true
}

export const initTimeZone: TimeZone = {
  days: [0, 1, 2, 3, 4, 5, 6],
  timeList: []
}
