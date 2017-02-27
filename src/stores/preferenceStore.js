import { throttle } from 'lodash'
import authStore, { AUTH_STORE_CHANGE_EVENT, getAuth } from './authStore'
import EventEmitter from 'events'
const preferenceStore = new EventEmitter()
export const PREF_STORE_CHANGE_EVENT = 'preferenceStore changed.'
export const makePrefs = obj =>  Object.assign({navbar: [], homepage: null}, obj || {})
let navbar = []
let homepage = null
let actorUrl = ''

const unthrottledEmitChange = function unthrottledEmitChange() {
  localStorage.setItem(`${actorUrl}_preference`, JSON.stringify(getPrefs()))
  preferenceStore.emit(PREF_STORE_CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 100)

getActor()

function getActor() {
  const auth = getAuth()
  if (auth && auth.actorUrl && auth.actorUrl !== actorUrl) {
    actorUrl = auth.actorUrl
    retrievePreferences()
    emitChange()
  }
}

authStore.on(AUTH_STORE_CHANGE_EVENT, getActor)


function retrievePreferences() {
  if (!actorUrl) return;
  try {
    let userPrefsObj = JSON.parse(localStorage.getItem(`${actorUrl}_preference`))
    if (userPrefsObj && typeof userPrefsObj === 'object') {
      if (Array.isArray(userPrefsObj.navbar)) navbar = userPrefsObj.navbar
      if (typeof userPrefsObj.homepage === 'string') homepage = userPrefsObj.homepage
    }
  } catch(e) {}
}

export function getPrefs() {
  if (!actorUrl) return null;
  return {navbar: navbar.filter(a => typeof a === 'string'), homepage: (typeof homepage === 'string' ? homepage : null)}
}

export function addNavbarCollection(collectionName) {
  if (!Array.isArray(navbar) || navbar.length === 0) {
    navbar = [collectionName]
    emitChange()
  } else if(navbar.indexOf(collectionName) < 0) {
    navbar.push(collectionName)
    emitChange()
  }
}

export function removeNavbarCollection(collectionName) {
  if (!Array.isArray(navbar) || navbar.length === 0) return;
  const i = navbar.indexOf(collectionName)
  if (i >= 0) {
    navbar.splice(i,1)
    emitChange()
  }
}

export function setHomepage(collectionName) {
  
  if (typeof collectionName !== 'string') return;
  if (homepage !== collectionName) {
    homepage = collectionName
    emitChange()
  }
}

//Object.freeze(preferenceStore)
export default preferenceStore
