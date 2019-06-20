import Logger from '@/common/Logger'

const normalizeHeaders = headers => Object.keys(headers)
  .map(name => `${name}:${headers[name]}`).join('|')

const normalizeRequest = config => [
  `[${config.method}]${config.url}`,
  normalizeHeaders(config.headers),
  JSON.stringify(config.data)
].join(';')

const normalizeResponse = response => [
  response.status,
  JSON.stringify(response.data),
  normalizeHeaders(response.headers)
].join(';')

const normalize = (requestConfig, response) => ({
  page: window.location.href,
  request: normalizeRequest(requestConfig),
  response: normalizeResponse(response)
})

const pickUpRequestTags = (requestConfig, response) => ({
  path: window.location.href,
  url: requestConfig.url,
  status: response.status,
  category: `Request error(Status: ${response.status})`
})

const pickUpResponseContentTags = (requestConfig, response) => {
  const resContent = response.data
  const code = resContent && resContent.code
  const message = resContent && (resContent.msg || resContent.message)
  return {
    ...pickUpRequestTags(requestConfig, response),
    category: `Unexpected api response. Code: ${code}`,
    code,
    message
  }
}

const LOG_TYPE = 'api'

export default (response) => {
  const { config = {} } = response
  if (response.status >= 200 && response.status <= 299) {
    const res = response.data

    if (res && res.code === 0) {
      Logger.debug(LOG_TYPE, normalize(config, response), pickUpResponseContentTags(config, response))
    } else {
      Logger.warn(LOG_TYPE, normalize(config, response), pickUpResponseContentTags(config, response))
    }
  } else {
    Logger.warn(LOG_TYPE, normalize(config, response), pickUpRequestTags(config, response))
  }
  return response
}
