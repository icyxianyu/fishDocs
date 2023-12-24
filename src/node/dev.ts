import { createServer } from 'vite';
import { resolveConfig } from './config';
import { ROOTROAD } from '../constants';
import { VitePlugin } from './pluginConfig';
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
    plugins: await VitePlugin(userConfig, restartServer)
  });
}
