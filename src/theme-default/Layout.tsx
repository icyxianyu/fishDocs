import { Content } from '../runtime/Content';
import { usePageData } from '../runtime';
import { Nav } from './components/Nav';
import { Home } from './components/Home';

import './styles/index.css';
import './styles/switch.css';
import 'uno.css';

export function Layout() {
  const PageData = usePageData();
  const { pageType } = PageData;
  console.log('pageType', pageType);
  const getContent = () => {
    if (pageType === 'home') {
      return <Home />;
    } else if (pageType === 'doc') {
      return <div>doc</div>;
    } else if (pageType === 'custom') {
      return <div>custom</div>;
    } else {
      return <div>404</div>;
    }
  };
  return (
    <>
      <Nav />
      <div className="pt-14">{getContent()}</div>
    </>
  );
}
