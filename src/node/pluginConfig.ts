import { pluginRoutes } from 'plugin/routes';
import { pluginIndexHtml, pluginConfig } from '../plugin';
import pluginReact from '@vitejs/plugin-react';
import { createPluginMdx } from 'plugin/mdx';
import { SiteConfig } from 'shared/types';

export const VitePlugin = (
  userConfig: SiteConfig,
  restartServer?: () => Promise<void>
) => {
  return [
    pluginIndexHtml(),

    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(userConfig, restartServer),

    pluginRoutes({
      root: userConfig.root
    }),
    createPluginMdx()
  ];
};
