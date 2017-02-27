import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, IndexRoute, hashHistory } from 'react-router'
import App from './components/App.js'
import Home from './components/Home.js'
import Preferences from './components/Preferences.js'
import Collection from './components/Collection.js'

const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="preferences" component={Preferences} />
      <Route path="/collection/:collectionName" component={Collection} />
    </Route>
  </Router>
)

ReactDOM.render(router, document.getElementById('root'))
