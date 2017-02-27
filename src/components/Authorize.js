import React, { Component } from 'react'
import { Close, InlineForm, Label, Message, Space } from 'rebass'
const lib = require('lib')
import url from 'url'
import querystring from 'querystring'

class Authorize extends Component {
  constructor() {
    super()
    this.state = {
      actorUrl: '',
      err: null,
      actorProgress: 'notStarted',
      actor: null
    }
  }
  render() {
    let labelText = ''
    switch (this.state.actorProgress) {
      case 'noOAuth':
        labelText = 'The actor object must include the key "oauthClientAuthorize".'
        break;
      case 'waitingOnStdLib':
        labelText = 'Searching for the actor object...'
        break;
      case 'failed':
        labelText = 'A valid actor object was not found at that URL.'
        break;
      case 'success':
        labelText = 'Found your actor object!'
        break;
      default:
        labelText = 'Type your actor URL and click "Go"'
    }
    const message = typeof this.state.err === 'string' 
      ? (<Message inverted rounded theme="error"> {this.state.err || 'unknown error'} <Space auto x={1} /> </Message>) 
      : null
    return (
      <div className="Authorize" style={{fontFamily: this.context.rebass.monospace}}>
        <h2> Authorize </h2>
        {message}
        <InlineForm
          buttonLabel="Go"
          label="Actor"
          name="actor_form"
          onChange={this.onActorFormChange.bind(this)}
          onClick={this.onActorFormClick.bind(this)}
        />
        <Label>{labelText}</Label>
      </div>
    )
  }
  onActorFormChange(a) {
    this.setState({actorUrl: a.target.value, actorProgress: 'notStarted'})
  }
  onActorFormClick(a) {
    a.preventDefault()
    const actorUrl = this.state.actorUrl
    this.setState({actorProgress: 'waitingOnStdLib'})
    lib.brooksn.activitypubDiscovery({actor: actorUrl}, (err, res) => {
      if (err) return this.setState({err, actorProgress: 'failed'})
      const actor = res

      if (!actor.oauthClientAuthorize) return this.setState({actor: res, actorProgress: 'noOAuth'})
      this.setState({actor: res, actorProgress: 'success'})
      const u = url.parse(actor.oauthClientAuthorize)
      const redirect_url = url.parse(process.env.REACT_APP_REDIRECT_URI)
      const thisQueryStringObject = redirect_url.query ? Object.assign(querystring.parse(redirect_url.query, {actor_url: actorUrl})) : {actor_url: actorUrl}
      const thisQueryString = querystring.stringify(thisQueryStringObject)
      redirect_url.query = thisQueryString
      redirect_url.search = '?' + thisQueryString
      const redirectUrlString = url.format(redirect_url)

      const qs = querystring.stringify({client_id: process.env.REACT_APP_CLIENT_ID, state:'pumpkinpie', scope: 'read,post,create', redirect_uri: redirectUrlString})
      
      u.query = qs
      u.search = '?' + qs
      const authUrl = url.format(u)
      localStorage.setItem(actorUrl, JSON.stringify(actor))
      window.location = authUrl
    })
  }
}

Authorize.contextTypes = {
  rebass: React.PropTypes.object
}

export default Authorize;
