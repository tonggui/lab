/*
 * @description
 *   Please write the fileUtils script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-08)
 */
export const handleFileChange = (cb, autoClear = true) => e => {
  e.preventDefault()
  let files
  if (e.dataTransfer) {
    files = e.dataTransfer.files
  } else if (e.target) {
    files = e.target.files
  }
  if (!files || files.length < 1) return

  const file = files[0]
  const reader = new FileReader()
  reader.onload = () => {
    if (cb) cb(reader.result, file.name)
  }
  reader.readAsDataURL(file)

  if (autoClear) {
    e.target.value = ''
  }
}
