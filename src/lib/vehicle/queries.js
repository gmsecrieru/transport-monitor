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
