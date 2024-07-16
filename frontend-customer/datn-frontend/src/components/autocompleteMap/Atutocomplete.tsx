import { useEffect, useRef } from 'react'
import './Autocomplete.scss'
import GeoLoCaTion from '../../utils/geolocation'
import { UseFormSetValue } from 'react-hook-form'

interface Props {
  setValue: UseFormSetValue<any>
  // getValues?: UseFormGetValues<any>
  address?: string
}

const Autocomplete = ({ setValue, address }: Props) => {
  const { lnglat } = GeoLoCaTion()
  const map = useRef(document.createElement('script'))

  const fillAddress = async () => {
    if (address) {
      setValue('address', address)
      document.querySelector<HTMLInputElement>('.mapboxgl-ctrl-geocoder--input')!.value = address
    }
    // const controller = new AbortController()
    // await axios
    //   .get(
    //     `https://rsapi.goong.io/Geocode?latlng=${lnglat.lat},${lnglat.lng}&api_key=BCLZh27rb6GtYXaozPyS16xbZoYw3E1STP7Ckg2P`,
    //     { signal: controller.signal }
    //   )
    //   .then(({ data: { results } }) => {
    //     setValue('address', results[0].formatted_address)
    //     ;(document.querySelector<HTMLInputElement>('.mapboxgl-ctrl-geocoder--input')!.value =
    //       results[0].formatted_address),
    //       controller.abort()
    //   })
  }

  useEffect(() => {
    window.onload = () => {
      localStorage.removeItem('addressDefault')
    }

    document.querySelector('.mapboxgl-ctrl-geocoder--icon-search')?.remove()
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('placeholder', 'Địa chỉ người nhận')
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('name', 'address')
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('autoComplete', 'off')
    // document
    //   .querySelectorAll('.mapboxgl-ctrl-top-right .mapboxgl-ctrl-group')[1]
    //   ?.addEventListener('click', async () => {
    //     localStorage.setItem('addressDefault', JSON.stringify(localStorage.getItem('userLocation')))
    //     await fillAddress()
    //   })
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.addEventListener('change', async (e: any) => {
      if (setValue) {
        setValue('address', e.target.value)
      }
    })

    map.current.innerHTML = `
      goongjs.accessToken = "QG9FGuZksX4QOibtVKjBvv7dQcSLpbDqQnajow1S";
      var map = new goongjs.Map({
        container: 'map',
      });
      var geocoder = new GoongGeocoder({
        accessToken: "BCLZh27rb6GtYXaozPyS16xbZoYw3E1STP7Ckg2P"
        });

      var marker = new goongjs.Marker();
        geocoder.addTo('#geocoder');

        // Add geocoder result to container.
        geocoder.on('result', function ({result:{result:{geometry:{location}}}}) {
          marker.remove();
          localStorage.setItem("addressDefault",JSON.stringify(location))
          marker
          .setLngLat([location.lng,
            location.lat])
          .addTo(map)
            map.flyTo({
              center: [
                location.lng,
                location.lat
              ],
              essential: true // this animation is considered essential with respect to prefers-reduced-motion
            })
        });

        // Clear results container when search is cleared.
        geocoder.on('clear', function () {
          localStorage.removeItem("addressDefault")
        // results.innerText = '';
        });`

    document.body.appendChild(map.current)
    fillAddress()
  }, [lnglat])
  return <></>
}

export default Autocomplete
