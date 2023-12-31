import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from '../theme-default/APP';
import { BrowserRouter } from 'react-router-dom';
import { PagtContext } from './hooks';
import { ComponentType } from 'react';

declare global {
  interface Window {
    ISLANDS: Record<string, any>;
    ISLAND_PROPS: unknown[];
  }
}
async function renderInBrowser() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('#root not found');
  }
  const pageData = await initPageData(location.pathname);
  if (import.meta.env.DEV) {
    createRoot(root).render(
      <PagtContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PagtContext.Provider>
    );
  } else {
    const islands = document.querySelectorAll('[__island]');
    if (islands.length > 0) {
      islands.forEach((island) => {
        const [id, index] = island.getAttribute('__island').split(':');
        const Element = window.ISLANDS[id] as ComponentType<unknown>;
        hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
      });
    }
  }
}

renderInBrowser();
