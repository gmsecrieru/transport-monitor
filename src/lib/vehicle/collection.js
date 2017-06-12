import { MongoClient } from 'mongodb'
import config from './../../config'

/**
 * Connection object
 */
let DB_CONN

/**
 * Exposes `vehicles` collection, which persists city fleet.
 *
 * @return {Object}
 */
export async function vehicles () {
  if (!DB_CONN) {
    DB_CONN = await MongoClient.connect(config.db)
  }

  return DB_CONN.collection('vehicles')
}
