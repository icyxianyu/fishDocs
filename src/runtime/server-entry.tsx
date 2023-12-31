import { renderToString } from 'react-dom/server';
import { App, initPageData } from '../theme-default/APP';
import { StaticRouter } from 'react-router-dom/server';
import { PagtContext } from './hooks';
export interface RenderResult {
  appHTML: string;
  islandProps: Record<string, any>;
  islandToPathMap: Record<string, any>;
}
export async function renderInNode(pagePath: string): Promise<RenderResult> {
  const pageData = await initPageData(pagePath);
  const { clearIslandData, data } = await import('./jsx-runtime');
  clearIslandData();

  const appHTML = renderToString(
    <PagtContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </PagtContext.Provider>
  );

  const { islandProps, islandToPathMap } = data;
  return {
    appHTML,
    islandProps,
    islandToPathMap
  };
}

export { routes } from 'virtual:fishDocs/routes';
