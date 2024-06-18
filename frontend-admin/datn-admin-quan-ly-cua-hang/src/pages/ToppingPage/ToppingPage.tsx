import { NotFound } from '..'
import { ToppingFeature } from '~/features'
import { useGetAllToppingsQuery } from '~/store/services'
import { useState } from 'react'

const ToppingPage = () => {
  const [value, _] = useState({ _page: 1, _limit: 10, query: '' })
  const {
    isError: errorTopping,
    isFetching: fetchingTopping,
    data: toppingData
  } = useGetAllToppingsQuery({
    _page: value._page,
    _limit: value._limit
  })

  if (errorTopping || !toppingData) {
    return <NotFound />
  }

  if (fetchingTopping) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ToppingFeature data={toppingData.data} />
    </>
  )
}

export default ToppingPage
