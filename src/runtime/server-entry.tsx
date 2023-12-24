import { renderToString } from 'react-dom/server';
import { App } from '../theme-default/APP';
import { StaticRouter } from 'react-router-dom/server';

export function renderInNode(pagtPath: string) {
  return renderToString(
    <StaticRouter location={pagtPath}>
      <App />
    </StaticRouter>
  );
}

export { routes } from 'virtual:fishDocs/routes';
