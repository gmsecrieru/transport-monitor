import { Client } from 'elasticsearch'
import config from './../../config'

const conn = new Client({
  host: config.elastic.url
})

/**
 * Expose Elasticsearch connection handler
 */
export function elastic () {
  return conn
}
