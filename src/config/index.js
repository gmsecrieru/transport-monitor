import dev from './dev.js'

const env = process.env.NODE_ENV || 'dev'

let config = {}
switch (env) {
  case 'dev':
    config = dev
    break

  default:
    config = dev
}

export default Object.assign({}, config)
