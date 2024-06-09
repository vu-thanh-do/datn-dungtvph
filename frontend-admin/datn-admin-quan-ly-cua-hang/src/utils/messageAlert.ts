import { message } from 'antd'
export const messageAlert = (textValue: string, type: 'success' | 'error', duration = 2) => {
  type === 'success' ? message.success(textValue, duration) : message.error(textValue)
}
