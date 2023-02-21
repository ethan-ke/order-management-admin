import request from '@/utils/request'

export function fetchGirls() {
  return request({
    url: 'girls',
    method: 'get'
  })
}
export function fetchGirl(id) {
  return request({
    url: '/girls/' + id,
    method: 'get'
  })
}
export function updateGirl(id, data) {
  return request({
    url: '/girls/' + id,
    method: 'put',
    data
  })
}
export function createGirl(data) {
  return request({
    url: '/girls',
    method: 'post',
    data
  })
}
