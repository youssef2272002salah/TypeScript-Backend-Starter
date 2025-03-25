import winston from 'winston';
import morgan from 'morgan';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import dotenv from 'dotenv';
import 'winston-daily-rotate-file';

dotenv.config();
// if you want to use logtail

// const logtail = new Logtail(process.env.LOGTAIL_API_KEY as string, {
//   endpoint: process.env.LOGTAIL_ENDPOINT,
// });

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}`;
  }),
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    // new LogtailTransport(logtail),

    // in production not to waste it
  ],
});

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

const log = (level: 'info' | 'warn' | 'error', message: string, meta?: object) => {
  logger.log(level, message, meta);
};

export { logger, morganMiddleware, log };
