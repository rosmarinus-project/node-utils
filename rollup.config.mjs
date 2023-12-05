import common from '@rosmarinus/common-plugins';
import { sync } from 'glob';

// 非全平台通用的 npm 需要在这里添加
const external = ['@rollup/plugin-babel'];

const inputs = ['src/index.ts', ...sync('src/modules/*.ts'), ...sync('src/functions/*.ts')];

const inputObj = inputs.reduce((acc, cur) => {
  const name = cur.replace('src/', '').replace('.ts', '');

  acc[name] = cur;

  return acc;
}, {});

// eslint-disable-next-line max-params
function getConfig(format, input, output, tsconfig = './tsconfig.json') {
  const dir = `dist/${output || format}`;

  return {
    input: input || inputObj,
    output: {
      dir,
      format,
      sourcemap: true,
    },
    external,
    plugins: [
      common({
        ts: {
          outDir: dir,
          declarationDir: dir,
          tsconfig,
        },
      }),
    ],
  };
}

export default [
  getConfig('cjs'),
  getConfig('es'),
  getConfig('cjs', 'plugin/babel-plugin.ts', 'cjs-babel-plugin', 'tsconfig.babel.json'),
  getConfig('es', 'plugin/babel-plugin.ts', 'es-babel-plugin', 'tsconfig.babel.json'),
];
