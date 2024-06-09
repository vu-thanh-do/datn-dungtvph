import { useEffect, useState } from 'react'

const GeoLoCaTion = () => {
  const [lnglat, setLngLat] = useState<{ lng: number; lat: number }>({
    lng: 0,
    lat: 0
  })
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLngLat({
            lng: position.coords.longitude,
            lat: position.coords.latitude
          })
        },
        () => {
          setLngLat({
            lng: 0,
            lat: 0
          })
        }
      )
    }
  }, [])
  return { lnglat, setLngLat }
}

export default GeoLoCaTion
