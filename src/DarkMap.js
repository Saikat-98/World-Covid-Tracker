import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "./Map.css";
import { showDataOnMap, SetViewOnClick } from "./util";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import { useTheme } from '@material-ui/core/styles'

function DarkMap ( { countries, casesType, center, zoom, minZoom } ) {
  const theme = useTheme();

  return (
    <div className='map dark--map' >
      <LeafletMap
        fullscreenControl={ true }
        center={ center }
        zoom={ zoom }
        minZoom={ minZoom }
        maxBounds={ [
          [ 90, -180 ],
          [ -90, 180 ]
        ] }
      >
        <TileLayer url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png' />
        { showDataOnMap( countries, casesType, theme.palette.type ) }
        <SetViewOnClick zoom={ zoom } coords={ center } />
      </LeafletMap>
    </div>
  );
}

export default DarkMap;
