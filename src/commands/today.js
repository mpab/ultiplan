const ora = require('ora')
const sleep = require('../utils/sleep')
// const getWeather = require('../utils/weather')
// const getLocation = require('../utils/location')

module.exports = async (args) => {

  const spinner = ora("loading tasks").start()

  try {
    // const location = args.location || args.l || await getLocation()
    // const weather = await getWeather(location)

    
    await sleep(2000);

    spinner.stop()

    console.log(`Today's Tasks:`);

    //console.log(`\t${weather.condition.temp}° ${weather.condition.text}`)
  } catch (err) {
    spinner.stop()

    console.error(err)
  }
}
