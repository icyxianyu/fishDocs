import cac from 'cac';
import { build } from './build';
import { createDevServer } from './dev';
import { resolveConfig } from './config';
import { resolve } from 'path';

// 创建一个 cli 实例, 并定义版本号和帮助信息
const cli = cac('island').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').action(async (root) => {
  const createServer = async () => {
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };

  await createServer();
});

cli.command('build [root]', 'start biild').action(async (root) => {
  try {
    root = resolve(root);
    const config = await resolveConfig(root, 'build', 'production');
    await build(root, config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
