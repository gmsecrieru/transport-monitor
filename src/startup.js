/**
 * Base error handler function for monitoring, recovering
 * or proper application shutdown.
 *
 * @param  {Object} err Error object (or any other failure representation)
 * @return {void}
 */
function baseErrorHandler (err) {
  let value
  if (err instanceof Error) {
    value = err.stack || JSON.stringify(err)
  } else {
    value = err
  }

  // notify monitoring system and crash
  console.log('[startup] Error: ', value)
  process.emit('SIGINT', 1)
}

/**
 * Attach process handlers for errors and graceful shutdown
 *
 * @return {void}
 */
export function attachAppHandlers () {
  process.on('uncaughtException', baseErrorHandler)
  process.on('unhandledRejection', baseErrorHandler)

  process.on('SIGINT', (code = 0) => {
    console.log('[startup] Caught SIGINT, about to exit with code: ', code)

    // perform any cleanup tasks and exit
    process.exit(code)
  })
}
