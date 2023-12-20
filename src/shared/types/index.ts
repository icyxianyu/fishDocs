// Description: 全局类型定义

import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string; // 显示的文字
  link: string; // 链接
};

export interface Sidebar {
  [path: string]: SidebarGroup[]; // key: 路径，value: 侧边栏组
}

export interface SidebarGroup {
  text?: string; // 显示的文字
  items: SidebarItem[]; // 侧边栏组的子项
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] };

export interface ThemeConfig {
  // 主题配置
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface Footer {
  message?: string;
  copyright?: string;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteConfiguration;
}
