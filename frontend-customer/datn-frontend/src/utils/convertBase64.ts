import { RcFile } from 'antd/es/upload'

function convertToBase64(file: File | RcFile) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export default convertToBase64
