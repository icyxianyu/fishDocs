import { createServer } from 'vite';
import { pluginIndexHtml } from '../plugin';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';

export async function createDevServer(root: string) {
  const [configPath, userConfig] = await resolveConfig(
    root,
    'serve',
    'development'
  );
  console.log('configPath', configPath, 'userConfig', userConfig);

  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}
