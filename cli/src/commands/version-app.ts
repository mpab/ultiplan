// show the application version

module.exports = () => {
  const { version } = require('../../package.json')
  console.log(`v${version}`)
}
