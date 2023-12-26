import { SidebarGroup, SidebarItem } from 'shared/types';

interface Props {
  item: SidebarGroup[];
  pathname: string;
}

export const Sidebar = ({ item, pathname }: Props) => {
  console.log(item, pathname);
  const renderGroupItem = (item: SidebarItem) => {
    const active = item.link === pathname;
    return (
      <div ml="5">
        <div p="1" className={`${active ? 'font-extrabold active-color' : ''}`}>
          <a href={item.link}>{item.text}</a>
        </div>
      </div>
    );
  };
  const renderGroup = (item: SidebarGroup) => {
    return (
      <section key={item.text} block="~" not-first="divider-top mt-4">
        <div flex="~" justify="between" items="center">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>
        <div mb="1">
          {item.items?.map((item) => (
            <div key={item.link}>{renderGroupItem(item)}</div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <aside
      className="
    fixed 
    t-0 b-0  z-9 
    overflow-x-hidden overflow-y-auto
    h-full
    p-8 max-w-xs
    fish-sidebar
    "
    >
      <nav>{item.map(renderGroup)}</nav>
    </aside>
  );
};
