import { build as viteBuild, InlineConfig } from 'vite';
import {
  BUILDPATH,
  BUILDTEMPPATH,
  CLIENTENTRY,
  SERVERENTRY
} from '../constants';
import { join } from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from '../plugin/config';

export async function bundle(root: string, config: SiteConfig) {
  try {
    console.log(' 1. bundle client and server');
    // 打包客户端

    const resolveViteConfig = (isServer: boolean): InlineConfig => ({
      mode: 'production',
      root,
      plugins: [pluginReact(), pluginConfig(config)],
      ssr: {
        // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
        noExternal: ['react-router-dom']
      },
      build: {
        minify: false,
        ssr: isServer,
        outDir: isServer
          ? join(BUILDTEMPPATH, 'server')
          : join(BUILDTEMPPATH, 'client'),
        rollupOptions: {
          input: isServer ? SERVERENTRY : CLIENTENTRY,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    });

    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [clientBundle, serverBundle] as any;
  } catch (e) {
    throw new Error(e);
  }
}

export const renderPage = async (
  render: () => string,
  root: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientBundle: any
) => {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  // 获取客户端打包后的文件名
  console.log('Rendering page in server side...');
  const appHTML = render();
  // 获取server端render出来的HTML；
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
            <script type="module" src="./${clientChunk?.fileName}"></script>
        </body>
        </html>
     `.trim();
  // 模版html

  await fs.ensureDir(BUILDPATH);
  await fs.writeFile(join(BUILDPATH, 'index.html'), html);
  await fs.copy(join(BUILDTEMPPATH, 'client'), join(BUILDPATH));
  await fs.remove(BUILDTEMPPATH);
};

export async function build(root: string, config: SiteConfig) {
  // bundle 逻辑 打包client端和server端;
  // 引入 server-entry 模块
  // 服务端渲染，产出HTML

  const [clientBundle] = await bundle(root, config);

  const serverEntryPATH = join(BUILDTEMPPATH, 'server', 'server-entry.js');

  const { renderInNode } = await import(
    pathToFileURL(serverEntryPATH.toString()).href
  );

  await renderPage(renderInNode, root, clientBundle);
}
