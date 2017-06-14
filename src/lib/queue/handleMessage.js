/**
 * Validate and persist GPS emissions
 *
 * @param  {Object}   message SQS message object
 * @param  {Function} done    Callback for message acknowledgement
 */
export default async function handleMessage (message, done) {
  // TODO: business logic validation
  // TODO: persist to elasticsearch

  // acknowledge message
  done()
}
