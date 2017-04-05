require('../stylesheets/style')

const get = require('./api')

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

const channelNames = [
  'ESL_SC2',
  'OgamingSC2',
  'cretetion',
  'freecodecamp',
  'storbeck',
  'habathcx',
  'RobotCaleb',
  'noobs2ninjas',
  'brunofin',
  'comster404',
  'BennyFits',
  'A_Seagull',
  'TPain',
  'Bloodyfaster',
  'DrDisrespectLive',
  'DaigothebeasTV',
  'Phonecats'
]

const createLogo = (alt, src, placeholder = false) => {
  if (placeholder) {
    let logo = document.createElement('div')
    logo.className = 'placeholder'

    return logo
  }

  let logo = document.createElement('img');
  [logo.src, logo.alt] = [src, alt]

  return logo
}

const createLink = (text, url) => {
  let link = document.createElement('a')

  link.href = url
  link.target = '_blank'

  link.appendChild(createText(text))

  return link
}

const createText = (text) => {
  let span = document.createElement('span')

  span.innerText = text

  return span
}

const createPart = (className, content) => {
  let cell = document.createElement('div')
  cell.className = `cell ${className}`

  cell.appendChild(content)

  return cell
}

const createWrap = (...contents) => {
  let cell = document.createElement('div')
  cell.className = `wrap`

  contents.forEach(content => cell.appendChild(content))

  return cell
}

const createItem = (data) => {
  let { display_name, game, logo, name, status, url } = data.channel
  let { stream } = data

  let row = document.createElement('div')
  row.className = 'row'

  let parts = [
    createPart('logo', createLogo(display_name, logo)),
    createPart('name', createLink(display_name, url)),
    createWrap(
      createPart('game', createText(game || 'N/A')),
      createPart('status', stream ?
        createLink(status, url) : createText('Offline')
      )
    )
  ]

  parts.forEach(part => row.appendChild(part))

  row.dataset.channel = name
  row.dataset.status = stream ? 'online' : 'offline'

  return row
}

docReady(() => {
  const channelList = document.querySelector('.channels')

  document.switchboard.status.forEach(radio => {
    radio.addEventListener('click', (e) => {
      document.body.className = `show-${e.target.id}`
    })
  })

  channelNames.forEach(name => {
    get.data(name).then(info => {
      channelList.appendChild(createItem(info))
    }).catch(error => {
      if (error.response) {
        let row = document.createElement('div')
        row.className = 'row drunk'

        let parts = [
          createPart('logo', createLogo(null, null, true)),
          createPart('name', createText(name)),
          createPart('nonexist', createText(error.response.data.message))
        ]

        parts.forEach(part => row.appendChild(part))

        row.dataset.channel = name

        channelList.appendChild(row)
      }
    })
  })
})
