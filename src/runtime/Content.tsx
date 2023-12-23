import { useRoutes } from 'react-router-dom';

import { routes } from 'virtual:fishDocs/routes';

export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
