import { createLogger, format, transports, type Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { SPLAT } from 'triple-beam';
import { safeJSONStringify } from '@rosmarinus/common-utils';
import { transformTimeZoneInString } from '../functions/time-zone';

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
  /** 默认东八区 */
  timeZone?: string;
  /** 转换某些特定对象到前边 */
  transformToPrefix?: {
    [key: string | symbol]: (val: any) => { output: string };
  };
}

const TIME_FORMAT = 'ZZ YYYY-MM-DD HH:mm:ss';

// eslint-disable-next-line max-lines-per-function
export function initFileLoggerFactory({
  fileMode = 'in-hour',
  defaultMeta,
  fileLevel = 'info',
  timeZone = 'Asia/Shanghai',
  logFileDir,
  transformToPrefix,
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
      .filter((key) => !transformToPrefix?.[key])
      .map((key) => `, ${safeJSONStringify({ [key]: rest[key] })}`)
      .join('');

    const customPrefixList: string[] = [];

    [...Object.keys(transformToPrefix ?? {}), ...Object.getOwnPropertySymbols(transformToPrefix ?? {})].forEach(
      (key) => {
        const nowVal = rest[key];

        if (nowVal) {
          const output = transformToPrefix?.[key](nowVal).output;

          output && customPrefixList.push(output);
        }
      },
    );

    const customPrefixStr = customPrefixList.join(' ');

    const timeOutput = transformTimeZoneInString(timestamp, TIME_FORMAT, timeZone);

    return `${timeOutput} [${level.toUpperCase()}]:${
      customPrefixStr ? ` [${customPrefixStr}]` : ''
    } ${message}${notObjMetaOutput}${metaOutput}`;
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
