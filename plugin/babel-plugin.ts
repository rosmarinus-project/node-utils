import { resolve } from 'path';
import plugin from '@rosmarinus/babel-plugin-tree-cutting';
import type { BabelAPI } from '@babel/helper-plugin-utils';
import type { PluginObj } from '@babel/core';

export default (api: BabelAPI): PluginObj => {
  return plugin(api, {
    npmName: '@rosmarinus/node-utils',
    exportMapPath: resolve(__dirname, '../map.json'),
  });
};
