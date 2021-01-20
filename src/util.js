import React from "react";
import numeral from "numeral";
import { Circle, Popup, useMap } from "react-leaflet";


export const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    half_op: "rgba(204,16,52,0.5)",
    multiplier: 300,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,29)",
    half_op: "rgba(125,215,29,0.5)",
    multiplier: 400,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(258,68,67)",
    half_op: "rgba(258,68,67,0.5)",
    multiplier: 1200,
  }
};

export const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) return -1;
    return 1;
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, caseType, theme) => {

  data.sort((a, b) => {
    if (a[caseType] > b[caseType]) return -1;
    return 1;
  });

  const topFiveCountries = data.slice(0, 5).map((e) => e.countryInfo.iso3);

  return data.map((country, index) => {
    return (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        key={`map-circle-${caseType}-${index}`}
        fillOpacity={0.4}
        color={casesTypeColors[caseType].hex}
        fillColor={casesTypeColors[caseType].hex}
        radius={Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier}
        className={`${topFiveCountries.includes(country.countryInfo.iso3) ? "map__circle" : null} `}>

        <Popup className={theme === 'dark' ? 'dark--popup' : null}>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className={theme === 'dark' ? 'info-name dark--name' : 'info-name'}>{country.country}</div>
            <div className={theme === 'dark' ? "info-cases dark--cases" : "info-cases"}>
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className={theme === 'dark' ? "info-recovered dark--recovered" : "info-recovered"}>
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className={theme === 'dark' ? "info-deaths dark--deaths" : "info-deaths"}>
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    );
  });
};

export function SetViewOnClick({ coords, zoom, country }) {
  const map = useMap();
  if (country === "worldwide")
    map.setView([0, 0], 3);
  else
    map.setView(coords, zoom);
  return null;
}