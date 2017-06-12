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
}

/**
 * Keeps track of last emission to generate route progression
 */
let CURRENT_EMISSION_DATA

/**
 * Wrapper for the process of generating and sending fake GPS emissions.
 *
 * @return {void}
 */
export default async function run () {
  let vehiclesList = CURRENT_EMISSION_DATA
  // if missing previous emission, fetch cars from mongodb and configure interval for recursion
  if (!CURRENT_EMISSION_DATA || typeof CURRENT_EMISSION_DATA !== 'object') {
    vehiclesList = await getVehicles()
    setInterval(run, 20000)
  }

  // generate first emission data or replace with a little route progression
  CURRENT_EMISSION_DATA = vehiclesList.map(vehicle => Object.assign({}, vehicle, fakeEmissionData(vehicle)))

  // emit an HTTP request for each vehicle
  console.log('[emitter] About to send batch of emissions')
  return Promise.all(CURRENT_EMISSION_DATA.map(emitVehiclePosition)).then((emitResult) => console.log('[emitter] Done, total successful emissions: ', emitResult.length))
}
