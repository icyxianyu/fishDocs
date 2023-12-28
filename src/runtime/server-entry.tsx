import { renderToString } from 'react-dom/server';
import { App, initPageData } from '../theme-default/APP';
import { StaticRouter } from 'react-router-dom/server';
import { PagtContext } from './hooks';

export async function renderInNode(pagePath: string) {
  const pageData = await initPageData(pagePath);

  return renderToString(
    <PagtContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </PagtContext.Provider>
  );
}

export { routes } from 'virtual:fishDocs/routes';
