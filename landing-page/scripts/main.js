require('../stylesheets/style')

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

docReady(() => {

})
