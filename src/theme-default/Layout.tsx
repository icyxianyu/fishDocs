import { Content } from '../runtime/Content';
import { usePageData } from '../runtime';
import { Nav } from './components/Nav';
import './styles/index.css';
import './styles/switch.css';
import 'uno.css';

export function Layout() {
  const PageData = usePageData();
  return (
    <>
      <Nav />
      {/* <Content /> */}
    </>
  );
}
