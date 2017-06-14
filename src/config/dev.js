const SQS_ENDPOINT = 'http://192.168.99.100:9324'
const SQS_QUEUE_NAME = 'gps_emissions'

export default {
  gateway: {
    url: 'http://192.168.99.100:3000'
  },
  db: 'mongodb://192.168.99.100:27017/transport_monitor',
  elastic: '192.168.99.100:9200',
  aws: {
    accessKeyId: 'MY_ACCESS_KEY',
    secretAccessKey: 'MY_SECRET_ACCESS_KEY',
    sqs: {
      region: 'us-east-1',
      endpoint: SQS_ENDPOINT,
      queueName: SQS_QUEUE_NAME,
      queueUrl: `${SQS_ENDPOINT}/queue/${SQS_QUEUE_NAME}`
    }
  }
}
