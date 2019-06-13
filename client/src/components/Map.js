import React, { useState, useContext, useEffect } from 'react'
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import { withStyles } from '@material-ui/core/styles'
import differenceInMinutes from 'date-fns//difference_in_minutes'
// import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'
// import DeleteIcon from '@material-ui/icons/DeleteTwoTone'

import { useClient } from '../client'
import { GET_PINS_QUERY } from '../graphql/queries'
import PinIcon from './PinIcon'
import Blog from './Blog'
import Context from '../context'

// Amazon Spheres
const INITIAL_VIEWPORT = {
  latitude: 47.6155,
  longitude: -122.3395,
  zoom: 16
}

const Map = ({ classes }) => {
  const client = useClient()
  const { state, dispatch } = useContext(Context)
  useEffect(() => {
    getPins()
  }, [])
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  useEffect(() => {
    getUserPosition()
  }, [])

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    dispatch({
      type: 'GET_PINS',
      payload: getPins
    })
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' })
    }

    const [ longitude, latitude ] = lngLat

    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { 
        longitude,
        latitude
      }
    })
  }

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? 'limegreen' : 'darkblue'
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxApiAccessToken='pk.eyJ1IjoiYWxsZW53b29kcyIsImEiOiJjandvOGhqbzcwYnB6NDRueTJqMGFtd20yIn0.IsfCl5hr5_sZjzBOLs5b5A'
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Navigation Controls */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin for user's current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='red' />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color='hotpink' />
          </Marker>
        )}

        {/* Created Pins */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
          <PinIcon size={40} color={highlightNewPin(pin)} />
        </Marker>
        ))}
      </ReactMapGL>

      {/* Blog Area to add Pin Content */}
      <Blog />
    </div>
  )
}

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}

export default withStyles(styles)(Map)
