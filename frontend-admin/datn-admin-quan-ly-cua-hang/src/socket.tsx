import { Socket, io } from 'socket.io-client'

const socket: Socket = io('ws://localhost:8000', {
  transports: ['websocket', 'pulling', 'flashsocket']
})

interface Options {
  page: number
  limit: number
  startDate: string
  endDate: string
  room: string
}

export const ClientSocket = {
  JoinRoom: (id: string) => {
    socket.connect()
    socket.emit('join', id)
  },
  Disconnect: () => {
    socket.disconnect()
  },
  getAllOrder: (setAllOrder: React.Dispatch<React.SetStateAction<undefined>>) => {
    socket.emit('client:requestAllOrder', '')
    socket.on('server:loadAllOrder', (data) => {
      setAllOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },

  getPendingOrder: (setPendingOrder: React.Dispatch<React.SetStateAction<undefined>>, options: Options) => {
    socket.emit('client:requestPendingOrder', options)
    socket.on('server:loadPendingOrder', (data) => {
      setPendingOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },

  getCancelOrder: (setCancelOrder: React.Dispatch<React.SetStateAction<undefined>>, options: Options) => {
    socket.emit('client:requestCancelOrder', options)
    socket.on('server:loadCancelOrder', (data) => {
      setCancelOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },

  cancelOrder: (id: string) => {
    socket.emit('client:cancelOrder', id)
  },

  confirmOrder: (id: string) => {
    socket.emit('client:confirmedOrder', id)
  },

  doneOrder: (id: string) => {
    socket.emit('client:doneOrder', id)
  },

  getDeliveredOrder: (setDeliveredOrder: React.Dispatch<React.SetStateAction<undefined>>) => {
    socket.emit('client:requestDeliveredOrder', '')
    socket.on('server:loadDeliveredOrder', (data) => {
      setDeliveredOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },

  getConfirmedOrder: (setConfirmedOrder: React.Dispatch<any>, options: Options) => {
    socket.emit('client:requestConfirmedOrder', options)
    socket.on('server:loadConfirmedOrder', (data) => {
      setConfirmedOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },

  getDoneOrder: (setDoneOrder: React.Dispatch<any>, options: Options) => {
    socket.emit('client:requestDoneOrder', options)
    socket.on('server:loadDoneOrder', (data) => {
      setDoneOrder(data)
    })
    return () => {
      socket.disconnect()
    }
  },
  sendNotification: ({ idUser, idOrder, content }: { idUser: string; idOrder: string; content: string }) => {
    socket.emit('client:sendNotification', { idUser, idOrder, content, to: 'user' })
  },
  getUnReadNotification: (setNotification: React.Dispatch<any>) => {
    socket.emit('client:requestUnReadNotificationToAdmin')
    socket.on('server:loadUnreadNotificationToAdmin', ({ data }) => {
      data && data.length > 0 ? setNotification([...data]) : setNotification([])
    })
  }
}
