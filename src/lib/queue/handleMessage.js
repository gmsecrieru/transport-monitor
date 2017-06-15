import { createHash } from 'crypto'
import _ from 'underscore'
import config from './../../config'
import { isWithinBoundaries } from './../geolocation'
import { elastic } from './../elastic'

/**
 * Validate and persist GPS emissions
 *
 * @param  {Object}   message SQS message object
 * @param  {Function} done    Callback for message acknowledgement
 */
export default async function handleMessage (message, done) {
  const { MessageId: messageId } = message
  const messageBody = JSON.parse(message.Body)
  const { lat, lon } = messageBody

  // persist to elasticsearch if within boundaries
  if (isWithinBoundaries(lat, lon)) {
    const { index, type } = config.elastic
    const id = createHash('md5').update(`${messageId}${messageBody.uuid}`).digest('hex')

    // TODO: create proper Elasticsearch mapping during `seeder` task
    await elastic().create({
      index,
      type,
      id,
      body: _.omit(messageBody, ['_id', 'token'])
    })
  } else {
    console.log('[handleMessage] Out of city radius, ignoring', { lat, lon })
  }

  // acknowledge message
  done()
}
