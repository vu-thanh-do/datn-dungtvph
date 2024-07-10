import { useEffect, useRef } from 'react'
import '../../StyleMap.css'
import axios from 'axios'
import GeoLoCaTion from '../../utils/geolocation'
import ListStore, { Distance } from '../../interfaces/Map.type'
import { UseFormSetValue } from 'react-hook-form'
import { IUserCheckout } from '../../validate/Form'

interface LngLat {
  lng: number
  lat: number
}

const List: ListStore[] = [
  {
    highName: 'Trường Cao đẳng FPT Polytechnic',
    name: 'Trường Cao đẳng FPT Polytechnic, Tòa nhà FPT Polytechnic, Trịnh Văn Bô, Phương Canh, Nam Từ Liêm, Hà Nội',
    geoLocation: {
      lat: 21.038338774000067,
      lng: 105.74712340900004
    }
  }
]

interface Props {
  setGapStore?: React.Dispatch<React.SetStateAction<ListStore[]>>
  setPickGapStore?: React.Dispatch<React.SetStateAction<ListStore>>
  setValue: UseFormSetValue<IUserCheckout>
  // getValue: UseFormGetValues<IUserCheckout>
}

const getLocation = () => {
  if (!localStorage.getItem('userLocation')) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let location: LngLat = {
          lng: 0,
          lat: 0
        }
        location = {
          lng: position.coords.longitude,
          lat: position.coords.latitude
        }
        localStorage.setItem('userLocation', JSON.stringify(location))
      })
    }
  }
}

getLocation()

const YaSuoMap = ({ setValue, setGapStore, setPickGapStore }: Props) => {
  const { lnglat } = GeoLoCaTion()
  const map = useRef(document.createElement('script'))

  const getDistance = async (locate?: { lng: number; lat: number }) => {
    setTimeout(async () => {
      const controller = new AbortController()
      let StorageDistance = localStorage.getItem('location')
        ? JSON.parse(localStorage.getItem('location') as string)
        : JSON.parse(localStorage.getItem('userLocation') as string)

      if (locate) {
        StorageDistance = locate
      }

      await axios
        .get(
          `https://rsapi.goong.io/DistanceMatrix?origins=${StorageDistance?.lat ? StorageDistance.lat : lnglat.lat},${
            StorageDistance?.lng ? StorageDistance.lng : lnglat.lng
          }&destinations=${List[0].geoLocation.lat},${
            List[0].geoLocation.lng
          }&vehicle=car&api_key=BCLZh27rb6GtYXaozPyS16xbZoYw3E1STP7Ckg2P`,
          { signal: controller.signal }
        )
        .then(({ data: { rows } }) => {
          const fetchDistance: Distance[] = rows[0].elements
          const listDistance: ListStore[] = fetchDistance.map((item, index: number) => {
            return { ...List[index], ...item.distance }
          })

          const sortDistance = listDistance.sort((a, b) => {
            return (a.value ?? 0) - (b.value ?? 0)
          })

          if (setGapStore && setPickGapStore) {
            setGapStore(sortDistance)
            setPickGapStore(sortDistance[0])
          }
          controller.abort()
        })
    }, 1000)
  }

  const fillAddress = async (locate?: { lng: number; lat: number }) => {
    let geoDefault = JSON.parse(localStorage.getItem('userLocation') as string)
    if (locate) {
      geoDefault = locate
    }

    const controller = new AbortController()
    await axios
      .get(
        `https://rsapi.goong.io/Geocode?latlng=${geoDefault ? geoDefault.lat : lnglat.lat},${
          geoDefault ? geoDefault.lng : lnglat.lng
        }&api_key=BCLZh27rb6GtYXaozPyS16xbZoYw3E1STP7Ckg2P`,
        { signal: controller.signal }
      )
      .then(({ data: { results } }) => {
        setValue('shippingLocation', results[0].formatted_address)
        ;(document.querySelector<HTMLInputElement>('.mapboxgl-ctrl-geocoder--input')!.value =
          results[0].formatted_address),
          controller.abort()
      })
    if (!locate) {
      await getDistance()
    }
  }

  useEffect(() => {
    window.onload = () => {
      localStorage.removeItem('location')
    }

    document.querySelector('.mapboxgl-ctrl-geocoder--icon-search')?.remove()
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('placeholder', 'Địa chỉ người nhận')
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('name', 'shippingLocation')
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.setAttribute('autoComplete', 'off')
    document
      .querySelectorAll('.mapboxgl-ctrl-top-right .mapboxgl-ctrl-group')[1]
      ?.addEventListener('click', async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            await getDistance({ lng: position.coords.longitude, lat: position.coords.latitude })
            await fillAddress({ lng: position.coords.longitude, lat: position.coords.latitude })
          })
        }
      })
    document.querySelector('.mapboxgl-ctrl-geocoder--input')?.addEventListener('change', async (e: any) => {
      if (setValue) {
        setValue('shippingLocation', e.target.value)
      }
      await getDistance()
    })

    if (navigator.geolocation) {
      map.current.innerHTML = `
      goongjs.accessToken = "QG9FGuZksX4QOibtVKjBvv7dQcSLpbDqQnajow1S";
      var map = new goongjs.Map({
        container: 'mapCheckout',
        style: 'https://tiles.goong.io/assets/goong_map_web.json',
        center: [${lnglat.lng}, ${lnglat.lat}],
        zoom: 13
      });
      var geocoder = new GoongGeocoder({
        accessToken: "BCLZh27rb6GtYXaozPyS16xbZoYw3E1STP7Ckg2P"
        });

      var marker = new goongjs.Marker();
        geocoder.addTo('#geocoderCheckout');

        // Add geocoder result to container.
        geocoder.on('result', function ({result:{result:{geometry:{location}}}}) {
          marker.remove();
          localStorage.setItem("location",JSON.stringify(location))
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
          localStorage.removeItem("location")
        // results.innerText = '';
        });

      map.addControl(new goongjs.NavigationControl());
      map.addControl(
        new goongjs.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
      },
        trackUserLocation: true,
      })
      );
       map.on("load",()=>{
        if(localStorage.getItem("userLocation")){
          marker.remove();
          map.flyTo({
            center: [
              JSON.parse(localStorage.getItem('userLocation')).lng,
              JSON.parse(localStorage.getItem('userLocation')).lat,
            ],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
          });
          marker
            .setLngLat([
              JSON.parse(localStorage.getItem('userLocation')).lng,
              JSON.parse(localStorage.getItem('userLocation')).lat,])
              .addTo(map)
        }else{
          if (navigator.geolocation) {
            marker.remove();
            navigator.geolocation.getCurrentPosition((position) => {
                localStorage.setItem("userLocation",JSON.stringify(
                  {
                    lng:position.coords.longitude,
                    lat:position.coords.latitude
                  }
                ))
                map.flyTo({
                   center: [
                    position.coords.longitude,
                    position.coords.latitude
                   ],
                   essential: true // this animation is considered essential with respect to prefers-reduced-motion
               });
               marker
                 .setLngLat([position.coords.longitude,position.coords.latitude]).addTo(map)
            });
          }
        }

       }); `
    }
    if ((lnglat.lat > 0 && lnglat.lng > 0) || localStorage.getItem('userLocation')) {
      getDistance()
      fillAddress()
    }
    // getDistance()

    document.body.appendChild(map.current)
  }, [lnglat])
  return <></>
}

export default YaSuoMap
