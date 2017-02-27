import getUrlParameter from '../functions/getUrlParameter.js'
import { throttle, uniqBy } from 'lodash'
import EventEmitter from 'events'
const authStore = new EventEmitter()
export const AUTH_STORE_CHANGE_EVENT = 'authStore changed.'
const authorization = {}

if (getUrlParameter('action') === 'logout') logout()

const queryAccessToken = getUrlParameter('access_token')
const queryActorUrl = getUrlParameter('actor_url')
if (queryAccessToken) localStorage.setItem('accessToken', queryAccessToken)
if (queryActorUrl) localStorage.setItem('actorUrl', queryActorUrl)
const accessToken = queryAccessToken || localStorage.getItem('accessToken')
const actorUrl = queryActorUrl || localStorage.getItem('actorUrl')
try {var actorObject = JSON.parse(localStorage.getItem(actorUrl))} catch(e){}

if (accessToken && actorUrl) {
  authorization.accessToken = accessToken
  authorization.actorUrl = actorUrl
  if (actorObject) authorization.actorObject = actorObject
}

const unthrottledEmitChange = function unthrottledEmitChange() {
  authStore.emit(AUTH_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

export function getAuth() {
  const response = {}
  Object.keys(authorization).forEach(key => {
    if (typeof authorization[key] === 'string') response[key] = authorization[key]
    else if (typeof authorization[key] === 'number') response[key] = authorization[key]
    else if (typeof authorization[key] === 'object') response[key] = JSON.parse(JSON.stringify(authorization[key]))
  })
  if (!response || Object.keys(response).length <= 0) return null
  return response
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('actorUrl')
  localStorage.removeItem(authorization.actorUrl)
  delete authorization.actorUrl
  delete authorization.actorObject
  delete authorization.accessToken
}

//Object.freeze(authStore)
export default authStore
