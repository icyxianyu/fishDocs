import { defineConfig } from '../dist';

export default defineConfig({
  title: 'tstawdaw',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '博客',
        link: '/'
      },
      {
        text: '关于',
        link: '/'
      },
      {
        text: 'Github',
        link: '/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '快速上手',
          items: [
            {
              text: '安装',
              link: '/guide/a'
            },
            {
              text: '配置',
              link: '/guide/d'
            },
            {
              text: '使用',
              link: '/guide/test'
            },
            {
              text: '测试',
              link: '/b'
            }
          ]
        }
      ],
      '/': [
        {
          text: 'b文件夹',
          items: [
            {
              text: 'b1',
              link: '/b'
            },
            {
              text: 'c',
              link: '/c'
            }
          ]
        }
      ]
    }
  }
});
