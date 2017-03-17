require('../stylesheets/style')

const quoteAPI = require('./api')
const twitter = require('./twitter')

const docReady = (callback) => (
  (document.readyState != 'loading') ? callback() :
    document.addEventListener('DOMContentLoaded', callback)
)

const accentColors = [ '#B71C1C', '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#BF360C', '#3E2723', '#212121', '#263238' ]

const accentedElems = []

const updateColor = (el, prop, newColor) => (el.style[prop] = newColor)

const updateAccentColor = (elems, color) => (
  elems.forEach(elem => updateColor(...elem, color))
)

const quoteStore = localStorage['_mt_random_quotes'] ?
  JSON.parse(localStorage['_mt_random_quotes']) : []

docReady(() => {
  /* Cool Colors */
  const quoteBlock = document.querySelector('.quote')
  const icons = document.querySelectorAll('.icon')
  accentedElems.push([document.body, 'background'])
  accentedElems.push([quoteBlock, 'color'])
  icons.forEach(icon=>(
    accentedElems.push([icon, 'fill'])
  ))

  /* Cool Quote Machine */
  const quoteBody = document.querySelector('.quote-body')
  const quoteAuthor = document.querySelector('.author')
  const nextButton = document.querySelector('.button-next')
  const tweetButton = document.querySelector('.button-tweet')

  const updateQuote = (quote) => {
    quoteBody.innerHTML = quote.content
    quoteAuthor.innerHTML = quote.title

    let newColor = accentColors[Math.floor(Math.random()*accentColors.length)]
    updateAccentColor(accentedElems, newColor)

    twitter.processButton(tweetButton,quoteBody,quoteAuthor)

    quoteBlock.classList.remove('loading')
    nextButton.removeAttribute('disabled')
  }

  const processQuoteStore = () => {
    nextButton.setAttribute('disabled', true)
    tweetButton.setAttribute('disabled', true)
    quoteBlock.classList.add('loading')

    if(quoteStore.length) {
      if(!(quoteStore.length%5)) {
        localStorage.setItem('_mt_random_quotes', JSON.stringify(quoteStore))
      }
      let quote = quoteStore.shift()
      setTimeout(() => updateQuote(quote), 100)
    } else {
      quoteAPI.cache(quoteStore)
      quoteAPI.random((err, quote) => (!err && updateQuote(quote)))
    }
  }

  nextButton.addEventListener('click', (e) => processQuoteStore(e))
  tweetButton.addEventListener('click', (e) => twitter.tweet(e,tweetButton))

  setTimeout(() => processQuoteStore(), 100)
})
