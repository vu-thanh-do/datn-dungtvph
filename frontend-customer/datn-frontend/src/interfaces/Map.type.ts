interface ListStore {
  highName: string
  name: string
  geoLocation: {
    lat: number
    lng: number
  }
  text?: string
  value?: number
}

export interface Distance {
  distance: {
    text: string
    value: number
  }
}

export default ListStore
