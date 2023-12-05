import chalk, { ChalkInstance } from 'chalk';

function Log(...params: Parameters<typeof console.log>) {
  console.log(...params);
}

export const enum LogType {
  info = 'info',
  warn = 'warn',
  error = 'error',
  file = 'file',
}

const LogFunc: Record<LogType, ChalkInstance> = {
  info: chalk.cyan.green,
  warn: chalk.cyan.yellow,
  error: chalk.cyan.red,
  file: chalk.white,
};

function info(...args: Parameters<typeof console.log>) {
  Log(LogFunc.info(...args));
}

function warn(...args: Parameters<typeof console.log>) {
  Log(LogFunc.warn(...args));
}

function error(...args: Parameters<typeof console.log>) {
  Log(LogFunc.error(...args));
}

function file(...args: Parameters<typeof console.log>) {
  Log(LogFunc.file(...args));
}

function logMix(output: { type: LogType; str: string }[]) {
  const str = output.map(({ type, str }) => LogFunc[type](str)).join('');

  Log(str);
}

export const logger = {
  info,
  warn,
  error,
  file,
  logMix,
};
