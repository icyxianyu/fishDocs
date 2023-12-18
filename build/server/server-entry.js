"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const server = require("react-dom/server");
const react = require("react");
function Layout() {
  const [state, setState] = react.useState(2);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { children: state }),
    /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: () => {
      setState(state + 1);
    }, children: "点击加1" })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxRuntime.jsx(Layout, {});
}
function renderInNode() {
  return server.renderToString(/* @__PURE__ */ jsxRuntime.jsx(App, {}));
}
exports.renderInNode = renderInNode;
