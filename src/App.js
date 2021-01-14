import React, { useState, useEffect } from "react";
import {
  Card,
  MenuItem,
  FormControl,
  Select,
  CardContent,
  withWidth
} from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import InfoBox from "./InfoBox";
import Map from "./Map";
import DarkMap from './DarkMap';
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./util";
import "./App.css";
import "leaflet/dist/leaflet.css";

import FlashOffSharpIcon from '@material-ui/icons/FlashOffSharp'
import FlashOnSharpIcon from '@material-ui/icons/FlashOnSharp';

function App ( props ) {

  const [ countries, setCountries ] = useState( [] );
  const [ country, setCountry ] = useState( "worldwide" );
  const [ countryInfo, setCountryInfo ] = useState( {} );
  const [ tableData, setTableData ] = useState( [] );
  const [ mapCenter, setMapCenter ] = useState( [ 0, 0 ] );
  const [ mapZoom, setMapZoom ] = useState( props.width === "xs" ? 2 : 3 );
  const [ mapCountries, setMapCountries ] = useState( [] );
  const [ casesType, setCasesType ] = useState( "cases" );
  const [ darkState, setDarkState ] = useState( false );


  const palleteType = darkState ? "dark" : "light";
  const theme = createMuiTheme( {
    palette: {
      type: palleteType,
    }
  } );

  useEffect( () => {
    fetch( "https://disease.sh/v3/covid-19/all" )
      .then( ( response ) => response.json() )
      .then( ( data ) => {
        setCountryInfo( data );
      } );
  }, [] );

  useEffect( () => {
    const getCountriesData = async () => {
      await fetch( "https://disease.sh/v3/covid-19/countries" )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
          const countries = data.map( ( country ) => ( {
            name: country.country,
            value: country.countryInfo.iso2,
          } ) );
          const sortedData = sortData( data );
          setTableData( sortedData );
          setMapCountries( data );
          setCountries( countries );
        } );
    };
    getCountriesData();
  }, [] );

  const onCountryChange = async ( event ) => {
    let countryCode = event.target.value;
    setCountry( countryCode );

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${ countryCode }`;
    await fetch( url )
      .then( ( response ) => response.json() )
      .then( ( data ) => {
        if ( countryCode === "worldwide" ) setMapCenter( [ 0, 0 ] );
        else setMapCenter( [ data.countryInfo.lat, data.countryInfo.long ] );
        setCountryInfo( data );
        if ( countryCode === "worldwide" )
          setMapZoom( props.width === 'xs' ? 2 : 3 )
        else
          setMapZoom( props.width === 'xs' ? 3 : 5 )
      } );
  };

  return (
    <ThemeProvider theme={ theme }>
      <div className={ theme.palette.type === 'dark' ? 'app dark--main' : "app" }>
        <div className="app__left">
          <div className="app__header">
            <h1 className="app__header__text">COVID-19 TRACKER</h1>

            <ToggleButton
              value={ darkState }
              selected={ darkState }
              onChange={ () => setDarkState( !darkState ) }
            >
              { darkState && <FlashOnSharpIcon /> }
              { !darkState && <FlashOffSharpIcon /> }
            </ToggleButton>

            <FormControl className={ theme.palette.type === 'light' ? "app__dropdown" : "app__dropdown dark--dropdown" }>
              <Select
                variant="outlined"
                value={ country }
                className={ theme.palette.type === 'light' ? "select" : "select dark--select" }
                onChange={ onCountryChange }
              >
                <MenuItem value="worldwide">WorldWide</MenuItem>
                { countries.map( ( country, index ) => (
                  <MenuItem
                    key={ `country-dropdown-${ index }` }
                    value={ country.value }>
                    {country.name }
                  </MenuItem>
                ) ) }
              </Select>
            </FormControl>
          </div>

          <div className="app__stats" >
            <InfoBox
              isRed
              active={ casesType === "cases" }
              title="Cases"
              cases={ prettyPrintStat( countryInfo.todayCases ) }
              total={ prettyPrintStat( countryInfo.cases ) }
              onClick={ () => setCasesType( "cases" ) }
            />
            <InfoBox
              isGreen
              active={ casesType === "recovered" }
              title="Recovered"
              cases={ prettyPrintStat( countryInfo.todayRecovered ) }
              total={ prettyPrintStat( countryInfo.recovered ) }
              onClick={ () => setCasesType( "recovered" ) }
            />
            <InfoBox
              isOrange
              active={ casesType === "deaths" }
              title="Deaths"
              cases={ prettyPrintStat( countryInfo.todayDeaths ) }
              total={ prettyPrintStat( countryInfo.deaths ) }
              onClick={ () => setCasesType( "deaths" ) }
            />
          </div>

          { theme.palette.type === 'light' ? <Map
            center={ mapCenter }
            zoom={ mapZoom }
            countries={ mapCountries }
            casesType={ casesType }
            minZoom={ mapZoom }
          /> : <DarkMap
              center={ mapCenter }
              zoom={ mapZoom }
              countries={ mapCountries }
              casesType={ casesType }
              minZoom={ mapZoom }
            /> }
        </div>

        <Card className={ theme.palette.type === 'dark' ? 'app__right dark--right' : "app__right" }>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={ tableData } />
            <h3 className="app__graphTitle">Worldwide new { casesType }</h3>
            <LineGraph className="app__graph" casesType={ casesType } theme={ theme.palette.type } />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default withWidth()( withStyles( { withTheme: true } )( App ) );
