import FileUpload from './file-upload'
import withPromiseEmit from '@/hoc/withPromiseEmit'

export { UPLOAD_STATUS } from './constants'

export default withPromiseEmit(FileUpload)
