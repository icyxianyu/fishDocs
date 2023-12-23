import { renderToString } from 'react-dom/server';
import { App } from '../theme-default/APP';
import { StaticRouter } from 'react-router-dom/server';

export function renderInNode() {
  return renderToString(
    <StaticRouter location={'/guide'}>
      <App />
    </StaticRouter>
  );
}
