import AWS from 'aws-sdk'
import consumer from 'sqs-consumer'

import config from './../../config'
import handleMessage from './handleMessage'

const { accessKeyId, secretAccessKey } = config.aws
AWS.config.update({ accessKeyId, secretAccessKey })

const { region, endpoint, queueUrl, queueName } = config.aws.sqs
const SQS = new AWS.SQS({
  region,
  endpoint: new AWS.Endpoint(endpoint)
})

const CONSUMER = consumer.create({
  queueUrl,
  region,
  handleMessage,
  batchSize: 10
})

CONSUMER.on('empty', () => console.log('[queue] Nothing to process'))

/**
 * Publish a message object to SQS queue
 *
 * @param  {Object}  message Message object
 * @return {Promise}
 */
export function publish (message) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message)
  }

  return new Promise((resolve, reject) => {
    SQS.sendMessage(params, (err, data) => err ? reject(err) : resolve(data))
  })
}

/**
 * Wrapper for the start process of queue polling
 */
export async function start () {
  console.log('[queue] Starting consumer')
  CONSUMER.start()
}

/**
 * Wrapper for the stop process of queue polling
 */
export function stop (haltProcess = false) {
  console.log('[queue] Stopping consumer')
  CONSUMER.stop()

  if (haltProcess) {
    process.emit('SIGINT')
  }
}

/**
 * Create Message Queue for GPS emission processing
 *
 * @return {void}
 */
export async function createMessageQueue () {
  const attemptToCreateQueueIfNeeded = new Promise((resolve) => {
    SQS.createQueue({ QueueName: queueName }, resolve)
  })

  await attemptToCreateQueueIfNeeded
}
