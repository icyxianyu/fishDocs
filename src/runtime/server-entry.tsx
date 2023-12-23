import { renderToString } from 'react-dom/server';
import { App } from '../theme-default/APP';

export function renderInNode() {
  return renderToString(<App />);
}
