import { usePageData } from '../runtime';
import { Nav } from './components/Nav';
import { Home } from './components/Home';
import { Helmet } from 'react-helmet-async';
import './styles/index.css';
import './styles/switch.css';
import 'uno.css';
import { DocLayout } from './components/DocLayout';

export function Layout() {
  const PageData = usePageData();
  const { pageType, title } = PageData;
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
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <div className="pt-14">{getContent()}</div>
    </>
  );
}
