import request from '@/utils/request'
import qs from 'qs'

export function fetchCustomers(query) {
  return request({
    url: 'customers',
    method: 'get',
    params: {
      filter: {
        name: query.name,
        phone: query.phone
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
