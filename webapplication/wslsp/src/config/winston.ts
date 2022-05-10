import * as appRoot from 'app-root-path'
import * as winston from 'winston'

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/wslsp.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};


let logger: winston.Logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  exitOnError: false, // do not exit on handled exceptions
});

export const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export {logger };
