import { createServer } from 'vite';
import { pluginIndexHtml, pluginConfig } from '../plugin';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { ROOTROAD } from '../constants';
import { pluginRoutes } from 'plugin/routes';
export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const userConfig = await resolveConfig(root, 'serve', 'development');

  return createServer({
    root: ROOTROAD,
    server: {
      fs: {
        allow: [ROOTROAD]
      }
    },
    plugins: [
      pluginIndexHtml(),

      pluginReact({
        jsxRuntime: 'automatic'
      }),
      pluginConfig(userConfig, restartServer),

      pluginRoutes({
        root: userConfig.root
      })
    ]
  });
}
