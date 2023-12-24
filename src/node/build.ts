import { build as viteBuild, InlineConfig } from 'vite';
import {
  BUILDPATH,
  BUILDTEMPPATH,
  CLIENTENTRY,
  SERVERENTRY
} from '../constants';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { VitePlugin } from './pluginConfig';
import { RouteObject } from 'react-router-dom';

export async function bundle(root: string, config: SiteConfig) {
  try {
    console.log(' 1. bundle client and server');
    // 打包客户端

    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => ({
      mode: 'production',
      root,
      plugins: await VitePlugin(config, null, isServer),
      ssr: {
        // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
        noExternal: ['react-router-dom']
      },
      build: {
        minify: false,
        ssr: isServer,
        outDir: isServer ? join(root, '.temp') : join(root, 'build'),
        rollupOptions: {
          input: isServer ? SERVERENTRY : CLIENTENTRY,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    });

    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true))
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [clientBundle, serverBundle] as any;
  } catch (e) {
    throw new Error(e);
  }
}

export const renderPage = async (
  render: (url: string) => string,
  routes: RouteObject[],
  root: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientBundle: any
) => {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  // 获取客户端打包后的文件名
  console.log('Rendering page in server side...');

  return Promise.all(
    routes.map(async (route) => {
      const path = route.path;
      const appHTML = render(path);
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>title</title>
            <meta name="description" content="xxx">
        </head>
        <body>
            <div id="root">${appHTML}</div>
            <script type="module" src="//${clientChunk?.fileName}"></script>
        </body>
        </html>
   `.trim();

      const fileName = path.endsWith('/')
        ? `${path}index.html`
        : `${path}.html`;

      await fs.ensureDir(join(root, 'build', dirname(fileName)));
      await fs.writeFile(join(root, 'build', fileName), html);
    })
  );
};

export async function build(root: string, config: SiteConfig) {
  // bundle 逻辑 打包client端和server端;
  // 服务端渲染，产出HTML

  const [clientBundle] = await bundle(root, config);

  // 引入 server-entry 模块
  const serverEntryPATH = join(BUILDTEMPPATH, 'server', 'server-entry.js');

  const { renderInNode, routes } = await import(
    pathToFileURL(serverEntryPATH.toString()).href
  );

  // 服务端渲染
  await renderPage(renderInNode, routes, root, clientBundle);
}
