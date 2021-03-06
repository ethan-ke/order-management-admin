import Cookies from 'js-cookie'

const TokenKey = 'access_token'

export function getAccessToken() {
  return Cookies.get(TokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(TokenKey, token, { expires: 15 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
