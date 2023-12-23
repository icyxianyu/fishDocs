import { normalizePath, PluginOption } from 'vite';
import { SiteConfig } from '../shared/types/index';

const SITE_DATA_ID = 'virtual:fishDocs/config';

export function pluginConfig(
  config: SiteConfig,
  restartServer: () => Promise<void>
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
    async handleHotUpdate(ctx) {
      const path = [normalizePath(config.configPath)];
      console.log(path);
      const include = (id: string) => path.some((p) => id.includes(p));
      if (include(ctx.file)) {
        console.log('config文件修改');
        await restartServer();
      }
    }
  };
}
