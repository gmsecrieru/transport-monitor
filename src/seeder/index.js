import uuidV4 from 'uuid/v4'
import { vehicles } from './../lib/vehicle/collection'

/**
 * Generate a "random" vehicle type for seeding
 *
 * @return {String}
 */
const VEHICLE_TYPE_LIST = ['bus', 'taxi', 'tram', 'train']
const getRandomVehicleType = () => VEHICLE_TYPE_LIST[Math.floor(Math.random() * VEHICLE_TYPE_LIST.length)]

/**
 * Generate fake vehicles data for later GPS emissions
 *
 * @return {void}
 */
export default async function () {
  // generate list of vehicles
  const vehiclesList = []
  for (let i = 0; i < 1000; i++) {
    const uuid = uuidV4()
    const type = getRandomVehicleType()

    // fake API token -- should probably be handled by an Authentication service
    const token = Buffer.from(`${uuid}:${type}`).toString('base64')

    vehiclesList.push({ uuid, type, token })
  }

  const collection = await vehicles()
  await collection.insert(vehiclesList)

  console.log('[seeder] Done')
  process.exit()
}
