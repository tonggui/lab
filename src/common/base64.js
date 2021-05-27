var base64 = {}
base64.map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
/**
 * 解码 base64 to string
 * @param {*} s base64 string
 * @returns
 */
function base64Decode (s) {
  s += ''
  var len = s.length
  if ((len === 0) || (len % 4 !== 0)) {
    return s
  }

  var pads = 0
  if (s.charAt(len - 1) === base64.map[64]) {
    pads++
    if (s.charAt(len - 2) === base64.map[64]) {
      pads++
    }
    len -= 4
  }

  var i; var b; var map = base64.map; var x = []
  for (i = 0; i < len; i += 4) {
    b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i + 1)) << 12) | (map.indexOf(s.charAt(i + 2)) << 6) | map.indexOf(s.charAt(i + 3))
    x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff))
  }

  switch (pads) {
    case 1:
      b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12) | (map.indexOf(s.charAt(i)) << 6)
      x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff))
      break
    case 2:
      b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12)
      x.push(String.fromCharCode(b >> 16))
      break
  }
  return unescape(x.join(''))
}

/**
 * 转码  string to base64
 * @param {*} s string
 * @returns
 */
function base64Encode (s) {
  if (!s) {
    return
  }

  s += ''
  if (s.length === 0) {
    return s
  }
  s = escape(s)

  var i; var b; var x = []; var map = base64.map; var padchar = map[64]
  var len = s.length - s.length % 3

  for (i = 0; i < len; i += 3) {
    b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8) | s.charCodeAt(i + 2)
    x.push(map.charAt(b >> 18))
    x.push(map.charAt((b >> 12) & 0x3f))
    x.push(map.charAt((b >> 6) & 0x3f))
    x.push(map.charAt(b & 0x3f))
  }

  switch (s.length - len) {
    case 1:
      b = s.charCodeAt(i) << 16
      x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar)
      break
    case 2:
      b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8)
      x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar)
      break
  }
  return x.join('')
}

export {
  base64Decode,
  base64Encode
}
