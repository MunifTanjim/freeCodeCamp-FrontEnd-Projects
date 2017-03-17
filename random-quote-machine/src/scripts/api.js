const axios = require('axios')

axios.defaults.baseURL = 'https://quotesondesign.com/wp-json';

const params = (filter) => ({
  'filter[orderby]': 'rand',
  'filter[posts_per_page]': filter.quotes_quantity,
  'time': Date.now()
})

function random(callback) {
  axios.get('/posts', {
    params: params({
      quotes_quantity: 1
    })
  }).then( (res) => {
    callback(null, res.data[0])
  }, (err) => {
    callback(err, null)
  })
}

function cache(quoteStore) {
  axios.get('/posts', {
    params: params({
      quotes_quantity: 30
    })
  }).then(res => {
    quoteStore.push(...res.data)
    localStorage.setItem('_mt_random_quotes', JSON.stringify(quoteStore))
  })
}

const publicAPI = {
  cache: cache,
  random: random
}

module.exports = publicAPI
