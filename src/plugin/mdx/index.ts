import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdx';

export async function createPluginMdx() {
  return [await pluginMdxRollup()];
}
