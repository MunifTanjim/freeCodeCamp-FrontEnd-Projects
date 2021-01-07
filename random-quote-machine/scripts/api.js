const axios = require('axios')

axios.defaults.baseURL =
  'https://cors-anywhere.herokuapp.com/https://zenquotes.io/api'

function random(callback) {
  axios.get('/random').then(
    (res) => {
      callback(null, res.data[0])
    },
    (err) => {
      callback(err, null)
    }
  )
}

function cache(quoteStore) {
  axios.get('/quotes').then((res) => {
    quoteStore.push(...res.data)
    localStorage.setItem('_mt_random_quotes', JSON.stringify(quoteStore))
  })
}

const publicAPI = {
  cache: cache,
  random: random,
}

module.exports = publicAPI
