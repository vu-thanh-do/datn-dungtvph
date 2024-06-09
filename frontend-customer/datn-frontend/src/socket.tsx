import { Socket, io } from 'socket.io-client'
import { IOrderCheckout } from './store/slices/types/order.type'

const socket: Socket = io('ws://localhost:8000', {
  transports: ['websocket', 'pulling', 'flashsocket']
})

interface Options {
  room?: string
  status?: string
}

export const ClientSocket = {
  JoinRoom: (id: string) => {
    socket.connect()
    socket.emit('join', id)
  },
  Disconnect: () => {
    socket.disconnect()
  },
  createOrder: (data: IOrderCheckout) => {
    socket.emit('client:createOrder', data)
  },
  cancelOrder: (id: string) => {
    socket.emit('client:cancelOrder', id)
  },
  getOrderUser: (setOrderUser: React.Dispatch<any>, options: Options) => {
    socket.emit('client:requestOrderUser', options)
    socket.on('server:loadOrderUser', (data) => {
      setOrderUser(data.filter((item: any) => item.status === options.status)?.reverse())
    })
    return () => {
      socket.disconnect()
    }
  },
  sendNotification: ({ idUser, idOrder, content }: { idUser: string; idOrder: string; content: string }) => {
    socket.emit('client:sendNotification', { idOrder, content, idUser, to: 'user' })
  },
  sendNotificationToAdmin: (content: string) => {
    socket.emit('client:sendNotificationToAdmin', { content, to: 'admin' })
  },
  getNotification: (setNotification: React.Dispatch<any>, notification: any[]) => {
    // socket.emit('client:requestNotification')
    socket.on('server:sendNotification', (data) => {
      setNotification([data, ...notification])
    })
  },
  getUnreadNotificationsByidUser: (setNotification: React.Dispatch<any>, idUser: string) => {
    socket.emit('client:requestUnreadNotificationByidUser', idUser)
    socket.on('server:loadUnreadNotificationByidUser', ({ data }) => {
      data && data.length > 0 ? setNotification([...data]) : setNotification([])
    })
  }
}
