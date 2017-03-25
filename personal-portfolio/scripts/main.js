require('../stylesheets/style')
require('./twitter-wjs');
import Jump from 'jump.js'

function docReady(callback) {
  if (document.readyState != 'loading')
    callback()
  else
    document.addEventListener('DOMContentLoaded', callback)
}

function debounce(func, wait = 20, immediate = true) {
  var timeout
  return function() {
    var context = this, args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

let currentHash = window.location.hash || '#about'
let oldHash = ''

const scrollToSection = (sectionHash, offset) => (
  Jump(sectionHash, {
    offset: offset
  })
)

docReady(() => {
  const navbar = document.querySelector('.navbar')
  const toggleNavbar = document.querySelector('.toggle-navmenu')
  const navLinks = document.querySelectorAll('.navlink a')
  const sections = document.querySelectorAll('section')
  const year = document.querySelector('.year')

  scrollToSection(currentHash, -navbar.offsetHeight)
  document.querySelector(`a[data-hash='${currentHash}']`).classList.add('active')

  window.addEventListener('scroll', debounce((e) => {
    e.preventDefault()
    sections.forEach((section,index) => {
      let top = section.offsetTop - navbar.offsetHeight
      let bottom = top + section.offsetHeight
      let scrolled = window.scrollY

      if(top<=scrolled && bottom>scrolled) {
        navLinks[index].classList.add('active')
        oldHash = currentHash
        currentHash = navLinks[index].dataset.hash
      } else {
        navLinks[index].classList.remove('active')
      }
    })
  },10,false))

  toggleNavbar.addEventListener('click', () => {
    let navbarClass = navbar.classList

    if ( navbarClass.contains('active') )
      navbarClass.remove('active')
    else
      navbarClass.add('active')
  })

  navLinks.forEach((navLink) => {
    navLink.addEventListener('click', function(e) {
      e.preventDefault()
      navbar.classList.remove('active')
      oldHash = currentHash
      currentHash = e.target.dataset.hash

      if(oldHash) {
        document.querySelector(`a[data-hash='${oldHash}']`).classList.remove('active')
      }
      document.querySelector(`a[data-hash='${currentHash}']`).classList.add('active')

      scrollToSection(currentHash, -navbar.offsetHeight)
    })
  })

  year.innerHTML = new Date().getFullYear()
})
