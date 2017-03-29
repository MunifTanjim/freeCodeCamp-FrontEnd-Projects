require('../stylesheets/style')

const api = require('./api')

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

const createElem = (elem) => (
  document.createElement(elem)
)

const createLink = (link) => {
  let a = createElem('a')
  a.href = link
  a.target = '_blank'
  return a
}

const createListItem = (data) => {
  let title = `<div class='title'>${data.titlesnippet}</div>`
  let description = `<div class='snippet'>${data.snippet}</div>`

  let link = createLink(data.link)
  link.innerHTML = title + description

  let li = createElem('li')
  li.appendChild(link)
  return li
}

docReady(() => {
  const random = document.querySelector('.random')
  const form = document.querySelector('.search')
  const input = form.querySelector('input')
  const list = document.querySelector('.result')

  function updateSearchResult() {
    document.body.classList.add('loading')
    api.search(input.value).then(result => {
      result.forEach(item => {
        list.append(createListItem(item))
      })
    }).then(() => {
      document.body.classList.remove('loading')
      document.body.classList.add('hasResult')
    })
  }

  let searchParam = window.location.search
  let searchTerm = searchParam ? searchParam.match(/\?q\=(.*)/)[1] : ''
  searchTerm = searchTerm.replace(/\+/g, ' ')

  if (searchTerm) {
    input.value = decodeURIComponent(searchTerm)
    updateSearchResult()
  }

  random.addEventListener('click', () => {
    window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank')
  })
})
