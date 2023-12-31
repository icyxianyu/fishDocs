import { usePageData } from '../../../runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Content } from '../../../runtime';
import { Aside } from '../Aside';

export function DocLayout() {
  const { siteData, toc } = usePageData();
  const { pathname } = useLocation();
  const sidebarData = siteData.themeConfig.sidebar || {};
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });
  const matchedSidebar = sidebarData[matchedSidebarKey] || [];
  return (
    <div className="h-full flex">
      <Sidebar item={matchedSidebar} pathname={pathname}></Sidebar>
      <div className="fish-content mx-auto max-w-6xl mt-10">
        <Content></Content>
      </div>
      <div>
        <Aside headers={toc} __island />
      </div>
    </div>
  );
}
