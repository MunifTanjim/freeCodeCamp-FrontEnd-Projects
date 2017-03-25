const webpack = require('webpack')
const path = require('path')
const { find, ls, test } = require('shelljs')

const webpackConfigs = []

const Projects = ls(__dirname).filter(item => (
  test('-d', item) && test('-f', `${item}/config.js`)
))

Projects.map(project => {
  let configFile = path.resolve(`${project}/config.js`)
  let config = require(configFile)
  webpackConfigs.push(config)
})

module.exports = webpackConfigs

module.exports.Projects = Projects
