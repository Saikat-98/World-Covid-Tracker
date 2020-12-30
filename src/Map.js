import React from 'react'
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet'
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js'
import './Map.css'
import { showDataOnMap } from './util'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'


function Map ( { countries, casesType, center, zoom, minZoom, ...props } ) {
  return (
    <div className="map">
      <LeafletMap fullscreenControl={ true } center={ center } zoom={ zoom } minZoom={ minZoom } maxBounds={ [ [ 90, -180 ], [ -90, 180 ] ] }>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { showDataOnMap( countries, casesType ) }
      </LeafletMap>
    </div>
  )
}

export default Map
