import { pluginMdxHMR } from './mdxHMR';
import { pluginMdxRollup } from './pluginMdx';

export async function createPluginMdx() {
  return [await pluginMdxRollup(), pluginMdxHMR()];
}
