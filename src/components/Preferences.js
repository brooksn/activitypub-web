import React, { Component, PropTypes } from 'react'
import { InlineForm, Label, Message, Space } from 'rebass'
import authStore, { getAuth, AUTH_STORE_CHANGE_EVENT } from '../stores/authStore'
import preferenceStore, { addNavbarCollection, getPrefs, makePrefs, removeNavbarCollection, setHomepage, PREF_STORE_CHANGE_EVENT } from '../stores/preferenceStore'
const excludedActorFields = ['@context', 'type', 'icon', 'id', 'name', 'oauthClientAuthorize']
class Preferences extends Component {
  constructor(props) {
    super(props)
    const state = getPrefs() || makePrefs()
    const auth = getAuth()
    if (auth && typeof auth === 'object' && auth.actorObject && auth.actorUrl) {
      state.actorObject = auth.actorObject
      state.actorUrl = auth.actorUrl
    }
    this.state = state
  }
  render() {
    let navbarOptions = null
    let homepageOptions = null
    const collections = !this.state.actorObject ? null : Object.keys(this.state.actorObject).filter(key => {
      if (typeof this.state.actorObject[key] !== 'string') return false
      if (excludedActorFields.indexOf(key) >= 0) return false
      return true
    })
    if (collections) {
      navbarOptions = collections.map(key => {
        const checked = this.state.navbar.indexOf(key) >= 0 ? true : false
        return (<span key={`navbarOpt-${key}`}><br /><input checked={checked} name={key} type="checkbox" onChange={this.handleNavCheckChange.bind(this)} />{key}</span>)
      })
      homepageOptions = collections.map(key => {
        const selected = this.state.homepage === key
        return (<span key={`homepageOpt-${key}`}><br /><input checked={selected} name={key} type="radio" onChange={this.handleHomepageCheckChange.bind(this)} />{key}</span>)
      })
    }
    const navbarDiv = !navbarOptions ? null : (
      <div>
        <Label>Select which collections to display in the navigation bar:</Label>
        {navbarOptions}
      </div>
    )
    const homepageDiv = !navbarOptions ? null : (
      <div>
        <Label>Select which collections to display as the home page:</Label>
        {homepageOptions}
      </div>
    )
    return (
      <div className="Preferences" style={{fontFamily: this.context.rebass.monospace}}>
        <h3>Set a few preferences. </h3>
          {navbarDiv}
          {homepageDiv}
      </div>
    )
  }
  handleHomepageCheckChange(a) {
    if (a.target.checked === true) setHomepage(a.target.name)
  }
  handleNavCheckChange(a) {
    if (a.target.checked === true) addNavbarCollection(a.target.name)
    else if (!a.target.checked) removeNavbarCollection(a.target.name)
  }
  onPrefsChange() {
    this.setState(getPrefs() || makePrefs())
  }
  onAuthChange() {
    const auth = getAuth()
    if (auth && typeof auth === 'object' && auth.actorObject && auth.actorUrl) {
      this.setState({actorObject: auth.actorObject, actorUrl: auth.actorUrl})
    }

  }
  componentDidMount() {
    authStore.on(AUTH_STORE_CHANGE_EVENT, this.onAuthChange.bind(this))
    preferenceStore.on(PREF_STORE_CHANGE_EVENT, this.onPrefsChange.bind(this))
  }
  componentWillUnmount() {
    authStore.removeListener(AUTH_STORE_CHANGE_EVENT, this.onAuthChange.bind(this))
    preferenceStore.removeListener(PREF_STORE_CHANGE_EVENT, this.onPrefsChange.bind(this))
  }
}

Preferences.contextTypes = {
  rebass: PropTypes.object
}

export default Preferences;
