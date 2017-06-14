import AWS from 'aws-sdk'

import config from './../../config'
const { accessKeyId, secretAccessKey } = config.aws
AWS.config.update({ accessKeyId, secretAccessKey })

const { region, endpoint, queueUrl } = config.aws.sqs
const SQS = new AWS.SQS({
  region,
  endpoint: new AWS.Endpoint(endpoint)
})

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
