import { Plugin } from 'vite';
import { CLIENTENTRY, TEMPLATEPATH } from '../constants';
import { readFile } from 'fs/promises';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'plugin-index-html',
    apply: 'serve',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENTENTRY}`
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
              req.url,
              template,
              req.originalUrl
            );

            res.statusCode = 200;
            res.setHeader('Content-type', 'text/html');

            res.end(template);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}
