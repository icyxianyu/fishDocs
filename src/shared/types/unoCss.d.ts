import type { AttributifyAttributes } from 'unocss/preset-attributify';
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLAttributes<T> extends AttributifyAttributes {} //tsx标签写uno不报错
}
