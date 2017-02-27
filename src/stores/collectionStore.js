import 'whatwg-fetch'
import getUrlParameter from '../functions/getUrlParameter.js'
import { throttle } from 'lodash'
import authStore, { AUTH_STORE_CHANGE_EVENT, getAuth } from './authStore'
import EventEmitter from 'events'
const collectionStore = new EventEmitter()
export const COLLECTION_STORE_CHANGE_EVENT = 'collectionStore changed.'
const collections = {}

const unthrottledEmitChange = function unthrottledEmitChange() {
  collectionStore.emit(COLLECTION_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

export function getCollection(collectionName) {
  const auth = getAuth()
  if (!collections[auth.actorUrl] || typeof collections[auth.actorUrl] !== 'object') return null
  if (!collections[auth.actorUrl][collectionName] || typeof collections[auth.actorUrl][collectionName] !== 'object') return null
  return collections[auth.actorUrl][collectionName]
}

export function updateCollection(collectionName) {
  const auth = getAuth()
  if (!auth.actorObject || !auth.actorObject[collectionName]) return;
  const opts = {headers: {Authorization: `bearer ${auth.accessToken}`}}
  const y = 'http://localhost:3030/outbox/brooks'
  const z = auth.actorObject[collectionName]
  fetch(auth.actorObject[collectionName], opts).then(res => res.json())
  .then(json => {
    if (!collections[auth.actorUrl] || typeof collections[auth.actorUrl] !== 'object') collections[auth.actorUrl] = {}
    collections[auth.actorUrl][collectionName] = json
    emitChange()
  })
}


//Object.freeze(collectionStore)
export default collectionStore
