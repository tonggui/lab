import category from './category'

const map = Object.entries(category).reduce((map, [k, v = []]) => {
  const pid = +k
  map[pid] = {
    id: pid,
    level: 1,
    idPath: [pid]
  }
  v.forEach((cid) => {
    map[cid] = {
      id: cid,
      pid,
      level: 2,
      idPath: [pid, cid]
    }
  })
  return map
}, {})

export default map
