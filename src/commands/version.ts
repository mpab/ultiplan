// show the application version

const { version } = require('../../package.json')

module.exports = () => {
  console.log(`v${version}`)
}
