import request from '@/utils/request'
import qs from 'qs'

export function getOrders(query) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      filter: {
        title: query.title,
        status: query.status
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
