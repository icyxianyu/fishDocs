import { usePageData } from '../../../runtime';
import { NavItemWithLink } from 'shared/types';
import { Switch } from './Switch';
export const MenuItem = (item: NavItemWithLink) => {
  return (
    <div className="px-1 text-sm max-3">
      <a className="no-underline" href={item.link}>
        {item.text}
      </a>
    </div>
  );
};

export const Nav = () => {
  const { siteData } = usePageData();
  const { nav = [] } = siteData.themeConfig ?? {};

  return (
    <header
      fixed="~"
      pos="t-0 l-0"
      w="full"
      className="font-bold text-decoration z-10 fish-nav"
    >
      <div
        flex="~"
        items="center"
        justify="between"
        className="px-8 h-14 max-w-screen-2xl m-auto"
      >
        <div>
          <a
            href="/"
            className="w-full h-full text-1rem flex font-semibold items-center"
          >
            FishDocs.js Demo
          </a>
        </div>

        <div flex="~" className="items-center">
          {nav.map((item) => (
            <MenuItem {...item} key={item.text} />
          ))}
          <Switch />
        </div>
      </div>
    </header>
  );
};
