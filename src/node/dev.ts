import { createServer } from 'vite';
import { pluginIndexHtml, pluginConfig } from '../plugin';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { ROOTROAD } from '../constants';
export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const userConfig = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root,
    server: {
      fs: {
        allow: [ROOTROAD]
      }
    },
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(userConfig, restartServer)
    ]
  });
}
