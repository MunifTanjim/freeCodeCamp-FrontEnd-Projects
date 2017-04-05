const axios = require('axios')

const baseURL = 'https://api.twitch.tv/kraken'
const clientID = 'pexioti76qafygwwwfyzdmg8z4x7yp'

axios.defaults.baseURL = baseURL

axios.defaults.headers = {
  'Client-ID': clientID
}

const getStreamInfo = (username) => (
  axios.get(`/streams/${username}`)
)

const getChannelInfo = (username) => (
  axios.get(`/channels/${username}`)
)

const getData = (username) => (
  axios.all([
    getChannelInfo(username),
    getStreamInfo(username)
  ]).then(
    axios.spread((channel, stream) => ({
      channel: channel.data,
      stream: stream.data.stream
    }))
  )
)

const publicAPI = {
  data: getData
}

module.exports = publicAPI
