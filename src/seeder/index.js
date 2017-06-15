import uuidV4 from 'uuid/v4'
import { vehicles } from './../lib/vehicle/collection'
import { createMessageQueue } from './../lib/queue'

/**
 * Generate a "random" vehicle type for seeding
 *
 * @return {String}
 */
const VEHICLE_TYPE_LIST = ['bus', 'taxi', 'tram', 'train']
const getRandomVehicleType = () => VEHICLE_TYPE_LIST[Math.floor(Math.random() * VEHICLE_TYPE_LIST.length)]

/**
 * Initializes any dependency needed and generates a "random" vehicle type for seeding
 *
 * @return {void}
 */
export default async function () {
  // create Message Queue
  console.log('[seeder] Creating MQ...')
  await createMessageQueue()

  // generate list of vehicles
  const vehiclesList = []
  for (let i = 0; i < 1000; i++) {
    const uuid = uuidV4()
    const type = getRandomVehicleType()

    // fake API token -- should probably be handled by an Authentication service
    const token = Buffer.from(`${uuid}:${type}`).toString('base64')

    vehiclesList.push({ uuid, type, token })
  }

  console.log('[seeder] Seeding DB with vehicles...')
  const collection = await vehicles()
  await collection.insert(vehiclesList)

  console.log('[seeder] Done')
  process.exit()
}
