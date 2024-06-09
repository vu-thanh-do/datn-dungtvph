import React from 'react'

const useScrollLock = () => {
  const lockScroll = React.useCallback(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = ''
  }, [])

  return {
    lockScroll,
    unlockScroll
  }
}

export default useScrollLock
