import React, { Component } from 'react'
import { Link } from 'react-router'
import { Arrow, Avatar, Block, Button, Dropdown, DropdownMenu, Heading, NavItem, Space, Text, Toolbar } from 'rebass'
import authStore, { getAuth, logout, AUTH_STORE_CHANGE_EVENT } from '../stores/authStore'
import preferenceStore, { getPrefs, makePrefs, PREF_STORE_CHANGE_EVENT } from '../stores/preferenceStore'

export default class Header extends Component {
  constructor() {
    super()
    const state = Object.assign(getPrefs() || makePrefs(), getAuth() || {})
    state.userDropdownIsDown = false
    this.state = state
  }
  render() {
    const userIsAuthorized = this.state.actorObject && this.state.actorUrl && typeof this.state.actorUrl === 'string'
    const actorObject = this.state.actorObject ? this.state.actorObject : {}
    const noUnderlineLinkStyle = {
      textDecoration: 'none',
      color: this.context.rebass.colors.midgray
    }
    const toolbarStyle = {
      height: 80,
      backgroundColor: this.context.rebass.white,
      fontFamily: this.context.rebass.monospace,
      color: this.context.rebass.colors.ocean,
      borderBottomWidth: 5,
      borderBottomStyle: 'solid',
      borderBottomColor: this.context.rebass.colors.primary
    }
    const collectionsNavItems = !Array.isArray(this.state.navbar) ? null : this.state.navbar.map(collectionName => {
      return <NavItem key={`collectionNav-${collectionName}`} is={Link} to={`collection/${collectionName}`}>{collectionName}</NavItem>
    })
    const collectionsNav = !collectionsNavItems ? null : (
      <div>
        {collectionsNavItems}
      </div>)
    const userAvatar = !userIsAuthorized ? null : (
      <div><Space x={1} />
        <Avatar circle size={48} src={actorObject.icon || "anonymous.png"} />
      </div>)
    const userToolbar = !userIsAuthorized ? null : (
      <div>
        <Dropdown>
          <Button onClick={this.toggleUserDropdown.bind(this)} backgroundColor="primary" color="white" inverted rounded >
            {actorObject.name || this.state.actorUrl} 
            <Arrow direction="down" /></Button>
          <DropdownMenu onDismiss={this.toggleUserDropdown.bind(this)} open={this.state.userDropdownIsDown}>
            <NavItem is={Link} to="preferences">Preferences</NavItem>
            <NavItem onClick={logout}>Logout</NavItem>
          </DropdownMenu>
        </Dropdown>
      </div>)
    return (
      <Toolbar style={toolbarStyle}>
        <Block is={Link} to="/" style={noUnderlineLinkStyle}>
          <Text style={{color:this.context.rebass.colors.primary}}>activitypub-client</Text>
        </Block><Space auto x={1} />
        {collectionsNav}{userToolbar}{userAvatar}
      </Toolbar>)
  }
  toggleUserDropdown() {
    this.setState({userDropdownIsDown: !this.state.userDropdownIsDown})
  }
  onPrefsChange() {
    this.setState(getPrefs() || makePrefs())
  }
  onAuthChange() {
    const auth = getAuth()
    if (auth && typeof auth === 'object') this.setState(auth)
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

Header.contextTypes = {
  rebass: React.PropTypes.object
}
