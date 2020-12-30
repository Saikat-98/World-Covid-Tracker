import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'
import { casesTypeColors } from './util'

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 0
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function ( tooltipItem, data ) {
        return numeral( tooltipItem.value ).format( "+0,0" )
      }
    }
  },
  scales: {
    xAxes: [ {
      type: "time",
      time: {
        format: "MM/DD/YY",
        tooltipFormat: "ll"
      }
    } ],
    yAxes: [ {
      gridLines: {
        display: false
      },
      ticks: {
        callback: function ( value, index, values ) {
          return numeral( value ).format( "0a" )
        }
      }
    } ]
  }
}

function LineGraph ( { casesType = "cases", ...props } ) {
  const [ data, setData ] = useState( {} )

  useEffect( () => {
    const fetchData = async () => {
      await fetch( "https://disease.sh/v3/covid-19/historical/all?lastdays=90" )
        .then( response => response.json() )
        .then( data => {
          const chartData = buildChartData( data, casesType )
          setData( chartData )
        } )
    }
    fetchData()
  }, [ casesType ] )

  const buildChartData = ( data, casesType = "cases" ) => {
    const chartData = []
    let lastDataPoint;

    for ( let date in data.cases )
    {
      if ( lastDataPoint )
      {
        const newDataPoint = {
          x: date,
          y: data[ casesType ][ date ] - lastDataPoint
        }
        chartData.push( newDataPoint )
      }
      lastDataPoint = data[ casesType ][ date ]
    }
    return chartData
  }

  return (
    <div className={ props.className }>
      { data?.length > 0 && <Line className="line__chart"
        options={ options }
        data={ {
          datasets: [ {
            backgroundColor: `${ casesTypeColors[ casesType ].half_op }`,
            borderColor: `${ casesTypeColors[ casesType ].hex }`,
            data: data
          } ]
        } }
      /> }
    </div>
  )
}

export default LineGraph
