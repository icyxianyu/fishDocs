import { Plugin } from 'vite';
import { CLIENTENTRY, TEMPLATEPATH } from '../constants';
import { readFile } from 'fs/promises';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'plugin-index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `@fs/${CLIENTENTRY}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取template.html
          let template = await readFile(TEMPLATEPATH, 'utf-8');

          try {
            template = await server.transformIndexHtml(
              req.url!,
              template,
              req.originalUrl!
            );

            res.setHeader('Content-type', 'text/html');

            res.end(template);
          } catch (e) {
            next(e);
          }
        });
      };
    }
  };
}
