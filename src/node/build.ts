import { build as viteBuild } from 'vite';
import { BUILDPATH, BUILDTEMPPATH, CLIENTENTRY, SERVERENTRY } from '../constants';
import { join } from 'path';
import * as fs from "fs-extra";

export async function bundle(root: string) {
    try {
        console.log(" 1. bundle client and server")
        // 打包客户端
        const clientResult = async () => {
            return viteBuild({
                root,
                mode: 'production',
                build: {
                    outDir: join(BUILDTEMPPATH,'client'),
                    rollupOptions: {
                        input: CLIENTENTRY,
                        output: {
                            format: 'esm'
                        }
                    }
                }
            })
        }

        // 打包服务端
        const serverResult = async () => {
            return viteBuild({
                root,
                mode: 'production',
                build: {
                    ssr: true,
                    outDir:join(BUILDTEMPPATH,'server'),
                    rollupOptions: {
                        input: SERVERENTRY,
                        output: {
                            format: 'cjs'
                        }
                    }
                }
            })
        }
       const [clientBundle,serverBundle] = await Promise.all([clientResult(), serverResult()]);

       return [clientBundle,serverBundle];

    } catch (e) {
        throw new Error(e);
    }
}

export const renderPage = async (render: ()=>string,root: string,clientBundle: any) => {

    const clientChunk = clientBundle.output.find(
        (chunk) => chunk.type === "chunk" && chunk.isEntry
      );
    // 获取客户端打包后的文件名
      console.log("Rendering page in server side...");
     const appHTML = render();
     // 获取server端render出来的HTML；
     const html = `
     <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>title</title>
            <meta name="description" content="xxx">
        </head>
        <body>
            <div id="root">${appHTML}</div>
            <script type="module" src="./${clientChunk?.fileName}"></script>
        </body>
        </html>
     `.trim();
    // 模版html 

    await fs.ensureDir(BUILDPATH);
    await fs.writeFile(join(BUILDPATH,'index.html'), html);
    await fs.copy(join(BUILDTEMPPATH,'client'), join(BUILDPATH) );
    await fs.remove(BUILDTEMPPATH);
};

export async function build(root: string) {
    // bundle 逻辑 打包client端和server端;
    // 引入 server-entry 模块
    // 服务端渲染，产出HTML

   const [clientBundle,serverBundle] =  await bundle(root);

   const serverEntryPATH = join(BUILDTEMPPATH,'server','server-entry.js');

   const { renderInNode } = require(serverEntryPATH);

   await renderPage(renderInNode,root,clientBundle)

}