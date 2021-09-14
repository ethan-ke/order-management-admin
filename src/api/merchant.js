import request from '@/utils/request'
import qs from 'qs'

export function getMerchants(query) {
  return request({
    url: 'merchants',
    method: 'get',
    params: {
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}

export function getMerchant(id) {
  return request({
    url: '/merchants/' + id,
    method: 'get'
  })
}
export function updateMerchant(id, data) {
  return request({
    url: '/merchants/' + id,
    method: 'patch',
    data
  })
}
