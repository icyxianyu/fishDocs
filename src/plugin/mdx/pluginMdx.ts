// mdx处理相关的插件配置

import pluginMdx from '@mdx-js/rollup';
import type { Plugin } from 'vite';
import remarkPluginGFM from 'remark-gfm';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import { changeCode } from './changeCode';
import { hightlighter } from './highLight';
import shiki from 'shiki';

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM, // 支持表格
      remarkPluginFrontmatter, // 支持frontmatter
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }] // 支持frontmatter，数据结构变平
    ],
    rehypePlugins: [
      rehypePluginSlug, //添加id属性

      changeCode, // 预处理 将rehypePlugin的pre标签改成div标签
      [
        rehypePluginAutolinkHeadings, // 支持锚点，就是#号
        {
          properties: {
            class: 'header-anchor' // 添加class
          },
          content: {
            type: 'text', // 添加#号
            value: '#'
          }
        }
      ],
      [
        hightlighter,
        { highlighter: await shiki.getHighlighter({ theme: 'nord' }) }
      ]
    ]
  }) as unknown as Plugin;
}
