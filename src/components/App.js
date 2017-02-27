import React, { Component } from 'react'
import Header from './Header'

const monospace = '"SF Mono", "Roboto Mono", Menlo, Consolas, monospace'
const sansSerif = '-apple-system, BlinkMacSystemFont, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Lucida Grande", sans-serif'
const baseColors = {
  black: '#111',
  white: '#fff',
  gray: '#ddd',
  midgray: '#888',
  blue: '#08e',
  red: '#f52',
  orange: '#f70',
  green: '#1c7',
  gold: '#ffd54f',
  goldrush: '#fdb81e',
  ocean: '#126c9c'
}
const colors = {
  ...baseColors,
  primary: baseColors.red,
  secondary: baseColors.midgray,
  default: baseColors.black,
  info: baseColors.blue,
  success: baseColors.green,
  warning: baseColors.orange,
  error: baseColors.red
}

class App extends Component {
  static childContextTypes = {
    rebass: React.PropTypes.object
  }
  getChildContext () {
    return {
      rebass: {
        monospace,
        sansSerif,
        colors,
        Button: {
          backgroundColor: 'tomato'
        }
      }
    }
  }
  render() {
    //const children = React.Children.map(child => React.cloneElement(child))
    
    return (
      <div className="App" style={{fontFamily: sansSerif }}>
        <Header />
        <div className="app-children">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App;
