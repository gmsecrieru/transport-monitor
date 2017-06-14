import express from 'express'
import bodyParser from 'body-parser'
import bearerToken from 'express-bearer-token'

import { isTokenValid } from './../lib/vehicle/queries'
import { publish } from './../lib/queue'

/**
 * Handles GPS emissions in an HTTP endpoint, which checks authorization and persists
 * emission to a Message Queue for later processing.
 */
export default function () {
  const app = express()
  app.set('port', process.env.PORT || 3000)
  app.use(bodyParser.json())
  app.use(bearerToken())

  app.post('/position', async (req, res) => {
    const { token, body: vehicleEmission } = req

    // check if token is valid
    const tokenStatus = await isTokenValid(token, vehicleEmission)
    if (!tokenStatus) {
      return res.status(401).send('Unauthorized')
    }

    // publish message to SQS
    return publish(vehicleEmission).then(() => res.status(201).send('Created'))
  })

  app.listen(app.get('port'), () => console.log('[gateway] Listening on ', app.get('port')))
}
