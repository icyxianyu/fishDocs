import cac from 'cac';
import { build } from './build';
import { createDevServer } from './dev';


// 创建一个 cli 实例, 并定义版本号和帮助信息
const cli = cac('island').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').
    action(async (root) => {
        const server = await createDevServer(root);
        // 启动服务
        await server.listen();

        server.printUrls();
    })

cli.command('build [root]', 'start biild').
    action(async (root) => {
        await build(root)
    })
cli.parse();