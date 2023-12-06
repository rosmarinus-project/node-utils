import { initFileLoggerFactory } from '../src/modules';

describe('FileLogger', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('print time', () => {
    const logger = initFileLoggerFactory({
      fileMode: 'console',
    }).defaultLogger;

    logger.info('print time');
  });

  test('child child', () => {
    const logger = initFileLoggerFactory({
      fileMode: 'console',
    }).defaultLogger;

    logger.child({ rid: 'rid' }).info('print child', { obj: 'obj' });
  });

  test('str child prefix', () => {
    const logger = initFileLoggerFactory({
      fileMode: 'console',
      transformToPrefix: {
        rid: (val) => ({ output: `rid: ${val}` }),
      },
    }).defaultLogger;

    logger.child({ rid: 'rid-v1' }).info('print child', { obj: 'obj' });
  });

  test('symbol child prefix', () => {
    const sym = Symbol('rid');
    const logger = initFileLoggerFactory({
      fileMode: 'console',
      transformToPrefix: {
        [sym]: (val) => ({ output: `rid: ${val}` }),
      },
    }).defaultLogger;

    logger.child({ [sym]: 'rid-v2' }).info('print child', { obj: 'obj' });
  });
});
