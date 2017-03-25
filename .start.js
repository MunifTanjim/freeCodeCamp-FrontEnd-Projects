const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const Projects = require('./webpack.config.js').Projects
const webpackConfigs = require('./webpack.config.js')

const project = process.argv[2]
const projectIndex = Projects.indexOf(project)

if (project && ~projectIndex) {
  let config = webpackConfigs[projectIndex]

  config.entry.hot = 'webpack/hot/dev-server'
  config.entry.inline= 'webpack-dev-server/client?http://localhost:8080/'
  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  let compiler = webpack(config);

  let server = new WebpackDevServer(compiler, {
    stats: {
      colors: true
    }
  })
  server.listen(8080)
} else {
  console.error('Enter a valid Project name as first argument, please!')
}
