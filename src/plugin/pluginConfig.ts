import { pluginRoutes } from 'plugin/routes';
import { pluginIndexHtml, pluginConfig } from '.';
import pluginReact from '@vitejs/plugin-react';
import { createPluginMdx } from 'plugin/mdx';
import { SiteConfig } from 'shared/types';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';
import { join } from 'path';
import { ROOTROAD } from '../constants';
import babelPluginIsland from '../plugin/island';

export const VitePlugin = async (
  userConfig: SiteConfig,
  restartServer?: () => Promise<void>,
  isServer?: boolean
) => {
  return [
    pluginUnocss(unocssOptions),

    pluginIndexHtml(),

    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isServer ? join(ROOTROAD, 'src', 'runtime') : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),

    pluginConfig(userConfig, restartServer),

    pluginRoutes({
      root: userConfig.root,
      ssr: isServer
    }),
    await createPluginMdx()
  ];
};
