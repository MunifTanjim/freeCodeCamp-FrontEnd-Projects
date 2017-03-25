require('../stylesheets/style')
require('./skycons')

const jsonp = require('jsonp')
const axios = require('axios')
const skycons = new window.Skycons({color: 'white'})

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

const darkskyBaseURL = 'https://api.darksky.net/forecast'
const googleMapBaseURL = 'https://maps.googleapis.com/maps/api/geocode'
const darkSkyApiKey = 'c2aaaac58bdaf737980ae4591e33e860'
const googleMapApiKey = 'AIzaSyCmApMrbiSa6MmLIIx422ML-I6bXVZ2wio'

const processApiResponse = (weatherRes, placeRes) => {
  let data = weatherRes.currently
  let place = placeRes.data.results[0].formatted_address.split(', ')
  return {
    place: place.map(name=>`<span>${name}</span>`).join('<br>'),
    status: data.summary,
    icon: data.icon.toUpperCase().replace(/-/g, '_'),
    temperature: `${data.temperature.toFixed(2)}`
  }
}

const darkSkyJSONP = (coords) => (
  new Promise((resolve, reject) => {
    jsonp(`${darkskyBaseURL}/${darkSkyApiKey}/${coords.latitude},${coords.longitude}?exclude=minutely,hourly,daily,alerts,flags&units=si&time=${Date.now()}`, null, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
)

const getWeather = (coords) => (
  axios.all([
    darkSkyJSONP(coords),
    axios.get(`${googleMapBaseURL}/json`, {
      params: {
        latlng: `${coords.latitude},${coords.longitude}`,
        location_type: 'APPROXIMATE',
        result_type: 'administrative_area_level_3',
        key: googleMapApiKey
      }
    })
  ]).then(axios.spread(processApiResponse))
)

const getIP = () => (
  axios.get('https://jsonip.com')
)

const getPlaceFromIP = (ip) => (
  axios.get(`http://ipinfo.io/${ip}`)
)

const getFahrenheit = (celsius) => (
  (celsius * 9 / 5 + 32).toFixed(2)
)

docReady(() => {
  const weather = document.querySelector('.weather')
  const place = weather.querySelector('.place')
  const temperature = weather.querySelector('.temperature')
  const temp = temperature.querySelector('.temp')
  const tempSuffix = temperature.querySelector('.temp-suffix')
  const status = weather.querySelector('.status')
  const icon = weather.querySelector('.icon canvas')

  let weatherData = {}

  const updateWeatherDOMs = (data) => {
    weatherData = data

    weather.classList.remove('loading')
    place.innerHTML = data.place
    temp.innerText = data.temperature
    tempSuffix.innerText = 'C'
    status.innerText = data.status
    skycons.add(icon, window.Skycons[data.icon])
    skycons.play()
  }

  if (navigator.geolocation && location.protocol === 'https:') {
    navigator.geolocation.getCurrentPosition((currPos) => {
      getWeather(currPos.coords).then(updateWeatherDOMs)
    })
  } else {
    getIP().then(res => {
      getPlaceFromIP(res.data.ip).then(place => {
        let [lat,
          lon] = place.data.loc.split(',')
        let coords = {
          latitude: lat,
          longitude: lon
        }
        getWeather(coords).then(updateWeatherDOMs)
      })
    })
  }

  temperature.addEventListener('click', (e) => {
    e.preventDefault()
    let showingCelsius = (temp.innerText == weatherData.temperature)

    if (showingCelsius) {
      temp.innerText = getFahrenheit(weatherData.temperature)
      tempSuffix.innerText = 'F'
    } else {
      temp.innerText = weatherData.temperature
      tempSuffix.innerText = 'C'
    }
  })
})
