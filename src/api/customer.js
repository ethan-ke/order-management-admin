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
export function fetchCustomer(id) {
  return request({
    url: '/customers/' + id,
    method: 'get'
  })
}
export function bulkUpdateItem(data) {
  return request({
    url: '/customers/items/bulk-update',
    method: 'patch',
    data
  })
}
export function updateCustomer(id, data) {
  return request({
    url: '/customers/' + id,
    method: 'put',
    data
  })
}
export function createCustomer(data) {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}
