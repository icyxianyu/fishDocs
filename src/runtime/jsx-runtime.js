import * as jsxRuntime from 'react/jsx-runtime';
export const data = {
  islandProps: [],
  islandToPathMap: {}
};
const originJSx = jsxRuntime.jsx;

const originJsxs = jsxRuntime.jsxs;

const internalJsx = function (jsx, type, props, ...args) {
  if (props && props.__island) {
    data.islandProps.push(props);
    const id = type.name;
    data.islandToPathMap[id] = props.__island;

    delete props.__island;
    return jsx('div', {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx(type, props, ...args)
    });
  }
  return jsx(type, props, ...args);
};

export const jsx = (...args) => internalJsx(originJSx, ...args);

export const jsxs = (...args) => internalJsx(originJsxs, ...args);

export const Fragment = jsxRuntime.Fragment;

export const clearIslandData = () => {
  data.islandProps = [];
  data.islandToPathMap = {};
};
