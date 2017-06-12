import request from 'request-promise-native'
import _ from 'underscore'
import config from './../config'
import { getVehicles } from './../lib/vehicle/queries'

/**
 * Generate fake latitude, longitude and heading direction for a given vehicle
 *
 * @param  {Object} vehicle Representation of a GPS emission, which will be used
 *                          to generate route progression
 * @return {Object}         Return next values for latitude, longitude and heading
 */
function fakeEmissionData (vehicle) {
  const { lat, lon } = vehicle

  // todo: consider city center for more realistic lat,lon data
  return {
    lat: (lat
      ? lat * 1.001
      : (Math.random() * 50) + 1
    ),
    lon: (lon
      ? lon * 1.001
      : (Math.random() * 30) + 1
    ),
    heading: Math.floor(Math.random() * 359)
  }
}

/**
 * Emit the position of a given vehicle through an HTTP request
 *
 * @param  {Object} vehicle Representation of a GPS emission
 * @return {void}
 */
async function emitVehiclePosition (vehicleEmission) {
  const { token } = vehicleEmission

  const opts = {
    json: true,
    resolveWithFullResponse: true,
    simple: false,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    uri: `${config.gateway.url}/position`,
    body: _.omit(vehicleEmission, 'token')
  }

  let response
  try {
    response = await request(opts)
  } catch (e) {
    console.log('[emitVehiclePosition] Error while emitting position for vehicle -> ', { vehicleEmission, error: e })
    throw e
  }

  console.log('[emitVehiclePosition] Done emitting position for vehicle: ', { token, statusCode: response.statusCode })
}

/**
 * Wrapper for the process of generating and sending fake GPS emissions.
 *
 * @param  {Object} previousEmissionList Array of objects representing a GPS emission, which is
 *                                       used to generate route progression the next iteration
 * @return {void}
 */
export default async function run (previousEmissionList) {
  let vehiclesList = previousEmissionList
  // if missing previous emission, fetch cars from mongodb
  if (!previousEmissionList || typeof previousEmissionList !== 'object') {
    vehiclesList = await getVehicles()
  }

  // generate first emission data or replace with a little route progression
  const vehicleEmissionList = vehiclesList.map(vehicle => Object.assign({}, vehicle, fakeEmissionData(vehicle)))

  // emit an HTTP request for each vehicle
  Promise.all(vehicleEmissionList.map(emitVehiclePosition))

  console.log('[emitter] Done, starting again in 20 seconds')
  setTimeout(() => {
    run(vehicleEmissionList)
  }, 20000)
}
