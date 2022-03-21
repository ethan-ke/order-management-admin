import request from '@/utils/request'
import qs from 'qs'

export function getMerchants() {
  return request({
    url: 'merchants',
    method: 'get'
  })
}
export function getMerchant(id) {
  return request({
    url: '/merchants/' + id,
    method: 'get'
  })
}
export function queryLogs(query) {
  return request({
    url: '/query-logs',
    method: 'get',
    params: {
      filter: {
        merchant_id: query.merchant_id
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
export function updateMerchant(id, data) {
  return request({
    url: '/merchants/' + id,
    method: 'patch',
    data
  })
}
