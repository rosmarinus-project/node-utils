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
});
