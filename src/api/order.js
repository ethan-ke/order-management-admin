import request from '@/utils/request'
import qs from 'qs'

export function getOrders(query) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      filter: {
        merchant_id: query.merchant_id,
        phone: query.phone,
        room_number: query.room_number
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
export function getOrder(id) {
  return request({
    url: '/orders/' + id,
    method: 'get'
  })
}
export function updateOrder(id, data) {
  return request({
    url: '/orders/' + id,
    method: 'patch',
    data
  })
}
