import { build as viteBuild, InlineConfig } from 'vite';
import {
  BUILDPATH,
  BUILDTEMPPATH,
  CLIENTENTRY,
  ROOTROAD,
  SERVERENTRY,
  SPLITTER
} from '../constants';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import { SiteConfig } from 'shared/types';
import { VitePlugin } from '../plugin/pluginConfig';
import { RouteObject } from 'react-router-dom';
import { RenderResult } from 'runtime/server-entry';
import type { RollupOutput } from 'rollup';
import { HelmetData } from 'react-helmet-async';

export const EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime'
];

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
          },
          external: EXTERNALS
        }
      }
    });

    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true))
    ]);
    console.log('2. bundle complete');

    // 移动图片资源
    const publicPath = join(root, 'public');
    if (fs.existsSync(publicPath)) {
      await fs.copy(publicPath, join(root, 'build'));
    }

    await fs.copy(join(ROOTROAD, 'vendors'), join(root, 'build'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [clientBundle, serverBundle] as any;
  } catch (e) {
    throw new Error(e);
  }
}
export const buildIsland = async (
  root: string,
  islandPathToMap: Record<string, any>
): Promise<any> => {
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandName, islandPath]) =>
          `import { ${islandName} } from '${islandPath}';`
      )
      .join('')}
window.ISLANDS = { ${Object.keys(islandPathToMap).join(', ')} };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
  `;
  const injectId = 'island:inject';
  return viteBuild({
    mode: 'production',

    esbuild: {
      jsx: 'automatic'
    },
    build: {
      // 输出目录
      outDir: join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      {
        name: 'island:inject',
        enforce: 'post', // 在最后执行
        resolveId(id) {
          if (id.includes(SPLITTER)) {
            const [originId, importer] = id.split(SPLITTER);
            return this.resolve(originId, importer, { skipSelf: true });
          }

          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return islandsInjectCode;
          }
        },
        // 对于 Islands Bundle，我们只需要 JS 即可，其它资源文件可以删除
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
};

const normalizeVendorFilename = (fileName: string) =>
  fileName.replace(/\//g, '_') + '.js';

export const renderPage = async (
  render: (url: string, helmetContext: object) => Promise<RenderResult>,
  routes: RouteObject[],
  root: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientBundle: any
) => {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  // 获取客户端打包后的文件名
  return Promise.all(
    routes.map(async (route) => {
      const path = route.path;
      const helmetContext = {
        context: {}
      } as HelmetData;
      const {
        appHTML,
        islandToPathMap,
        islandProps = []
      } = await render(path, helmetContext.context);
      // 获取css资源
      const { helmet } = helmetContext.context;

      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      );
      const bundle = await buildIsland(root, islandToPathMap);
      const code = (bundle as RollupOutput).output[0].code;

      const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                ${helmet?.title?.toString() || ''}
                ${helmet?.meta?.toString() || ''}
                ${helmet?.link?.toString() || ''}
                ${helmet?.style?.toString() || ''}
                <meta name="description" content="xxx">
                ${
                  styleAssets.length
                    ? styleAssets
                        .map(
                          (asset) =>
                            `<link rel="stylesheet" href="/${asset.fileName}">`
                        )
                        .join('\n')
                    : ''
                }
                <script type="importmap">
                {
                  "imports": {
                    ${EXTERNALS.map(
                      (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
                    ).join(',')}
                  }
                }
              </script>
            </head>
            <body>
                <div id="root">${appHTML}</div>
                <script type="module" >${code}</script>
                <script type="module" src="/${clientChunk?.fileName}"></script>
                <script id="island-props" type="application/json">${JSON.stringify(
                  islandProps
                )}</script>
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

  console.log('3. render page');
  // 引入 server-entry 模块
  const serverEntryPATH = join(root, '.temp', 'server-entry.js');

  const { renderInNode, routes } = await import(
    pathToFileURL(serverEntryPATH.toString()).href
  );

  // 服务端渲染
  await renderPage(renderInNode, routes, root, clientBundle);
}
