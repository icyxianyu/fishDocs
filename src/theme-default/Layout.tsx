import { usePageData } from '../runtime';
import { Nav } from './components/Nav';
import { Home } from './components/Home';

import './styles/index.css';
import './styles/switch.css';
import 'uno.css';
import { DocLayout } from './components/DocLayout';

export function Layout() {
  const PageData = usePageData();
  const { pageType } = PageData;
  const getContent = () => {
    if (pageType === 'home') {
      return <Home />;
    } else if (pageType === 'doc') {
      return <DocLayout />;
    } else if (pageType === 'custom') {
      return <div>custom</div>;
    } else {
      return <div>404</div>;
    }
  };
  return (
    <>
      <Nav __island />
      <div className="pt-14">{getContent()}</div>
    </>
  );
}
