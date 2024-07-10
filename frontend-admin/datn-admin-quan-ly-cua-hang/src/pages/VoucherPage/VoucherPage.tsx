import { useGetAllVouchersQuery } from '~/store/services'
import { NotFound } from '..'
import VoucherFeature from '~/features/Voucher/Voucher'
import Loading from '~/components/Loading/Loading'

const VoucherPage = () => {
  const { isError: errorVoucher, isFetching: fetchingVoucher, data: voucherData } = useGetAllVouchersQuery(0)

  if (errorVoucher || !voucherData) {
    return <NotFound />
  }
  if (fetchingVoucher) {
    return <Loading />
  }
  return (
    <>
      {/* <VoucherFeature data={voucherData.data.docs} /> */}
      <VoucherFeature />
    </>
  )
}

export default VoucherPage
