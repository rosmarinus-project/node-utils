module.exports = {
  input: ['src/modules/*.ts', 'src/functions/*.ts'],
  exclude: ['src/modules/index.ts', 'src/functions/index.ts'],
  outputFileName: 'dist/map.json',
  srcDir: 'src',
};
