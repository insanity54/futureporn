import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'futureporn/scout' }
});


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.simple()
  }))
} else {
  logger.add(new winston.transports.Console({
    level: 'info',
    format: winston.format.json()
  }))
}


export default logger