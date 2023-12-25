import { Plugin, normalizePath } from 'vite';
import fastGlob from 'fast-glob';
import path from 'path';

// 本质: 把文件目录结构 -> 路由数据

interface PluginOptions {
  root: string;
  ssr?: boolean;
}

export const CONVENTIONAL_ROUTE_ID = 'virtual:fishDocs/routes';

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);

  return {
    name: 'virtual:fishDocs/routes',
    async configResolved() {
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },

    load(id: string) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode(options.ssr);
      }
    }
  };
}

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    // 使用fast-flob扫描文件夹
    console.log(this.#scanDir);
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      })
      .sort();
    // 格式化路由数据
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      // 2. 文件绝对路径
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  normalizeRoutePath(rawPath: string) {
    // 将文件路径转换成路由路径 例如: /index.tsx -> / ， /foo/index.tsx -> /foo
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');

    // 保证路由路径以 / 开头
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  // // 生成路由代码
  generateRoutesCode(ssr = false) {
    const item = `
    import React from 'react';
    ${ssr ? '' : 'import loadable from "@loadable/component";'}
    ${this.#routeData
      .map((route, index) => {
        return ssr
          ? `import Route${index} from "${route.absolutePath}";`
          : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
      })
      .join('\n')}
    export const routes = [
      ${this.#routeData
        .map((route, index) => {
          return `{
          path: '${route.routePath}',
          element:React.createElement(Route${index}),
          preload: () => import('${route.absolutePath}') 
        }`;
        })
        .join(',\n')}
    ];
    `;
    return item;
  }
}
