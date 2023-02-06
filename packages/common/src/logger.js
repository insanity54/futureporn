import winston from 'winston'

export const loggerFactory = (options) => {
  const mergedOptions = Object.assign({}, {
    level: 'info',
    defaultMeta: { service: 'futureporn' }
  }, options)
  const logger = winston.createLogger(mergedOptions);

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

  return logger
}

