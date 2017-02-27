import React, { Component, PropTypes } from 'react'
import { Close, InlineForm, Label, Message, Space } from 'rebass'
import collectionStore, { getCollection, updateCollection, COLLECTION_STORE_CHANGE_EVENT } from '../stores/collectionStore'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.collectionName = this.props.collectionName || this.props.params.collectionName
    this.state = {
      collection: getCollection(this.collectionName)
    }
    updateCollection(this.collectionName)
  }
  render() {
    const items = this.state.collection ? this.state.collection.items || [] : []
    const objectElements = items.map(object => {
      if (typeof object === 'string') return <li key={object}>{object}</li>
      return (
        <li key={object.id}>
          <h3>{object.id}</h3>
          <p>{typeof object.content === 'string' ? object.content : JSON.stringify(object)}</p>
        </li>
      )
    })
    return (
      <div className="Authorize" style={{fontFamily: this.context.rebass.monospace}}>
        <Label>{this.collectionName}!</Label>
        <ol>
          {objectElements}
        </ol>
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    this.collectionName = nextProps.collectionName || nextProps.params.collectionName
  }
  onCollectionStoreChange() {
    this.setState({collection: getCollection(this.collectionName)})
  }
  componentDidMount() {
    collectionStore.on(COLLECTION_STORE_CHANGE_EVENT, this.onCollectionStoreChange.bind(this))
  }
  componentWillUnmount() {
    collectionStore.removeListener(COLLECTION_STORE_CHANGE_EVENT, this.onCollectionStoreChange.bind(this))
  }
}

Collection.contextTypes = {
  rebass: PropTypes.object
}
Collection.propTypes = {
  collectionName: PropTypes.string
}

export default Collection;
