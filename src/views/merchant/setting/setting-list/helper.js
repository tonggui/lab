
export const getIsSinglePoi = (query = {}) => !!query.wmPoiId && query.from === 'single'
