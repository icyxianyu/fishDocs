import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdx';

export function createPluginMdx() {
  return [pluginMdxRollup()];
}
