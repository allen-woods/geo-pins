import React, { Fragment } from 'react'

import Header from '../components/Header'
import Map from '../components/Map'
import withRoot from '../withRoot'

const App = () => {
  return (
    <Fragment>
      <Header />
      <Map />
    </Fragment>
  )
}

export default withRoot(App)
