import { pluginRoutes } from 'plugin/routes';
import { pluginIndexHtml, pluginConfig } from '../plugin';
import pluginReact from '@vitejs/plugin-react';
import { createPluginMdx } from 'plugin/mdx';
import { SiteConfig } from 'shared/types';

export const VitePlugin = async (
  userConfig: SiteConfig,
  restartServer?: () => Promise<void>,
  isServer?: boolean
) => {
  return [
    pluginIndexHtml(),

    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(userConfig, restartServer),

    pluginRoutes({
      root: userConfig.root,
      ssr: isServer
    }),
    await createPluginMdx()
  ];
};
