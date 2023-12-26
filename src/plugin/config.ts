import { normalizePath, PluginOption } from 'vite';
import { SiteConfig } from '../shared/types/index';
import { ROOTROAD } from '../constants';
import path, { join } from 'path';
import sirv from 'sirv';
import fs from 'fs-extra';
const SITE_DATA_ID = 'virtual:fishDocs/config';

export function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): PluginOption {
  return {
    name: 'virtual:fishDocs/config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    // 监听配置文件的变化
    async handleHotUpdate(ctx) {
      const path = [normalizePath(config.configPath)];
      console.log(path);
      const include = (id: string) => path.some((p) => id.includes(p));
      if (include(ctx.file)) {
        console.log('config文件修改');
        await restartServer();
      }
    },
    // 重写vite的配置
    config() {
      return {
        root: ROOTROAD,
        resolve: {
          alias: {
            '@runtime': join(ROOTROAD, 'src', 'runtime', 'index.ts')
          }
        }
      };
    },
    configureServer(server) {
      const publicDir = path.join(config.root, 'public');
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    }
  };
}
