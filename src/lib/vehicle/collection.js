import { MongoClient } from 'mongodb'
import config from './../../config'

/**
 * Connection object
 */
const DB_CONN = MongoClient.connect(config.db)

/**
 * Exposes `vehicles` collection, which persists city fleet.
 *
 * @return {Object}
 */
export async function vehicles () {
  return (await DB_CONN).collection('vehicles')
}
