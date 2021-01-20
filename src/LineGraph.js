import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'
import { casesTypeColors } from './util'

function LineGraph({ casesType = "cases", theme, ...props }) {
  const [data, setData] = useState({})

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
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0")
        }
      }
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll"
        },
        gridLines: {
          drawOnChartArea: false,
          color: theme === 'light' ? 'rgba(0,0,0,0.35)' : '#505050'
        },
      }],
      yAxes: [{
        gridLines: {
          drawOnChartArea: false,
          color: theme === 'light' ? 'rgba(0,0,0,0.35)' : '#505050'
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a")
          }
        }
      }]
    }
  }

  var chart = document.getElementById("chart")
  if (chart) {
    var ctx = chart.getContext("2d");

    var gradient = ctx.createLinearGradient(0, 0, 0, 430);

    if (casesType === "cases") {
      gradient.addColorStop(0, 'rgba(204,16,52,1)');
      gradient.addColorStop(0.1, 'rgba(204,16,52,0.8)');
      gradient.addColorStop(0.2, 'rgba(204,16,52,0.7)');
      gradient.addColorStop(0.3, 'rgba(204,16,52,0.6)');
      theme === "dark" && gradient.addColorStop(0.6, '#303030');
      theme === "light" && gradient.addColorStop(0.6, '#fff');
    }
    else if (casesType === "deaths") {
      gradient.addColorStop(0, 'rgba(258,68,67,0.8)');
      gradient.addColorStop(0.1, 'rgba(258,68,67,0.6)');
      gradient.addColorStop(0.2, 'rgba(258,68,67,0.5)');
      gradient.addColorStop(0.3, 'rgba(258,68,67,0.3)');
      theme === "dark" && gradient.addColorStop(0.6, '#303030');
      theme === "light" && gradient.addColorStop(0.6, '#fff');
    }
    else if (casesType === "recovered") {
      gradient = ctx.createLinearGradient(0, 0, 0, 500);

      gradient.addColorStop(0, 'rgba(125,215,29,0.8)');
      gradient.addColorStop(0.1, 'rgba(125,215,29,0.6)');
      gradient.addColorStop(0.2, 'rgba(125,215,29,0.5)');
      gradient.addColorStop(0.3, 'rgba(125,215,29,0.3)');
      theme === "dark" && gradient.addColorStop(0.6, '#303030');
      theme === "light" && gradient.addColorStop(0.6, '#fff');
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=90")
        .then(response => response.json())
        .then(data => {
          const chartData = buildChartData(data, casesType)
          setData(chartData)
        })
    }
    fetchData()

  }, [casesType])

  const buildChartData = (data, casesType = "cases") => {
    const chartData = []
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: Math.abs(data[casesType][date] - lastDataPoint)
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][date]
    }
    return chartData
  }

  return (
    <div className={props.className}>
      { data?.length > 0 && <Line className="line__chart" id="chart"
        options={options}
        data={{
          datasets: [{
            backgroundColor: gradient,
            borderColor: `${casesTypeColors[casesType].hex}`,
            data: data
          }]
        }}
      />}
    </div>
  )
}

export default LineGraph
