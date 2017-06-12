import { attachAppHandlers } from './startup'

attachAppHandlers()

const ALLOWED_TASK_NAMES = ['consumer', 'emitter', 'gateway', 'seeder']
const taskName = process.env.TASK_NAME
if (!ALLOWED_TASK_NAMES.includes(taskName)) {
  console.error(`[transport-monitor] Unknown task, use one of: ${ALLOWED_TASK_NAMES.join(', ')}`)
  process.exit(1)
}

// require and execute task handler
const { default: taskHandler } = require(`./${taskName}`)
taskHandler()
