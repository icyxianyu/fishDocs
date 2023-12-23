import { createRoot } from 'react-dom/client';
import { App } from '../theme-default/APP';
import config from 'virtual:fishDocs/config';
import { BrowserRouter } from 'react-router-dom';

function renderInBrowser() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('#root not found');
  }

  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
