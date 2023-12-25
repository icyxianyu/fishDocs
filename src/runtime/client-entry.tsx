import { createRoot } from 'react-dom/client';
import { App, initPageData } from '../theme-default/APP';
import { BrowserRouter } from 'react-router-dom';
import { PagtContext } from './hooks';

async function renderInBrowser() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('#root not found');
  }
  const pageData = await initPageData(location.pathname);

  createRoot(root).render(
    <PagtContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PagtContext.Provider>
  );
}

renderInBrowser();
