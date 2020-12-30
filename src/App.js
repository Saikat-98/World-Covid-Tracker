import React, { useState, useEffect } from 'react';
import { Card, MenuItem, FormControl, Select, CardContent, withWidth } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import './App.css'
import "leaflet/dist/leaflet.css"

function App ( props ) {
  const [ countries, setCountries ] = useState( [] )
  const [ country, setCountry ] = useState( "worldwide" )
  const [ countryInfo, setCountryInfo ] = useState( {} )
  const [ tableData, setTableData ] = useState( [] )
  const [ mapCenter, setMapCenter ] = useState( [ 0, 0 ] )
  const [ mapZoom, setMapZoom ] = useState( props.width === 'xs' ? 2 : 3 )
  const [ mapCountries, setMapCountries ] = useState( [] )
  const [ casesType, setCasesType ] = useState( "cases" )

  useEffect( () => {
    fetch( "https://disease.sh/v3/covid-19/all" )
      .then( response => response.json() )
      .then( data => {
        setCountryInfo( data )
      } )
  }, [] )

  useEffect( () => {
    const getCountriesData = async () => {
      await fetch( "https://disease.sh/v3/covid-19/countries" )
        .then( response => response.json() )
        .then( data => {
          const countries = data.map( country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ) )
          const sortedData = sortData( data )
          setTableData( sortedData )
          setMapCountries( data )
          setCountries( countries )
        } )
    }
    getCountriesData()
  }, [] )

  const onCountryChange = async ( event ) => {
    let countryCode = event.target.value
    setCountry( countryCode )

    const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${ countryCode }`
    await fetch( url )
      .then( response => response.json() )
      .then( data => {
        if ( countryCode === 'worldwide' )
          setMapCenter( [ 0, 0 ] )
        else
          setMapCenter( [ data.countryInfo.lat, data.countryInfo.long ] )
        setCountryInfo( data )
        setMapZoom( props.width === 'xs' ? 2 : 3 )
      } )
  }

  return (
    <div className="app" >
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={ country } onChange={ onCountryChange }>
              <MenuItem value="worldwide">WorldWide</MenuItem>
              { countries.map( ( country, index ) =>
                <MenuItem key={ `country-dropdown-${ index }` } value={ country.value }>{ country.name }</MenuItem>
              ) }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isRed active={ casesType === "cases" } title="Cases" cases={ prettyPrintStat( countryInfo.todayCases ) } total={ prettyPrintStat( countryInfo.cases ) } onClick={ e => setCasesType( "cases" ) } />
          <InfoBox isGreen active={ casesType === "recovered" } title="Recovered" cases={ prettyPrintStat( countryInfo.todayRecovered ) } total={ prettyPrintStat( countryInfo.recovered ) } onClick={ e => setCasesType( "recovered" ) } />
          <InfoBox isOrange active={ casesType === "deaths" } title="Deaths" cases={ prettyPrintStat( countryInfo.todayDeaths ) } total={ prettyPrintStat( countryInfo.deaths ) } onClick={ e => setCasesType( "deaths" ) } />
        </div>

        <Map center={ mapCenter } zoom={ mapZoom } countries={ mapCountries } casesType={ casesType } minZoom={ mapZoom } />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={ tableData } />
          <h3 className="app__graphTitle">Worldwide new { casesType }</h3>
          <LineGraph className="app__graph" casesType={ casesType } />
        </CardContent>
      </Card>

    </div >
  );
}

export default withWidth()( App );
