import React, { Component, PropTypes } from 'react'
import Authorize from './Authorize'
import Preferences from './Preferences'
import Collection from './Collection'
import authStore, { getAuth, AUTH_STORE_CHANGE_EVENT } from '../stores/authStore'
import preferenceStore, { getPrefs, PREF_STORE_CHANGE_EVENT } from '../stores/preferenceStore'



class Home extends Component {
  constructor() {
    super()
    const prefs = getPrefs()
    const homepageIsSet = prefs && typeof prefs === 'object' && prefs.homepage ? true : false
    this.state = {
      isAuthorized: getAuth() ? true : false,
      homepageIsSet: homepageIsSet,
      homepageCollection: homepageIsSet ? prefs.homepage : null
    }
  }
  render() {
    if (!this.state.isAuthorized) {
      return <Authorize />
    } else if (!this.state.homepageIsSet) {
      return <Preferences />
    } else {
      return <Collection collectionName={this.state.homepageCollection} />
    }
  }
  onPrefsChange() {
    const prefs = getPrefs()
    const homepageIsSet = typeof prefs === 'object' && prefs.homepage ? true : false
    this.setState({homepageIsSet: homepageIsSet, homepageCollection: homepageIsSet ? prefs.homepage : null})
  }
  onAuthChange() {
    this.setState({isAuthorized: getAuth() ? true : false})
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

Home.contextTypes = {
  rebass: PropTypes.object
}

export default Home;

