import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "./Map.css";
import { showDataOnMap, SetViewOnClick } from "./util";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import { useTheme } from '@material-ui/core/styles'

function Map({ countries, casesType, center, zoom, minZoom, country }) {
  const theme = useTheme();

  return (
    <div className='map' >
      <LeafletMap
        fullscreenControl={true}
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        bounceAtZoomLimits={true}
        maxBounds={[
          [90, -180],
          [-90, 180]
        ]}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showDataOnMap(countries, casesType, theme.palette.type)}
        <SetViewOnClick zoom={zoom} coords={center} country={country} />
      </LeafletMap>
    </div>
  );
}

export default Map;
