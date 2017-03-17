function processTweetButton(button, quote, author) {
  let tweetLink = 'https://twitter.com/intent/tweet?text='

  quote = quote.textContent.trim()
  author = ` — ${author.textContent.trim()} #quote`

  if((quote.length+author.length)+2>140) {
    quote = `"${quote.substr(0,140-(author.length+5))}..."`
  } else {
    quote = `"${quote}"`
  }

  tweetLink += `${encodeURIComponent(quote)}${encodeURIComponent(author)}`

  button.dataset.url = tweetLink

  button.removeAttribute('disabled')
}

function tweetQuote(e, button) {
  e.preventDefault()

  let height = 320
  let width = 480
  let topOffset = (window.screen.height / 2) - (height / 2)
  let leftOffset = (window.screen.width / 2) - (width / 2)

  window.open(button.dataset.url, '_blank', `top=${topOffset},left=${leftOffset},width=${width},height=${height}`)
}

module.exports = {
  processButton: processTweetButton,
  tweet: tweetQuote
}
