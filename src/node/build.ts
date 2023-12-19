import { build as viteBuild } from 'vite';
import { CLIENTENTRY, SERVERENTRY } from '../constants';

export async function bundle(root: string) {
    try {
        console.log(" 1. bundle client and server")
        // 打包客户端
        const clientResult = async () => {
            return viteBuild({
                root,
                mode: 'production',
                build: {
                    outDir: 'build/client',
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
                    outDir: 'build/server',
                    rollupOptions: {
                        input: SERVERENTRY,
                        output: {
                            format: 'cjs'
                        }
                    }
                }
            })
        }

        await clientResult();
        await serverResult();

    } catch (e) {
        throw new Error(e);
    }
}

export async function build(root: string) {
    // bundle 逻辑 打包client端和server端;
    // 引入 server-entry 模块
    // 服务端渲染，产出HTML

    await bundle(root);
}