import { vehicles } from './collection'

/**
 * Fetch all vehicles from collection
 *
 * @return {Object}
 */
export async function getVehicles () {
  const collection = await vehicles()

  return collection.find({}).toArray()
}

/**
 * Check whether a given token is valid for a GPS emission
 *
 * @param  {String}  token           API access token
 * @param  {Object}  vehicleEmission Representation of a GPS emission
 * @return {Boolean}
 */
export async function isTokenValid (token, vehicleEmission) {
  const {
    uuid: emissionUuid,
    type: emissionType
  } = vehicleEmission

  // TODO: consider cacheing this with Redis/Memcache ?
  const collection = await vehicles()
  const vehicleDocument = await collection.findOne({ token })
  if (!vehicleDocument) {
    return false
  }

  const {
    uuid: docUuid,
    type: docType
  } = vehicleDocument

  if (emissionUuid !== docUuid || emissionType !== docType) {
    return false
  }

  return true
}
