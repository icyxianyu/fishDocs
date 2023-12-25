declare module 'virtual:fishDocs/config' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'virtual:fishDocs/routes' {
  import type { PageModule } from 'shared/types';
  export interface Route {
    path: string;
    element: React.ReactElement;
    filePath: string;
    preload: () => Promise<PageModule>;
  }

  const routes: Route[];
  export { routes };
}
