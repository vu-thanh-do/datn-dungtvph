import omitBy from 'lodash/omitBy'
import { ProductListConfig } from '../interfaces/products.type'
import useQueryParam from './useQueryParam'
import isUndefined from 'lodash/isUndefined'

export type IQueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  const queryParams: IQueryConfig = useQueryParam()

  const queryConfig: IQueryConfig = omitBy(
    {
      _page: queryParams._page || 1,
      limit: queryParams.limit || 12,
      searchName: queryParams.searchName,
      c: queryParams.c || ''
    },
    isUndefined
  )
  return queryConfig
}
