import { start } from './../lib/queue'

/**
 * Consumes GPS emissions from a Message Queue, validate and persist (or discard) information
 */
export default async function consumer () {
  start()
}
