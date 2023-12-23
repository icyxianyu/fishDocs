import { createRoot } from 'react-dom/client';
import { App } from '../theme-default/APP';
import config from 'virtual:fishDocs/config';
function renderInBrowser() {
  const root = document.getElementById('root');
  console.log(config);
  if (!root) {
    throw new Error('#root not found');
  }

  createRoot(root).render(<App />);
}

renderInBrowser();
