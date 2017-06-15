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

    // TODO: validate against schema?
    if (!token && !vehicleEmission) {
      return res.status(400).send('Bad Request')
    }

    res.status(202).send('Accepted')

    // check if token is valid and publish emission to queue
    if (await isTokenValid(token, vehicleEmission)) {
      publish(vehicleEmission)
    }
  })

  app.listen(app.get('port'), () => console.log('[gateway] Listening on ', app.get('port')))
}
