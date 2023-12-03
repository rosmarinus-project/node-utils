import { createLogger, format, transports, type Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { SPLAT } from 'triple-beam';
import { safeJSONStringify } from '@rosmarinus/common-utils';

export type FileLogger = Logger;

export interface FileLoggerFactory {
  defaultLogger: FileLogger;
}

export interface FileLoggerOptions {
  defaultMeta?: any;
  logFileDir?: string;
  /** 默认按小时切分日志 */
  fileMode?: 'console' | 'one-file' | 'in-hour';
  /** 默认 info */
  fileLevel?: 'error' | 'info';
}

export function initFileLoggerFactory({
  fileMode = 'in-hour',
  defaultMeta,
  fileLevel = 'info',
  logFileDir,
}: FileLoggerOptions): FileLoggerFactory {
  const customFormat = format.printf((data) => {
    const { level, timestamp, message, ...rest } = data;

    const notObjMeta = rest[SPLAT] as any[];

    const notObjMetaOutput =
      notObjMeta
        ?.map((item) => {
          if (typeof item === 'object') {
            return '';
          }

          return `, ${String(item)}`;
        })
        .join('') || '';

    const metaOutput = Object.keys(rest)
      .map((key) => `, ${safeJSONStringify({ [key]: rest[key] })}`)
      .join('');

    return `${timestamp} [${level.toUpperCase()}]: ${message}${notObjMetaOutput}${metaOutput}`;
  });
  const logger = createLogger({
    level: fileLevel,
    format: format.combine(
      format.timestamp({
        format: 'ZZ YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
      customFormat,
    ),
    defaultMeta,
    transports: [],
  });

  if (fileMode === 'console') {
    /** 非生产环境的话，打到控制台 */
    logger.add(new transports.Console());
  } else if (fileMode === 'in-hour') {
    logger.add(
      new DailyRotateFile({
        dirname: logFileDir,
        filename: 'log-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        // zippedArchive: true,
        maxSize: '100m',
      }),
    );
  } else {
    logger.add(
      new transports.File({ dirname: logFileDir, filename: fileLevel === 'error' ? 'error.log' : 'combined.log' }),
    );
  }

  return {
    defaultLogger: logger,
  };
}
