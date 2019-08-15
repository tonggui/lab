const setCookie = (name, value, expires = '', needEncode = true) => {
  value = needEncode ? encodeURIComponent(value) : value
  document.cookie = `${name}=${value}; expires=${expires}`
}

const getCookie = name => {
  name += '='
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length))
    }
  }
  return ''
}

const delCookie = name => {
  const date = new Date()
  date.setTime(date.getTime() - 1)
  const expires = date.toGMTString()
  const value = getCookie(name)
  if (value) {
    document.cookie = `${name}=${value}; expires=${expires}`
  }
}

export {
  setCookie,
  getCookie,
  delCookie
}
