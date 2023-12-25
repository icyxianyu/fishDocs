import { PageData } from 'shared/types';
import { matchRoutes } from 'react-router-dom';
import siteData from 'virtual:fishDocs/config';
import { routes } from 'virtual:fishDocs/routes';
import { Layout } from '.';

export function App() {
  return <Layout />;
}

export async function initPageData(pathname: string): Promise<PageData> {
  const matched = matchRoutes(routes, pathname);

  if (matched) {
    // Preload route component
    const moduleInfo = await matched[0].route.preload();
    return {
      pageType: 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: pathname
    };
  }
  return {
    pageType: '404',
    siteData,
    pagePath: pathname,
    frontmatter: {}
  };
}
