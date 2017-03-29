const axios = require('axios')

const baseURL = 'https://en.wikipedia.org'

axios.defaults.baseURL = baseURL

const searchArticles = (term) => (
  axios.get('/w/api.php', {
    params: {
      action: 'query',
      format: 'json',
      origin: '*',
      list: 'search',
      utf8: 1,
      formatversion: '2',
      srsearch: term,
      srnamespace: '0',
      srprop: 'snippet|titlesnippet'
    }
  }).then(res => {
    let data = res.data.query.search
    return data.map(item => {
      item.link = `${baseURL}/wiki/${encodeURIComponent(item.title)}`
      return item
    })
  })
)

const publicAPI = {
  search: searchArticles
}

module.exports = publicAPI
