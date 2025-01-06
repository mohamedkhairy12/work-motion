(function() {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "./node_modules/next/dist/client/head-manager.js":
/*!*******************************************************!*\
  !*** ./node_modules/next/dist/client/head-manager.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.default = initHeadManager;
exports.DOMAttributeNames = void 0;
const DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule'
};
exports.DOMAttributeNames = DOMAttributeNames;

function reactElementToDOM({
  type,
  props
}) {
  const el = document.createElement(type);

  for (const p in props) {
    if (!props.hasOwnProperty(p)) continue;
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue; // we don't render undefined props to the DOM

    if (props[p] === undefined) continue;
    const attr = DOMAttributeNames[p] || p.toLowerCase();

    if (type === 'script' && (attr === 'async' || attr === 'defer' || attr === 'noModule')) {
      ;
      el[attr] = !!props[p];
    } else {
      el.setAttribute(attr, props[p]);
    }
  }

  const {
    children,
    dangerouslySetInnerHTML
  } = props;

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  }

  return el;
}

function updateElements(type, components) {
  const headEl = document.getElementsByTagName('head')[0];
  const headCountEl = headEl.querySelector('meta[name=next-head-count]');

  if (true) {
    if (!headCountEl) {
      console.error('Warning: next-head-count is missing. https://nextjs.org/docs/messages/next-head-count-missing');
      return;
    }
  }

  const headCount = Number(headCountEl.content);
  const oldTags = [];

  for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = j.previousElementSibling) {
    if (j.tagName.toLowerCase() === type) {
      oldTags.push(j);
    }
  }

  const newTags = components.map(reactElementToDOM).filter(newTag => {
    for (let k = 0, len = oldTags.length; k < len; k++) {
      const oldTag = oldTags[k];

      if (oldTag.isEqualNode(newTag)) {
        oldTags.splice(k, 1);
        return false;
      }
    }

    return true;
  });
  oldTags.forEach(t => t.parentNode.removeChild(t));
  newTags.forEach(t => headEl.insertBefore(t, headCountEl));
  headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}

function initHeadManager() {
  let updatePromise = null;
  return {
    mountedInstances: new Set(),
    updateHead: head => {
      const promise = updatePromise = Promise.resolve().then(() => {
        if (promise !== updatePromise) return;
        updatePromise = null;
        const tags = {};
        head.forEach(h => {
          if ( // If the font tag is loaded only on client navigation
          // it won't be inlined. In this case revert to the original behavior
          h.type === 'link' && h.props['data-optimized-fonts'] && !document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
            h.props.href = h.props['data-href'];
            h.props['data-href'] = undefined;
          }

          const components = tags[h.type] || [];
          components.push(h);
          tags[h.type] = components;
        });
        const titleComponent = tags.title ? tags.title[0] : null;
        let title = '';

        if (titleComponent) {
          const {
            children
          } = titleComponent.props;
          title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        }

        if (title !== document.title) document.title = title;
        ['meta', 'base', 'link', 'style', 'script'].forEach(type => {
          updateElements(type, tags[type] || []);
        });
      });
    }
  };
}

/***/ }),

/***/ "./node_modules/next/dist/client/request-idle-callback.js":
/*!****************************************************************!*\
  !*** ./node_modules/next/dist/client/request-idle-callback.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "./node_modules/next/dist/client/script.js":
/*!*************************************************!*\
  !*** ./node_modules/next/dist/client/script.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.initScriptLoader = initScriptLoader;
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/next/node_modules/@babel/runtime/helpers/extends.js"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutPropertiesLoose */ "./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"));

var _react = __webpack_require__(/*! react */ "react");

var _headManagerContext = __webpack_require__(/*! ../next-server/lib/head-manager-context */ "../next-server/lib/head-manager-context");

var _headManager = __webpack_require__(/*! ./head-manager */ "./node_modules/next/dist/client/head-manager.js");

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js");

const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = ['onLoad', 'dangerouslySetInnerHTML', 'children', 'onError', 'strategy'];

const loadScript = props => {
  const {
    src,
    id,
    onLoad = () => {},
    dangerouslySetInnerHTML,
    children = '',
    onError
  } = props;
  const cacheKey = id || src;

  if (ScriptCache.has(src)) {
    if (!LoadCache.has(cacheKey)) {
      LoadCache.add(cacheKey); // Execute onLoad since the script loading has begun

      ScriptCache.get(src).then(onLoad, onError);
    }

    return;
  }

  const el = document.createElement('script');
  const loadPromise = new Promise((resolve, reject) => {
    el.addEventListener('load', function () {
      resolve();

      if (onLoad) {
        onLoad.call(this);
      }
    });
    el.addEventListener('error', function () {
      reject();

      if (onError) {
        onError();
      }
    });
  });

  if (src) {
    ScriptCache.set(src, loadPromise);
    LoadCache.add(cacheKey);
  }

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  } else if (src) {
    el.src = src;
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
    el.setAttribute(attr, value);
  }

  document.body.appendChild(el);
};

function handleClientScriptLoad(props) {
  const {
    strategy = 'afterInteractive'
  } = props;

  if (strategy === 'afterInteractive') {
    loadScript(props);
  } else if (strategy === 'lazyOnload') {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback.requestIdleCallback)(() => loadScript(props));
    });
  }
}

function loadLazyScript(props) {
  if (document.readyState === 'complete') {
    (0, _requestIdleCallback.requestIdleCallback)(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback.requestIdleCallback)(() => loadScript(props));
    });
  }
}

function initScriptLoader(scriptLoaderItems) {
  scriptLoaderItems.forEach(handleClientScriptLoad);
}

function Script(props) {
  const {
    src = '',
    onLoad = () => {},
    strategy = 'afterInteractive',
    onError
  } = props,
        restProps = (0, _objectWithoutPropertiesLoose2.default)(props, ["src", "onLoad", "dangerouslySetInnerHTML", "strategy", "onError"]); // Context is available only during SSR

  const {
    updateScripts,
    scripts
  } = (0, _react.useContext)(_headManagerContext.HeadManagerContext);
  (0, _react.useEffect)(() => {
    if (strategy === 'afterInteractive') {
      loadScript(props);
    } else if (strategy === 'lazyOnload') {
      loadLazyScript(props);
    }
  }, [props, strategy]);

  if (strategy === 'beforeInteractive') {
    if (updateScripts) {
      scripts.beforeInteractive = (scripts.beforeInteractive || []).concat([(0, _extends2.default)({
        src,
        onLoad,
        onError
      }, restProps)]);
      updateScripts(scripts);
    }
  }

  return null;
}

var _default = Script;
exports.default = _default;

/***/ }),

/***/ "./node_modules/next/dist/pages/_document.js":
/*!***************************************************!*\
  !*** ./node_modules/next/dist/pages/_document.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

exports.__esModule = true;
exports.Html = Html;
exports.Main = Main;
exports.NextScript = exports.Head = exports.default = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/next/node_modules/prop-types/index.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _server = _interopRequireDefault(__webpack_require__(/*! styled-jsx/server */ "styled-jsx/server"));

var _constants = __webpack_require__(/*! ../next-server/lib/constants */ "../next-server/lib/constants");

var _documentContext = __webpack_require__(/*! ../next-server/lib/document-context */ "../next-server/lib/document-context");

var _utils = __webpack_require__(/*! ../next-server/lib/utils */ "../next-server/lib/utils");

exports.DocumentContext = _utils.DocumentContext;
exports.DocumentInitialProps = _utils.DocumentInitialProps;
exports.DocumentProps = _utils.DocumentProps;

var _getPageFiles = __webpack_require__(/*! ../next-server/server/get-page-files */ "../next-server/server/get-page-files");

var _utils2 = __webpack_require__(/*! ../next-server/server/utils */ "../next-server/server/utils");

var _htmlescape = __webpack_require__(/*! ../server/htmlescape */ "./node_modules/next/dist/server/htmlescape.js");

var _script = _interopRequireDefault(__webpack_require__(/*! ../client/script */ "./node_modules/next/dist/client/script.js"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function getDocumentFiles(buildManifest, pathname, inAmpMode) {
  const sharedFiles = (0, _getPageFiles.getPageFiles)(buildManifest, '/_app');
  const pageFiles = inAmpMode ? [] : (0, _getPageFiles.getPageFiles)(buildManifest, pathname);
  return {
    sharedFiles,
    pageFiles,
    allFiles: [...new Set([...sharedFiles, ...pageFiles])]
  };
}

function getPolyfillScripts(context, props) {
  // polyfills.js has to be rendered as nomodule without async
  // It also has to be the first script to load
  const {
    assetPrefix,
    buildManifest,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return buildManifest.polyfillFiles.filter(polyfill => polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')).map(polyfill => /*#__PURE__*/_react.default.createElement("script", {
    key: polyfill,
    defer: !disableOptimizedLoading,
    nonce: props.nonce,
    crossOrigin: props.crossOrigin || undefined,
    noModule: true,
    src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`
  }));
}

function getPreNextScripts(context, props) {
  const {
    scriptLoader,
    disableOptimizedLoading
  } = context;
  return (scriptLoader.beforeInteractive || []).map(file => {
    const {
      strategy
    } = file,
          scriptProps = _objectWithoutProperties(file, ["strategy"]);

    return /*#__PURE__*/_react.default.createElement("script", Object.assign({}, scriptProps, {
      defer: !disableOptimizedLoading,
      nonce: props.nonce,
      crossOrigin: props.crossOrigin || undefined
    }));
  });
}

function getDynamicChunks(context, props, files) {
  const {
    dynamicImports,
    assetPrefix,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return dynamicImports.map(file => {
    if (!file.endsWith('.js') || files.allFiles.includes(file)) return null;
    return /*#__PURE__*/_react.default.createElement("script", {
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}

function getScripts(context, props, files) {
  var _buildManifest$lowPri;

  const {
    assetPrefix,
    buildManifest,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  const normalScripts = files.allFiles.filter(file => file.endsWith('.js'));
  const lowPriorityScripts = (_buildManifest$lowPri = buildManifest.lowPriorityFiles) == null ? void 0 : _buildManifest$lowPri.filter(file => file.endsWith('.js'));
  return [...normalScripts, ...lowPriorityScripts].map(file => {
    return /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}
/**
* `Document` component handles the initial `document` markup and renders only on the server side.
* Commonly used for implementing server side rendering for `css-in-js` libraries.
*/


class Document extends _react.Component {
  /**
  * `getInitialProps` hook returns the context object with the addition of `renderPage`.
  * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
  */
  static async getInitialProps(ctx) {
    const enhanceApp = App => {
      return props => /*#__PURE__*/_react.default.createElement(App, props);
    };

    const {
      html,
      head
    } = await ctx.renderPage({
      enhanceApp
    });
    const styles = [...(0, _server.default)()];
    return {
      html,
      head,
      styles
    };
  }

  static renderDocument(DocumentComponent, props) {
    return /*#__PURE__*/_react.default.createElement(_documentContext.DocumentContext.Provider, {
      value: props
    }, /*#__PURE__*/_react.default.createElement(DocumentComponent, props));
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(Html, null, /*#__PURE__*/_react.default.createElement(Head, null), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement(Main, null), /*#__PURE__*/_react.default.createElement(NextScript, null)));
  }

}

exports.default = Document;

function Html(props) {
  const {
    inAmpMode,
    docComponentsRendered,
    locale
  } = (0, _react.useContext)(_documentContext.DocumentContext);
  docComponentsRendered.Html = true;
  return /*#__PURE__*/_react.default.createElement("html", Object.assign({}, props, {
    lang: props.lang || locale || undefined,
    amp: inAmpMode ? '' : undefined,
    "data-ampdevmode": inAmpMode && true ? '' : undefined
  }));
}

class Head extends _react.Component {
  constructor(...args) {
    super(...args);
    this.context = void 0;
  }

  getCssLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      dynamicImports
    } = this.context;
    const cssFiles = files.allFiles.filter(f => f.endsWith('.css'));
    const sharedFiles = new Set(files.sharedFiles); // Unmanaged files are CSS files that will be handled directly by the
    // webpack runtime (`mini-css-extract-plugin`).

    let unmangedFiles = new Set([]);
    let dynamicCssFiles = Array.from(new Set(dynamicImports.filter(file => file.endsWith('.css'))));

    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter(f => !(existing.has(f) || sharedFiles.has(f)));
      unmangedFiles = new Set(dynamicCssFiles);
      cssFiles.push(...dynamicCssFiles);
    }

    let cssLinkElements = [];
    cssFiles.forEach(file => {
      const isSharedFile = sharedFiles.has(file);

      if (true) {
        cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
          key: `${file}-preload`,
          nonce: this.props.nonce,
          rel: "preload",
          href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
          as: "style",
          crossOrigin: this.props.crossOrigin || undefined
        }));
      }

      const isUnmanagedFile = unmangedFiles.has(file);
      cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
        key: file,
        nonce: this.props.nonce,
        rel: "stylesheet",
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? '' : undefined,
        "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ''
      }));
    });

    if (false) {}

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }

  getPreloadDynamicChunks() {
    const {
      dynamicImports,
      assetPrefix,
      devOnlyCacheBusterQueryString
    } = this.context;
    return dynamicImports.map(file => {
      if (!file.endsWith('.js')) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("link", {
        rel: "preload",
        key: file,
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        as: "script",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined
      });
    }) // Filter out nulled scripts
    .filter(Boolean);
  }

  getPreloadMainLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      scriptLoader
    } = this.context;
    const preloadFiles = files.allFiles.filter(file => {
      return file.endsWith('.js');
    });
    return [...(scriptLoader.beforeInteractive || []).map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file.src,
      nonce: this.props.nonce,
      rel: "preload",
      href: file.src,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    })), ...preloadFiles.map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file,
      nonce: this.props.nonce,
      rel: "preload",
      href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    }))];
  }

  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  handleDocumentScriptLoaderItems(children) {
    const {
      scriptLoader
    } = this.context;
    const scriptLoaderItems = [];
    const filteredChildren = [];

    _react.default.Children.forEach(children, child => {
      if (child.type === _script.default) {
        if (child.props.strategy === 'beforeInteractive') {
          scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([_objectSpread({}, child.props)]);
          return;
        } else if (['lazyOnload', 'afterInteractive'].includes(child.props.strategy)) {
          scriptLoaderItems.push(child.props);
          return;
        }
      }

      filteredChildren.push(child);
    });

    this.context.__NEXT_DATA__.scriptLoader = scriptLoaderItems;
    return filteredChildren;
  }

  makeStylesheetInert(node) {
    return _react.default.Children.map(node, c => {
      if (c.type === 'link' && c.props['href'] && _constants.OPTIMIZED_FONT_PROVIDERS.some(({
        url
      }) => c.props['href'].startsWith(url))) {
        const newProps = _objectSpread({}, c.props || {});

        newProps['data-href'] = newProps['href'];
        newProps['href'] = undefined;
        return /*#__PURE__*/_react.default.cloneElement(c, newProps);
      } else if (c.props && c.props['children']) {
        c.props['children'] = this.makeStylesheetInert(c.props['children']);
      }

      return c;
    });
  }

  render() {
    var _this$props$nonce, _this$props$nonce2;

    const {
      styles,
      ampPath,
      inAmpMode,
      hybridAmp,
      canonicalBase,
      __NEXT_DATA__,
      dangerousAsPath,
      headTags,
      unstable_runtimeJS,
      unstable_JsPreload,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
    this.context.docComponentsRendered.Head = true;
    let {
      head
    } = this.context;
    let cssPreloads = [];
    let otherHeadElements = [];

    if (head) {
      head.forEach(c => {
        if (c && c.type === 'link' && c.props['rel'] === 'preload' && c.props['as'] === 'style') {
          cssPreloads.push(c);
        } else {
          c && otherHeadElements.push(c);
        }
      });
      head = cssPreloads.concat(otherHeadElements);
    }

    let children = _react.default.Children.toArray(this.props.children).filter(Boolean); // show a warning if Head contains <title> (only in development)


    if (true) {
      children = _react.default.Children.map(children, child => {
        var _child$props;

        const isReactHelmet = child == null ? void 0 : (_child$props = child.props) == null ? void 0 : _child$props['data-react-helmet'];

        if (!isReactHelmet) {
          var _child$props2;

          if ((child == null ? void 0 : child.type) === 'title') {
            console.warn("Warning: <title> should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-title");
          } else if ((child == null ? void 0 : child.type) === 'meta' && (child == null ? void 0 : (_child$props2 = child.props) == null ? void 0 : _child$props2.name) === 'viewport') {
            console.warn("Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta");
          }
        }

        return child;
      });
      if (this.props.crossOrigin) console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    if (false) {}

    children = this.handleDocumentScriptLoaderItems(children);
    let hasAmphtmlRel = false;
    let hasCanonicalRel = false; // show warning and remove conflicting amp head tags

    head = _react.default.Children.map(head || [], child => {
      if (!child) return child;
      const {
        type,
        props
      } = child;

      if (inAmpMode) {
        let badProp = '';

        if (type === 'meta' && props.name === 'viewport') {
          badProp = 'name="viewport"';
        } else if (type === 'link' && props.rel === 'canonical') {
          hasCanonicalRel = true;
        } else if (type === 'script') {
          // only block if
          // 1. it has a src and isn't pointing to ampproject's CDN
          // 2. it is using dangerouslySetInnerHTML without a type or
          // a type of text/javascript
          if (props.src && props.src.indexOf('ampproject') < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === 'text/javascript')) {
            badProp = '<script';
            Object.keys(props).forEach(prop => {
              badProp += ` ${prop}="${props[prop]}"`;
            });
            badProp += '/>';
          }
        }

        if (badProp) {
          console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
          return null;
        }
      } else {
        // non-amp mode
        if (type === 'link' && props.rel === 'amphtml') {
          hasAmphtmlRel = true;
        }
      }

      return child;
    }); // try to parse styles from fragment for backwards compat

    const curStyles = Array.isArray(styles) ? styles : [];

    if (inAmpMode && styles && // @ts-ignore Property 'props' does not exist on type ReactElement
    styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
    Array.isArray(styles.props.children)) {
      const hasStyles = el => {
        var _el$props, _el$props$dangerously;

        return el == null ? void 0 : (_el$props = el.props) == null ? void 0 : (_el$props$dangerously = _el$props.dangerouslySetInnerHTML) == null ? void 0 : _el$props$dangerously.__html;
      }; // @ts-ignore Property 'props' does not exist on type ReactElement


      styles.props.children.forEach(child => {
        if (Array.isArray(child)) {
          child.forEach(el => hasStyles(el) && curStyles.push(el));
        } else if (hasStyles(child)) {
          curStyles.push(child);
        }
      });
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
    return /*#__PURE__*/_react.default.createElement("head", this.props, this.context.isDevelopment && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("style", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined,
      dangerouslySetInnerHTML: {
        __html: `body{display:none}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined
    }, /*#__PURE__*/_react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `body{display:block}`
      }
    }))), children,  false && /*#__PURE__*/0, head, /*#__PURE__*/_react.default.createElement("meta", {
      name: "next-head-count",
      content: _react.default.Children.count(head || []).toString()
    }), inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("meta", {
      name: "viewport",
      content: "width=device-width,minimum-scale=1,initial-scale=1"
    }), !hasCanonicalRel && /*#__PURE__*/_react.default.createElement("link", {
      rel: "canonical",
      href: canonicalBase + (0, _utils2.cleanAmpPath)(dangerousAsPath)
    }), /*#__PURE__*/_react.default.createElement("link", {
      rel: "preload",
      as: "script",
      href: "https://cdn.ampproject.org/v0.js"
    }), styles && /*#__PURE__*/_react.default.createElement("style", {
      "amp-custom": "",
      dangerouslySetInnerHTML: {
        __html: curStyles.map(style => style.props.dangerouslySetInnerHTML.__html).join('').replace(/\/\*# sourceMappingURL=.*\*\//g, '').replace(/\/\*@ sourceURL=.*?\*\//g, '')
      }
    }), /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", null, /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
      }
    })), /*#__PURE__*/_react.default.createElement("script", {
      async: true,
      src: "https://cdn.ampproject.org/v0.js"
    })), !inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !hasAmphtmlRel && hybridAmp && /*#__PURE__*/_react.default.createElement("link", {
      rel: "amphtml",
      href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
    }),  true && this.getCssLinks(files),  true && /*#__PURE__*/_react.default.createElement("noscript", {
      "data-n-css": (_this$props$nonce = this.props.nonce) != null ? _this$props$nonce : ''
    }),  false && /*#__PURE__*/0, !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(), !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files),  false && 0,  false && /*#__PURE__*/0, this.context.isDevelopment &&
    /*#__PURE__*/
    // this element is used to mount development styles so the
    // ordering matches production
    // (by default, style-loader injects at the bottom of <head />)
    _react.default.createElement("noscript", {
      id: "__next_css__DO_NOT_USE__"
    }), styles || null), /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {}, ...(headTags || [])));
  }

}

exports.Head = Head;
Head.contextType = _documentContext.DocumentContext;
Head.propTypes = {
  nonce: _propTypes.default.string,
  crossOrigin: _propTypes.default.string
};

function Main() {
  const {
    inAmpMode,
    html,
    docComponentsRendered
  } = (0, _react.useContext)(_documentContext.DocumentContext);
  docComponentsRendered.Main = true;
  if (inAmpMode) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _constants.AMP_RENDER_TARGET);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "__next",
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}

class NextScript extends _react.Component {
  constructor(...args) {
    super(...args);
    this.context = void 0;
  }

  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  static getInlineScriptSource(documentProps) {
    const {
      __NEXT_DATA__
    } = documentProps;

    try {
      const data = JSON.stringify(__NEXT_DATA__);
      return (0, _htmlescape.htmlEscapeJsonString)(data);
    } catch (err) {
      if (err.message.indexOf('circular structure')) {
        throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
      }

      throw err;
    }
  }

  render() {
    const {
      assetPrefix,
      inAmpMode,
      buildManifest,
      unstable_runtimeJS,
      docComponentsRendered,
      devOnlyCacheBusterQueryString,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    docComponentsRendered.NextScript = true;

    if (inAmpMode) {
      if (false) {}

      const ampDevFiles = [...buildManifest.devFiles, ...buildManifest.polyfillFiles, ...buildManifest.ampDevFiles];
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
        id: "__NEXT_DATA__",
        type: "application/json",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        dangerouslySetInnerHTML: {
          __html: NextScript.getInlineScriptSource(this.context)
        },
        "data-ampdevmode": true
      }), ampDevFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
        key: file,
        src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-ampdevmode": true
      })));
    }

    if (true) {
      if (this.props.crossOrigin) console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined
    })) : null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
      id: "__NEXT_DATA__",
      type: "application/json",
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined,
      dangerouslySetInnerHTML: {
        __html: NextScript.getInlineScriptSource(this.context)
      }
    }), disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files));
  }

}

exports.NextScript = NextScript;
NextScript.contextType = _documentContext.DocumentContext;
NextScript.propTypes = {
  nonce: _propTypes.default.string,
  crossOrigin: _propTypes.default.string
};
NextScript.safariNomoduleFix = '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';

function getAmpPath(ampPath, asPath) {
  return ampPath || `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`;
}

/***/ }),

/***/ "./node_modules/next/dist/server/htmlescape.js":
/*!*****************************************************!*\
  !*** ./node_modules/next/dist/server/htmlescape.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
exports.__esModule=true;exports.htmlEscapeJsonString=htmlEscapeJsonString;// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
const ESCAPE_LOOKUP={'&':'\\u0026','>':'\\u003e','<':'\\u003c','\u2028':'\\u2028','\u2029':'\\u2029'};const ESCAPE_REGEX=/[&><\u2028\u2029]/g;function htmlEscapeJsonString(str){return str.replace(ESCAPE_REGEX,match=>ESCAPE_LOOKUP[match]);}
//# sourceMappingURL=htmlescape.js.map

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/extends.js":
/*!**************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/extends.js ***!
  \**************************************************************************/
/***/ (function(module) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \****************************************************************************************/
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \***********************************************************************************************/
/***/ (function(module) {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;

/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/checkPropTypes.js":
/*!*********************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/checkPropTypes.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/next/node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/factoryWithTypeCheckers.js":
/*!******************************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/next/node_modules/prop-types/node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "object-assign");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/next/node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/next/node_modules/prop-types/checkPropTypes.js");

var has = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/index.js":
/*!************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/next/node_modules/prop-types/node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/next/node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*******************************************************************************/
/***/ (function(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js ***!
  \*****************************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/next/node_modules/prop-types/node_modules/react-is/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/next/node_modules/prop-types/node_modules/react-is/index.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/next/node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "../next-server/lib/constants":
/*!*********************************************************!*\
  !*** external "next/dist/next-server/lib/constants.js" ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/constants.js");;

/***/ }),

/***/ "../next-server/lib/document-context":
/*!****************************************************************!*\
  !*** external "next/dist/next-server/lib/document-context.js" ***!
  \****************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/document-context.js");;

/***/ }),

/***/ "../next-server/lib/head-manager-context":
/*!********************************************************************!*\
  !*** external "next/dist/next-server/lib/head-manager-context.js" ***!
  \********************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/head-manager-context.js");;

/***/ }),

/***/ "../next-server/lib/utils":
/*!*****************************************************!*\
  !*** external "next/dist/next-server/lib/utils.js" ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/utils.js");;

/***/ }),

/***/ "../next-server/server/get-page-files":
/*!*****************************************************************!*\
  !*** external "next/dist/next-server/server/get-page-files.js" ***!
  \*****************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/server/get-page-files.js");;

/***/ }),

/***/ "../next-server/server/utils":
/*!********************************************************!*\
  !*** external "next/dist/next-server/server/utils.js" ***!
  \********************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/server/utils.js");;

/***/ }),

/***/ "object-assign":
/*!********************************!*\
  !*** external "object-assign" ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = require("object-assign");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "styled-jsx/server":
/*!************************************!*\
  !*** external "styled-jsx/server" ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = require("styled-jsx/server");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./node_modules/next/dist/pages/_document.js"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L2hlYWQtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JlcXVlc3QtaWRsZS1jYWxsYmFjay5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3NjcmlwdC5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvcGFnZXMvX2RvY3VtZW50LmpzIiwid2VicGFjazovL25leHQtY3Jhc2gtY291cnNlLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9zZXJ2ZXIvaHRtbGVzY2FwZS5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2V4dGVuZHMuanMiLCJ3ZWJwYWNrOi8vbmV4dC1jcmFzaC1jb3Vyc2UvLi9ub2RlX21vZHVsZXMvbmV4dC9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJ3ZWJwYWNrOi8vbmV4dC1jcmFzaC1jb3Vyc2UvLi9ub2RlX21vZHVsZXMvbmV4dC9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlLmpzIiwid2VicGFjazovL25leHQtY3Jhc2gtY291cnNlLy4vbm9kZV9tb2R1bGVzL25leHQvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vbmV4dC1jcmFzaC1jb3Vyc2UvLi9ub2RlX21vZHVsZXMvbmV4dC9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwid2VicGFjazovL25leHQtY3Jhc2gtY291cnNlLy4vbm9kZV9tb2R1bGVzL25leHQvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovL25leHQtY3Jhc2gtY291cnNlLy4vbm9kZV9tb2R1bGVzL25leHQvbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS8uL25vZGVfbW9kdWxlcy9uZXh0L25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvY29uc3RhbnRzLmpzXCIiLCJ3ZWJwYWNrOi8vbmV4dC1jcmFzaC1jb3Vyc2UvZXh0ZXJuYWwgXCJuZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL2RvY3VtZW50LWNvbnRleHQuanNcIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvaGVhZC1tYW5hZ2VyLWNvbnRleHQuanNcIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvdXRpbHMuanNcIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9zZXJ2ZXIvZ2V0LXBhZ2UtZmlsZXMuanNcIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9zZXJ2ZXIvdXRpbHMuanNcIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcIm9iamVjdC1hc3NpZ25cIiIsIndlYnBhY2s6Ly9uZXh0LWNyYXNoLWNvdXJzZS9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vbmV4dC1jcmFzaC1jb3Vyc2UvZXh0ZXJuYWwgXCJzdHlsZWQtanN4L3NlcnZlclwiIl0sIm5hbWVzIjpbImV4cG9ydHMiLCJpbml0SGVhZE1hbmFnZXIiLCJET01BdHRyaWJ1dGVOYW1lcyIsImFjY2VwdENoYXJzZXQiLCJjbGFzc05hbWUiLCJodG1sRm9yIiwiaHR0cEVxdWl2Iiwibm9Nb2R1bGUiLCJyZWFjdEVsZW1lbnRUb0RPTSIsInR5cGUiLCJwcm9wcyIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicCIsImhhc093blByb3BlcnR5IiwidW5kZWZpbmVkIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwic2V0QXR0cmlidXRlIiwiY2hpbGRyZW4iLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsImlubmVySFRNTCIsIl9faHRtbCIsInRleHRDb250ZW50IiwiQXJyYXkiLCJpc0FycmF5Iiwiam9pbiIsInVwZGF0ZUVsZW1lbnRzIiwiY29tcG9uZW50cyIsImhlYWRFbCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaGVhZENvdW50RWwiLCJxdWVyeVNlbGVjdG9yIiwiY29uc29sZSIsImVycm9yIiwiaGVhZENvdW50IiwiTnVtYmVyIiwiY29udGVudCIsIm9sZFRhZ3MiLCJpIiwiaiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJ0YWdOYW1lIiwicHVzaCIsIm5ld1RhZ3MiLCJtYXAiLCJmaWx0ZXIiLCJuZXdUYWciLCJrIiwibGVuIiwibGVuZ3RoIiwib2xkVGFnIiwiaXNFcXVhbE5vZGUiLCJzcGxpY2UiLCJmb3JFYWNoIiwidCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImluc2VydEJlZm9yZSIsInRvU3RyaW5nIiwidXBkYXRlUHJvbWlzZSIsIm1vdW50ZWRJbnN0YW5jZXMiLCJTZXQiLCJ1cGRhdGVIZWFkIiwiaGVhZCIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJ0YWdzIiwiaCIsImhyZWYiLCJ0aXRsZUNvbXBvbmVudCIsInRpdGxlIiwicmVxdWVzdElkbGVDYWxsYmFjayIsInNlbGYiLCJjYiIsInN0YXJ0IiwiRGF0ZSIsIm5vdyIsInNldFRpbWVvdXQiLCJkaWRUaW1lb3V0IiwidGltZVJlbWFpbmluZyIsIk1hdGgiLCJtYXgiLCJjYW5jZWxJZGxlQ2FsbGJhY2siLCJpZCIsImNsZWFyVGltZW91dCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiaW5pdFNjcmlwdExvYWRlciIsIl9leHRlbmRzMiIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlMiIsIl9yZWFjdCIsIl9oZWFkTWFuYWdlckNvbnRleHQiLCJfaGVhZE1hbmFnZXIiLCJfcmVxdWVzdElkbGVDYWxsYmFjayIsIlNjcmlwdENhY2hlIiwiTWFwIiwiTG9hZENhY2hlIiwiaWdub3JlUHJvcHMiLCJsb2FkU2NyaXB0Iiwic3JjIiwib25Mb2FkIiwib25FcnJvciIsImNhY2hlS2V5IiwiaGFzIiwiYWRkIiwiZ2V0IiwibG9hZFByb21pc2UiLCJyZWplY3QiLCJhZGRFdmVudExpc3RlbmVyIiwiY2FsbCIsInNldCIsInZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsImluY2x1ZGVzIiwiYm9keSIsImFwcGVuZENoaWxkIiwiaGFuZGxlQ2xpZW50U2NyaXB0TG9hZCIsInN0cmF0ZWd5Iiwid2luZG93IiwibG9hZExhenlTY3JpcHQiLCJyZWFkeVN0YXRlIiwic2NyaXB0TG9hZGVySXRlbXMiLCJTY3JpcHQiLCJyZXN0UHJvcHMiLCJkZWZhdWx0IiwidXBkYXRlU2NyaXB0cyIsInNjcmlwdHMiLCJ1c2VDb250ZXh0IiwiSGVhZE1hbmFnZXJDb250ZXh0IiwidXNlRWZmZWN0IiwiYmVmb3JlSW50ZXJhY3RpdmUiLCJjb25jYXQiLCJfZGVmYXVsdCIsIkh0bWwiLCJNYWluIiwiX3Byb3BUeXBlcyIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwiX3NlcnZlciIsIl9jb25zdGFudHMiLCJfZG9jdW1lbnRDb250ZXh0IiwiX3V0aWxzIiwiRG9jdW1lbnRDb250ZXh0IiwiRG9jdW1lbnRJbml0aWFsUHJvcHMiLCJEb2N1bWVudFByb3BzIiwiX2dldFBhZ2VGaWxlcyIsIl91dGlsczIiLCJfaHRtbGVzY2FwZSIsIl9zY3JpcHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJXZWFrTWFwIiwiY2FjaGUiLCJvYmoiLCJfX2VzTW9kdWxlIiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJkZXNjIiwiZ2V0RG9jdW1lbnRGaWxlcyIsImJ1aWxkTWFuaWZlc3QiLCJwYXRobmFtZSIsImluQW1wTW9kZSIsInNoYXJlZEZpbGVzIiwiZ2V0UGFnZUZpbGVzIiwicGFnZUZpbGVzIiwiYWxsRmlsZXMiLCJnZXRQb2x5ZmlsbFNjcmlwdHMiLCJjb250ZXh0IiwiYXNzZXRQcmVmaXgiLCJkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyIsImRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nIiwicG9seWZpbGxGaWxlcyIsInBvbHlmaWxsIiwiZW5kc1dpdGgiLCJkZWZlciIsIm5vbmNlIiwiY3Jvc3NPcmlnaW4iLCJwcm9jZXNzIiwiZ2V0UHJlTmV4dFNjcmlwdHMiLCJzY3JpcHRMb2FkZXIiLCJmaWxlIiwic2NyaXB0UHJvcHMiLCJhc3NpZ24iLCJfX05FWFRfQ1JPU1NfT1JJR0lOIiwiZ2V0RHluYW1pY0NodW5rcyIsImZpbGVzIiwiZHluYW1pY0ltcG9ydHMiLCJpc0RldmVsb3BtZW50IiwiYXN5bmMiLCJlbmNvZGVVUkkiLCJnZXRTY3JpcHRzIiwiX2J1aWxkTWFuaWZlc3QkbG93UHJpIiwibm9ybWFsU2NyaXB0cyIsImxvd1ByaW9yaXR5U2NyaXB0cyIsImxvd1ByaW9yaXR5RmlsZXMiLCJEb2N1bWVudCIsIkNvbXBvbmVudCIsImdldEluaXRpYWxQcm9wcyIsImN0eCIsImVuaGFuY2VBcHAiLCJBcHAiLCJodG1sIiwicmVuZGVyUGFnZSIsInN0eWxlcyIsInJlbmRlckRvY3VtZW50IiwiRG9jdW1lbnRDb21wb25lbnQiLCJQcm92aWRlciIsInJlbmRlciIsIkhlYWQiLCJOZXh0U2NyaXB0IiwiZG9jQ29tcG9uZW50c1JlbmRlcmVkIiwibG9jYWxlIiwibGFuZyIsImFtcCIsImNvbnN0cnVjdG9yIiwiYXJncyIsImdldENzc0xpbmtzIiwiY3NzRmlsZXMiLCJmIiwidW5tYW5nZWRGaWxlcyIsImR5bmFtaWNDc3NGaWxlcyIsImZyb20iLCJleGlzdGluZyIsImNzc0xpbmtFbGVtZW50cyIsImlzU2hhcmVkRmlsZSIsInJlbCIsImFzIiwiaXNVbm1hbmFnZWRGaWxlIiwiZ2V0UHJlbG9hZER5bmFtaWNDaHVua3MiLCJCb29sZWFuIiwiZ2V0UHJlbG9hZE1haW5MaW5rcyIsInByZWxvYWRGaWxlcyIsImhhbmRsZURvY3VtZW50U2NyaXB0TG9hZGVySXRlbXMiLCJmaWx0ZXJlZENoaWxkcmVuIiwiQ2hpbGRyZW4iLCJjaGlsZCIsIl9fTkVYVF9EQVRBX18iLCJtYWtlU3R5bGVzaGVldEluZXJ0Iiwibm9kZSIsImMiLCJPUFRJTUlaRURfRk9OVF9QUk9WSURFUlMiLCJzb21lIiwidXJsIiwic3RhcnRzV2l0aCIsIm5ld1Byb3BzIiwiY2xvbmVFbGVtZW50IiwiX3RoaXMkcHJvcHMkbm9uY2UiLCJfdGhpcyRwcm9wcyRub25jZTIiLCJhbXBQYXRoIiwiaHlicmlkQW1wIiwiY2Fub25pY2FsQmFzZSIsImRhbmdlcm91c0FzUGF0aCIsImhlYWRUYWdzIiwidW5zdGFibGVfcnVudGltZUpTIiwidW5zdGFibGVfSnNQcmVsb2FkIiwiZGlzYWJsZVJ1bnRpbWVKUyIsImRpc2FibGVKc1ByZWxvYWQiLCJjc3NQcmVsb2FkcyIsIm90aGVySGVhZEVsZW1lbnRzIiwidG9BcnJheSIsIl9jaGlsZCRwcm9wcyIsImlzUmVhY3RIZWxtZXQiLCJfY2hpbGQkcHJvcHMyIiwid2FybiIsIm5hbWUiLCJoYXNBbXBodG1sUmVsIiwiaGFzQ2Fub25pY2FsUmVsIiwiYmFkUHJvcCIsImluZGV4T2YiLCJrZXlzIiwicHJvcCIsInBhZ2UiLCJjdXJTdHlsZXMiLCJoYXNTdHlsZXMiLCJfZWwkcHJvcHMiLCJfZWwkcHJvcHMkZGFuZ2Vyb3VzbHkiLCJGcmFnbWVudCIsImNvdW50IiwiY2xlYW5BbXBQYXRoIiwic3R5bGUiLCJyZXBsYWNlIiwiZ2V0QW1wUGF0aCIsImNvbnRleHRUeXBlIiwicHJvcFR5cGVzIiwic3RyaW5nIiwiQU1QX1JFTkRFUl9UQVJHRVQiLCJnZXRJbmxpbmVTY3JpcHRTb3VyY2UiLCJkb2N1bWVudFByb3BzIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJodG1sRXNjYXBlSnNvblN0cmluZyIsImVyciIsIm1lc3NhZ2UiLCJFcnJvciIsImFtcERldkZpbGVzIiwiZGV2RmlsZXMiLCJzYWZhcmlOb21vZHVsZUZpeCIsImFzUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFhOztBQUFBQSxrQkFBQSxHQUFtQixJQUFuQjtBQUF3QkEsZUFBQSxHQUFnQkMsZUFBaEI7QUFBZ0NELHlCQUFBLEdBQTBCLEtBQUssQ0FBL0I7QUFBaUMsTUFBTUUsaUJBQWlCLEdBQUM7QUFBQ0MsZUFBYSxFQUFDLGdCQUFmO0FBQWdDQyxXQUFTLEVBQUMsT0FBMUM7QUFBa0RDLFNBQU8sRUFBQyxLQUExRDtBQUFnRUMsV0FBUyxFQUFDLFlBQTFFO0FBQXVGQyxVQUFRLEVBQUM7QUFBaEcsQ0FBeEI7QUFBb0lQLHlCQUFBLEdBQTBCRSxpQkFBMUI7O0FBQTRDLFNBQVNNLGlCQUFULENBQTJCO0FBQUNDLE1BQUQ7QUFBTUM7QUFBTixDQUEzQixFQUF3QztBQUFDLFFBQU1DLEVBQUUsR0FBQ0MsUUFBUSxDQUFDQyxhQUFULENBQXVCSixJQUF2QixDQUFUOztBQUFzQyxPQUFJLE1BQU1LLENBQVYsSUFBZUosS0FBZixFQUFxQjtBQUFDLFFBQUcsQ0FBQ0EsS0FBSyxDQUFDSyxjQUFOLENBQXFCRCxDQUFyQixDQUFKLEVBQTRCO0FBQVMsUUFBR0EsQ0FBQyxLQUFHLFVBQUosSUFBZ0JBLENBQUMsS0FBRyx5QkFBdkIsRUFBaUQsU0FBdkYsQ0FBZ0c7O0FBQzFkLFFBQUdKLEtBQUssQ0FBQ0ksQ0FBRCxDQUFMLEtBQVdFLFNBQWQsRUFBd0I7QUFBUyxVQUFNQyxJQUFJLEdBQUNmLGlCQUFpQixDQUFDWSxDQUFELENBQWpCLElBQXNCQSxDQUFDLENBQUNJLFdBQUYsRUFBakM7O0FBQWlELFFBQUdULElBQUksS0FBRyxRQUFQLEtBQWtCUSxJQUFJLEtBQUcsT0FBUCxJQUFnQkEsSUFBSSxLQUFHLE9BQXZCLElBQWdDQSxJQUFJLEtBQUcsVUFBekQsQ0FBSCxFQUF3RTtBQUFDO0FBQUNOLFFBQUUsQ0FBQ00sSUFBRCxDQUFGLEdBQVMsQ0FBQyxDQUFDUCxLQUFLLENBQUNJLENBQUQsQ0FBaEI7QUFBcUIsS0FBL0YsTUFBbUc7QUFBQ0gsUUFBRSxDQUFDUSxZQUFILENBQWdCRixJQUFoQixFQUFxQlAsS0FBSyxDQUFDSSxDQUFELENBQTFCO0FBQWdDO0FBQUM7O0FBQUEsUUFBSztBQUFDTSxZQUFEO0FBQVVDO0FBQVYsTUFBbUNYLEtBQXhDOztBQUE4QyxNQUFHVyx1QkFBSCxFQUEyQjtBQUFDVixNQUFFLENBQUNXLFNBQUgsR0FBYUQsdUJBQXVCLENBQUNFLE1BQXhCLElBQWdDLEVBQTdDO0FBQWlELEdBQTdFLE1BQWtGLElBQUdILFFBQUgsRUFBWTtBQUFDVCxNQUFFLENBQUNhLFdBQUgsR0FBZSxPQUFPSixRQUFQLEtBQWtCLFFBQWxCLEdBQTJCQSxRQUEzQixHQUFvQ0ssS0FBSyxDQUFDQyxPQUFOLENBQWNOLFFBQWQsSUFBd0JBLFFBQVEsQ0FBQ08sSUFBVCxDQUFjLEVBQWQsQ0FBeEIsR0FBMEMsRUFBN0Y7QUFBaUc7O0FBQUEsU0FBT2hCLEVBQVA7QUFBVzs7QUFBQSxTQUFTaUIsY0FBVCxDQUF3Qm5CLElBQXhCLEVBQTZCb0IsVUFBN0IsRUFBd0M7QUFBQyxRQUFNQyxNQUFNLEdBQUNsQixRQUFRLENBQUNtQixvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUFiO0FBQXNELFFBQU1DLFdBQVcsR0FBQ0YsTUFBTSxDQUFDRyxhQUFQLENBQXFCLDRCQUFyQixDQUFsQjs7QUFBcUUsWUFBdUM7QUFBQyxRQUFHLENBQUNELFdBQUosRUFBZ0I7QUFBQ0UsYUFBTyxDQUFDQyxLQUFSLENBQWMsK0ZBQWQ7QUFBK0c7QUFBUTtBQUFDOztBQUFBLFFBQU1DLFNBQVMsR0FBQ0MsTUFBTSxDQUFDTCxXQUFXLENBQUNNLE9BQWIsQ0FBdEI7QUFBNEMsUUFBTUMsT0FBTyxHQUFDLEVBQWQ7O0FBQWlCLE9BQUksSUFBSUMsQ0FBQyxHQUFDLENBQU4sRUFBUUMsQ0FBQyxHQUFDVCxXQUFXLENBQUNVLHNCQUExQixFQUFpREYsQ0FBQyxHQUFDSixTQUFuRCxFQUE2REksQ0FBQyxJQUFHQyxDQUFDLEdBQUNBLENBQUMsQ0FBQ0Msc0JBQXJFLEVBQTRGO0FBQUMsUUFBR0QsQ0FBQyxDQUFDRSxPQUFGLENBQVV6QixXQUFWLE9BQTBCVCxJQUE3QixFQUFrQztBQUFDOEIsYUFBTyxDQUFDSyxJQUFSLENBQWFILENBQWI7QUFBaUI7QUFBQzs7QUFBQSxRQUFNSSxPQUFPLEdBQUNoQixVQUFVLENBQUNpQixHQUFYLENBQWV0QyxpQkFBZixFQUFrQ3VDLE1BQWxDLENBQXlDQyxNQUFNLElBQUU7QUFBQyxTQUFJLElBQUlDLENBQUMsR0FBQyxDQUFOLEVBQVFDLEdBQUcsR0FBQ1gsT0FBTyxDQUFDWSxNQUF4QixFQUErQkYsQ0FBQyxHQUFDQyxHQUFqQyxFQUFxQ0QsQ0FBQyxFQUF0QyxFQUF5QztBQUFDLFlBQU1HLE1BQU0sR0FBQ2IsT0FBTyxDQUFDVSxDQUFELENBQXBCOztBQUF3QixVQUFHRyxNQUFNLENBQUNDLFdBQVAsQ0FBbUJMLE1BQW5CLENBQUgsRUFBOEI7QUFBQ1QsZUFBTyxDQUFDZSxNQUFSLENBQWVMLENBQWYsRUFBaUIsQ0FBakI7QUFBb0IsZUFBTyxLQUFQO0FBQWM7QUFBQzs7QUFBQSxXQUFPLElBQVA7QUFBYSxHQUFuTSxDQUFkO0FBQW1OVixTQUFPLENBQUNnQixPQUFSLENBQWdCQyxDQUFDLElBQUVBLENBQUMsQ0FBQ0MsVUFBRixDQUFhQyxXQUFiLENBQXlCRixDQUF6QixDQUFuQjtBQUFnRFgsU0FBTyxDQUFDVSxPQUFSLENBQWdCQyxDQUFDLElBQUUxQixNQUFNLENBQUM2QixZQUFQLENBQW9CSCxDQUFwQixFQUFzQnhCLFdBQXRCLENBQW5CO0FBQXVEQSxhQUFXLENBQUNNLE9BQVosR0FBb0IsQ0FBQ0YsU0FBUyxHQUFDRyxPQUFPLENBQUNZLE1BQWxCLEdBQXlCTixPQUFPLENBQUNNLE1BQWxDLEVBQTBDUyxRQUExQyxFQUFwQjtBQUEwRTs7QUFBQSxTQUFTM0QsZUFBVCxHQUEwQjtBQUFDLE1BQUk0RCxhQUFhLEdBQUMsSUFBbEI7QUFBdUIsU0FBTTtBQUFDQyxvQkFBZ0IsRUFBQyxJQUFJQyxHQUFKLEVBQWxCO0FBQTRCQyxjQUFVLEVBQUNDLElBQUksSUFBRTtBQUFDLFlBQU1DLE9BQU8sR0FBQ0wsYUFBYSxHQUFDTSxPQUFPLENBQUNDLE9BQVIsR0FBa0JDLElBQWxCLENBQXVCLE1BQUk7QUFBQyxZQUFHSCxPQUFPLEtBQUdMLGFBQWIsRUFBMkI7QUFBT0EscUJBQWEsR0FBQyxJQUFkO0FBQW1CLGNBQU1TLElBQUksR0FBQyxFQUFYO0FBQWNMLFlBQUksQ0FBQ1YsT0FBTCxDQUFhZ0IsQ0FBQyxJQUFFO0FBQUMsZUFBRztBQUM3bUQ7QUFDQUEsV0FBQyxDQUFDOUQsSUFBRixLQUFTLE1BQVQsSUFBaUI4RCxDQUFDLENBQUM3RCxLQUFGLENBQVEsc0JBQVIsQ0FBakIsSUFBa0QsQ0FBQ0UsUUFBUSxDQUFDcUIsYUFBVCxDQUF3QixvQkFBbUJzQyxDQUFDLENBQUM3RCxLQUFGLENBQVEsV0FBUixDQUFxQixJQUFoRSxDQUZ1akQsRUFFbC9DO0FBQUM2RCxhQUFDLENBQUM3RCxLQUFGLENBQVE4RCxJQUFSLEdBQWFELENBQUMsQ0FBQzdELEtBQUYsQ0FBUSxXQUFSLENBQWI7QUFBa0M2RCxhQUFDLENBQUM3RCxLQUFGLENBQVEsV0FBUixJQUFxQk0sU0FBckI7QUFBZ0M7O0FBQUEsZ0JBQU1hLFVBQVUsR0FBQ3lDLElBQUksQ0FBQ0MsQ0FBQyxDQUFDOUQsSUFBSCxDQUFKLElBQWMsRUFBL0I7QUFBa0NvQixvQkFBVSxDQUFDZSxJQUFYLENBQWdCMkIsQ0FBaEI7QUFBbUJELGNBQUksQ0FBQ0MsQ0FBQyxDQUFDOUQsSUFBSCxDQUFKLEdBQWFvQixVQUFiO0FBQXlCLFNBRmcxQztBQUU5MEMsY0FBTTRDLGNBQWMsR0FBQ0gsSUFBSSxDQUFDSSxLQUFMLEdBQVdKLElBQUksQ0FBQ0ksS0FBTCxDQUFXLENBQVgsQ0FBWCxHQUF5QixJQUE5QztBQUFtRCxZQUFJQSxLQUFLLEdBQUMsRUFBVjs7QUFBYSxZQUFHRCxjQUFILEVBQWtCO0FBQUMsZ0JBQUs7QUFBQ3JEO0FBQUQsY0FBV3FELGNBQWMsQ0FBQy9ELEtBQS9CO0FBQXFDZ0UsZUFBSyxHQUFDLE9BQU90RCxRQUFQLEtBQWtCLFFBQWxCLEdBQTJCQSxRQUEzQixHQUFvQ0ssS0FBSyxDQUFDQyxPQUFOLENBQWNOLFFBQWQsSUFBd0JBLFFBQVEsQ0FBQ08sSUFBVCxDQUFjLEVBQWQsQ0FBeEIsR0FBMEMsRUFBcEY7QUFBd0Y7O0FBQUEsWUFBRytDLEtBQUssS0FBRzlELFFBQVEsQ0FBQzhELEtBQXBCLEVBQTBCOUQsUUFBUSxDQUFDOEQsS0FBVCxHQUFlQSxLQUFmO0FBQXFCLFNBQUMsTUFBRCxFQUFRLE1BQVIsRUFBZSxNQUFmLEVBQXNCLE9BQXRCLEVBQThCLFFBQTlCLEVBQXdDbkIsT0FBeEMsQ0FBZ0Q5QyxJQUFJLElBQUU7QUFBQ21CLHdCQUFjLENBQUNuQixJQUFELEVBQU02RCxJQUFJLENBQUM3RCxJQUFELENBQUosSUFBWSxFQUFsQixDQUFkO0FBQXFDLFNBQTVGO0FBQStGLE9BRmk1QixDQUE1QjtBQUVsM0I7QUFGbzBCLEdBQU47QUFFM3pCLEM7Ozs7Ozs7Ozs7O0FDSGxtQjs7QUFBQVQsa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLDBCQUFBLEdBQTJCQSwyQkFBQSxHQUE0QixLQUFLLENBQTVEOztBQUE4RCxNQUFNMkUsbUJBQW1CLEdBQUMsT0FBT0MsSUFBUCxLQUFjLFdBQWQsSUFBMkJBLElBQUksQ0FBQ0QsbUJBQWhDLElBQXFELFVBQVNFLEVBQVQsRUFBWTtBQUFDLE1BQUlDLEtBQUssR0FBQ0MsSUFBSSxDQUFDQyxHQUFMLEVBQVY7QUFBcUIsU0FBT0MsVUFBVSxDQUFDLFlBQVU7QUFBQ0osTUFBRSxDQUFDO0FBQUNLLGdCQUFVLEVBQUMsS0FBWjtBQUFrQkMsbUJBQWEsRUFBQyxZQUFVO0FBQUMsZUFBT0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFXLE1BQUlOLElBQUksQ0FBQ0MsR0FBTCxLQUFXRixLQUFmLENBQVgsQ0FBUDtBQUEwQztBQUFyRixLQUFELENBQUY7QUFBNEYsR0FBeEcsRUFBeUcsQ0FBekcsQ0FBakI7QUFBOEgsQ0FBL087O0FBQWdQOUUsMkJBQUEsR0FBNEIyRSxtQkFBNUI7O0FBQWdELE1BQU1XLGtCQUFrQixHQUFDLE9BQU9WLElBQVAsS0FBYyxXQUFkLElBQTJCQSxJQUFJLENBQUNVLGtCQUFoQyxJQUFvRCxVQUFTQyxFQUFULEVBQVk7QUFBQyxTQUFPQyxZQUFZLENBQUNELEVBQUQsQ0FBbkI7QUFBeUIsQ0FBbkg7O0FBQW9IdkYsMEJBQUEsR0FBMkJzRixrQkFBM0IsQzs7Ozs7Ozs7Ozs7QUNBMWU7O0FBQUEsSUFBSUcsc0JBQXNCLEdBQUNDLG1CQUFPLENBQUMsc0lBQUQsQ0FBbEM7O0FBQW1GMUYsa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLHdCQUFBLEdBQXlCMkYsZ0JBQXpCO0FBQTBDM0YsZUFBQSxHQUFnQixLQUFLLENBQXJCOztBQUF1QixJQUFJNEYsU0FBUyxHQUFDSCxzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQywwR0FBRCxDQUFSLENBQXBDOztBQUFnRixJQUFJRyw4QkFBOEIsR0FBQ0osc0JBQXNCLENBQUNDLG1CQUFPLENBQUMsb0pBQUQsQ0FBUixDQUF6RDs7QUFBMEgsSUFBSUksTUFBTSxHQUFDSixtQkFBTyxDQUFDLG9CQUFELENBQWxCOztBQUE0QixJQUFJSyxtQkFBbUIsR0FBQ0wsbUJBQU8sQ0FBQyx3RkFBRCxDQUEvQjs7QUFBMkUsSUFBSU0sWUFBWSxHQUFDTixtQkFBTyxDQUFDLHVFQUFELENBQXhCOztBQUEyQyxJQUFJTyxvQkFBb0IsR0FBQ1AsbUJBQU8sQ0FBQyx5RkFBRCxDQUFoQzs7QUFBNEQsTUFBTVEsV0FBVyxHQUFDLElBQUlDLEdBQUosRUFBbEI7QUFBNEIsTUFBTUMsU0FBUyxHQUFDLElBQUlyQyxHQUFKLEVBQWhCO0FBQTBCLE1BQU1zQyxXQUFXLEdBQUMsQ0FBQyxRQUFELEVBQVUseUJBQVYsRUFBb0MsVUFBcEMsRUFBK0MsU0FBL0MsRUFBeUQsVUFBekQsQ0FBbEI7O0FBQXVGLE1BQU1DLFVBQVUsR0FBQzVGLEtBQUssSUFBRTtBQUFDLFFBQUs7QUFBQzZGLE9BQUQ7QUFBS2hCLE1BQUw7QUFBUWlCLFVBQU0sR0FBQyxNQUFJLENBQUUsQ0FBckI7QUFBc0JuRiwyQkFBdEI7QUFBOENELFlBQVEsR0FBQyxFQUF2RDtBQUEwRHFGO0FBQTFELE1BQW1FL0YsS0FBeEU7QUFBOEUsUUFBTWdHLFFBQVEsR0FBQ25CLEVBQUUsSUFBRWdCLEdBQW5COztBQUF1QixNQUFHTCxXQUFXLENBQUNTLEdBQVosQ0FBZ0JKLEdBQWhCLENBQUgsRUFBd0I7QUFBQyxRQUFHLENBQUNILFNBQVMsQ0FBQ08sR0FBVixDQUFjRCxRQUFkLENBQUosRUFBNEI7QUFBQ04sZUFBUyxDQUFDUSxHQUFWLENBQWNGLFFBQWQsRUFBRCxDQUF5Qjs7QUFDMTZCUixpQkFBVyxDQUFDVyxHQUFaLENBQWdCTixHQUFoQixFQUFxQmxDLElBQXJCLENBQTBCbUMsTUFBMUIsRUFBaUNDLE9BQWpDO0FBQTJDOztBQUFBO0FBQVE7O0FBQUEsUUFBTTlGLEVBQUUsR0FBQ0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQVQ7QUFBMEMsUUFBTWlHLFdBQVcsR0FBQyxJQUFJM0MsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBUzJDLE1BQVQsS0FBa0I7QUFBQ3BHLE1BQUUsQ0FBQ3FHLGdCQUFILENBQW9CLE1BQXBCLEVBQTJCLFlBQVU7QUFBQzVDLGFBQU87O0FBQUcsVUFBR29DLE1BQUgsRUFBVTtBQUFDQSxjQUFNLENBQUNTLElBQVAsQ0FBWSxJQUFaO0FBQW1CO0FBQUMsS0FBL0U7QUFBaUZ0RyxNQUFFLENBQUNxRyxnQkFBSCxDQUFvQixPQUFwQixFQUE0QixZQUFVO0FBQUNELFlBQU07O0FBQUcsVUFBR04sT0FBSCxFQUFXO0FBQUNBLGVBQU87QUFBSTtBQUFDLEtBQXhFO0FBQTJFLEdBQTNMLENBQWxCOztBQUErTSxNQUFHRixHQUFILEVBQU87QUFBQ0wsZUFBVyxDQUFDZ0IsR0FBWixDQUFnQlgsR0FBaEIsRUFBb0JPLFdBQXBCO0FBQWlDVixhQUFTLENBQUNRLEdBQVYsQ0FBY0YsUUFBZDtBQUF5Qjs7QUFBQSxNQUFHckYsdUJBQUgsRUFBMkI7QUFBQ1YsTUFBRSxDQUFDVyxTQUFILEdBQWFELHVCQUF1QixDQUFDRSxNQUF4QixJQUFnQyxFQUE3QztBQUFpRCxHQUE3RSxNQUFrRixJQUFHSCxRQUFILEVBQVk7QUFBQ1QsTUFBRSxDQUFDYSxXQUFILEdBQWUsT0FBT0osUUFBUCxLQUFrQixRQUFsQixHQUEyQkEsUUFBM0IsR0FBb0NLLEtBQUssQ0FBQ0MsT0FBTixDQUFjTixRQUFkLElBQXdCQSxRQUFRLENBQUNPLElBQVQsQ0FBYyxFQUFkLENBQXhCLEdBQTBDLEVBQTdGO0FBQWlHLEdBQTlHLE1BQW1ILElBQUc0RSxHQUFILEVBQU87QUFBQzVGLE1BQUUsQ0FBQzRGLEdBQUgsR0FBT0EsR0FBUDtBQUFZOztBQUFBLE9BQUksTUFBSyxDQUFDdEQsQ0FBRCxFQUFHa0UsS0FBSCxDQUFULElBQXFCQyxNQUFNLENBQUNDLE9BQVAsQ0FBZTNHLEtBQWYsQ0FBckIsRUFBMkM7QUFBQyxRQUFHeUcsS0FBSyxLQUFHbkcsU0FBUixJQUFtQnFGLFdBQVcsQ0FBQ2lCLFFBQVosQ0FBcUJyRSxDQUFyQixDQUF0QixFQUE4QztBQUFDO0FBQVU7O0FBQUEsVUFBTWhDLElBQUksR0FBQytFLFlBQVksQ0FBQzlGLGlCQUFiLENBQStCK0MsQ0FBL0IsS0FBbUNBLENBQUMsQ0FBQy9CLFdBQUYsRUFBOUM7QUFBOERQLE1BQUUsQ0FBQ1EsWUFBSCxDQUFnQkYsSUFBaEIsRUFBcUJrRyxLQUFyQjtBQUE2Qjs7QUFBQXZHLFVBQVEsQ0FBQzJHLElBQVQsQ0FBY0MsV0FBZCxDQUEwQjdHLEVBQTFCO0FBQStCLENBRHhFOztBQUN5RSxTQUFTOEcsc0JBQVQsQ0FBZ0MvRyxLQUFoQyxFQUFzQztBQUFDLFFBQUs7QUFBQ2dILFlBQVEsR0FBQztBQUFWLE1BQThCaEgsS0FBbkM7O0FBQXlDLE1BQUdnSCxRQUFRLEtBQUcsa0JBQWQsRUFBaUM7QUFBQ3BCLGNBQVUsQ0FBQzVGLEtBQUQsQ0FBVjtBQUFtQixHQUFyRCxNQUEwRCxJQUFHZ0gsUUFBUSxLQUFHLFlBQWQsRUFBMkI7QUFBQ0MsVUFBTSxDQUFDWCxnQkFBUCxDQUF3QixNQUF4QixFQUErQixNQUFJO0FBQUMsT0FBQyxHQUFFZixvQkFBb0IsQ0FBQ3RCLG1CQUF4QixFQUE2QyxNQUFJMkIsVUFBVSxDQUFDNUYsS0FBRCxDQUEzRDtBQUFxRSxLQUF6RztBQUE0RztBQUFDOztBQUFBLFNBQVNrSCxjQUFULENBQXdCbEgsS0FBeEIsRUFBOEI7QUFBQyxNQUFHRSxRQUFRLENBQUNpSCxVQUFULEtBQXNCLFVBQXpCLEVBQW9DO0FBQUMsS0FBQyxHQUFFNUIsb0JBQW9CLENBQUN0QixtQkFBeEIsRUFBNkMsTUFBSTJCLFVBQVUsQ0FBQzVGLEtBQUQsQ0FBM0Q7QUFBcUUsR0FBMUcsTUFBOEc7QUFBQ2lILFVBQU0sQ0FBQ1gsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBK0IsTUFBSTtBQUFDLE9BQUMsR0FBRWYsb0JBQW9CLENBQUN0QixtQkFBeEIsRUFBNkMsTUFBSTJCLFVBQVUsQ0FBQzVGLEtBQUQsQ0FBM0Q7QUFBcUUsS0FBekc7QUFBNEc7QUFBQzs7QUFBQSxTQUFTaUYsZ0JBQVQsQ0FBMEJtQyxpQkFBMUIsRUFBNEM7QUFBQ0EsbUJBQWlCLENBQUN2RSxPQUFsQixDQUEwQmtFLHNCQUExQjtBQUFtRDs7QUFBQSxTQUFTTSxNQUFULENBQWdCckgsS0FBaEIsRUFBc0I7QUFBQyxRQUFLO0FBQUM2RixPQUFHLEdBQUMsRUFBTDtBQUFRQyxVQUFNLEdBQUMsTUFBSSxDQUFFLENBQXJCO0FBQXNCa0IsWUFBUSxHQUFDLGtCQUEvQjtBQUFrRGpCO0FBQWxELE1BQTJEL0YsS0FBaEU7QUFBQSxRQUFzRXNILFNBQVMsR0FBQyxDQUFDLEdBQUVuQyw4QkFBOEIsQ0FBQ29DLE9BQWxDLEVBQTJDdkgsS0FBM0MsRUFBaUQsQ0FBQyxLQUFELEVBQU8sUUFBUCxFQUFnQix5QkFBaEIsRUFBMEMsVUFBMUMsRUFBcUQsU0FBckQsQ0FBakQsQ0FBaEYsQ0FBRCxDQUFtTTs7QUFDOW1ELFFBQUs7QUFBQ3dILGlCQUFEO0FBQWVDO0FBQWYsTUFBd0IsQ0FBQyxHQUFFckMsTUFBTSxDQUFDc0MsVUFBVixFQUFzQnJDLG1CQUFtQixDQUFDc0Msa0JBQTFDLENBQTdCO0FBQTJGLEdBQUMsR0FBRXZDLE1BQU0sQ0FBQ3dDLFNBQVYsRUFBcUIsTUFBSTtBQUFDLFFBQUdaLFFBQVEsS0FBRyxrQkFBZCxFQUFpQztBQUFDcEIsZ0JBQVUsQ0FBQzVGLEtBQUQsQ0FBVjtBQUFtQixLQUFyRCxNQUEwRCxJQUFHZ0gsUUFBUSxLQUFHLFlBQWQsRUFBMkI7QUFBQ0Usb0JBQWMsQ0FBQ2xILEtBQUQsQ0FBZDtBQUF1QjtBQUFDLEdBQXhJLEVBQXlJLENBQUNBLEtBQUQsRUFBT2dILFFBQVAsQ0FBekk7O0FBQTJKLE1BQUdBLFFBQVEsS0FBRyxtQkFBZCxFQUFrQztBQUFDLFFBQUdRLGFBQUgsRUFBaUI7QUFBQ0MsYUFBTyxDQUFDSSxpQkFBUixHQUEwQixDQUFDSixPQUFPLENBQUNJLGlCQUFSLElBQTJCLEVBQTVCLEVBQWdDQyxNQUFoQyxDQUF1QyxDQUFDLENBQUMsR0FBRTVDLFNBQVMsQ0FBQ3FDLE9BQWIsRUFBc0I7QUFBQzFCLFdBQUQ7QUFBS0MsY0FBTDtBQUFZQztBQUFaLE9BQXRCLEVBQTJDdUIsU0FBM0MsQ0FBRCxDQUF2QyxDQUExQjtBQUEwSEUsbUJBQWEsQ0FBQ0MsT0FBRCxDQUFiO0FBQXdCO0FBQUM7O0FBQUEsU0FBTyxJQUFQO0FBQWE7O0FBQUEsSUFBSU0sUUFBUSxHQUFDVixNQUFiO0FBQW9CL0gsZUFBQSxHQUFnQnlJLFFBQWhCLEM7Ozs7Ozs7Ozs7O0FDRmxkOzs7Ozs7Ozs7Ozs7QUFBQXpJLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSxZQUFBLEdBQWEwSSxJQUFiO0FBQWtCMUksWUFBQSxHQUFhMkksSUFBYjtBQUFrQjNJLGtCQUFBLEdBQW1CQSxZQUFBLEdBQWFBLGVBQUEsR0FBZ0IsS0FBSyxDQUFyRDs7QUFBdUQsSUFBSTRJLFVBQVUsR0FBQ25ELHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLHdFQUFELENBQVIsQ0FBckM7O0FBQTZELElBQUlJLE1BQU0sR0FBQytDLHVCQUF1QixDQUFDbkQsbUJBQU8sQ0FBQyxvQkFBRCxDQUFSLENBQWxDOztBQUFxRCxJQUFJb0QsT0FBTyxHQUFDckQsc0JBQXNCLENBQUNDLG1CQUFPLENBQUMsNENBQUQsQ0FBUixDQUFsQzs7QUFBaUUsSUFBSXFELFVBQVUsR0FBQ3JELG1CQUFPLENBQUMsa0VBQUQsQ0FBdEI7O0FBQXVELElBQUlzRCxnQkFBZ0IsR0FBQ3RELG1CQUFPLENBQUMsZ0ZBQUQsQ0FBNUI7O0FBQW9FLElBQUl1RCxNQUFNLEdBQUN2RCxtQkFBTyxDQUFDLDBEQUFELENBQWxCOztBQUErQzFGLHVCQUFBLEdBQXdCaUosTUFBTSxDQUFDQyxlQUEvQjtBQUErQ2xKLDRCQUFBLEdBQTZCaUosTUFBTSxDQUFDRSxvQkFBcEM7QUFBeURuSixxQkFBQSxHQUFzQmlKLE1BQU0sQ0FBQ0csYUFBN0I7O0FBQTJDLElBQUlDLGFBQWEsR0FBQzNELG1CQUFPLENBQUMsa0ZBQUQsQ0FBekI7O0FBQWtFLElBQUk0RCxPQUFPLEdBQUM1RCxtQkFBTyxDQUFDLGdFQUFELENBQW5COztBQUFtRCxJQUFJNkQsV0FBVyxHQUFDN0QsbUJBQU8sQ0FBQywyRUFBRCxDQUF2Qjs7QUFBZ0QsSUFBSThELE9BQU8sR0FBQy9ELHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLG1FQUFELENBQVIsQ0FBbEM7O0FBQWdFLFNBQVMrRCx3QkFBVCxHQUFtQztBQUFDLE1BQUcsT0FBT0MsT0FBUCxLQUFpQixVQUFwQixFQUErQixPQUFPLElBQVA7QUFBWSxNQUFJQyxLQUFLLEdBQUMsSUFBSUQsT0FBSixFQUFWOztBQUF3QkQsMEJBQXdCLEdBQUMsWUFBVTtBQUFDLFdBQU9FLEtBQVA7QUFBYyxHQUFsRDs7QUFBbUQsU0FBT0EsS0FBUDtBQUFjOztBQUFBLFNBQVNkLHVCQUFULENBQWlDZSxHQUFqQyxFQUFxQztBQUFDLE1BQUdBLEdBQUcsSUFBRUEsR0FBRyxDQUFDQyxVQUFaLEVBQXVCO0FBQUMsV0FBT0QsR0FBUDtBQUFZOztBQUFBLE1BQUdBLEdBQUcsS0FBRyxJQUFOLElBQVksT0FBT0EsR0FBUCxLQUFhLFFBQWIsSUFBdUIsT0FBT0EsR0FBUCxLQUFhLFVBQW5ELEVBQThEO0FBQUMsV0FBTTtBQUFDM0IsYUFBTyxFQUFDMkI7QUFBVCxLQUFOO0FBQXFCOztBQUFBLE1BQUlELEtBQUssR0FBQ0Ysd0JBQXdCLEVBQWxDOztBQUFxQyxNQUFHRSxLQUFLLElBQUVBLEtBQUssQ0FBQ2hELEdBQU4sQ0FBVWlELEdBQVYsQ0FBVixFQUF5QjtBQUFDLFdBQU9ELEtBQUssQ0FBQzlDLEdBQU4sQ0FBVStDLEdBQVYsQ0FBUDtBQUF1Qjs7QUFBQSxNQUFJRSxNQUFNLEdBQUMsRUFBWDtBQUFjLE1BQUlDLHFCQUFxQixHQUFDM0MsTUFBTSxDQUFDNEMsY0FBUCxJQUF1QjVDLE1BQU0sQ0FBQzZDLHdCQUF4RDs7QUFBaUYsT0FBSSxJQUFJQyxHQUFSLElBQWVOLEdBQWYsRUFBbUI7QUFBQyxRQUFHeEMsTUFBTSxDQUFDK0MsU0FBUCxDQUFpQnBKLGNBQWpCLENBQWdDa0csSUFBaEMsQ0FBcUMyQyxHQUFyQyxFQUF5Q00sR0FBekMsQ0FBSCxFQUFpRDtBQUFDLFVBQUlFLElBQUksR0FBQ0wscUJBQXFCLEdBQUMzQyxNQUFNLENBQUM2Qyx3QkFBUCxDQUFnQ0wsR0FBaEMsRUFBb0NNLEdBQXBDLENBQUQsR0FBMEMsSUFBeEU7O0FBQTZFLFVBQUdFLElBQUksS0FBR0EsSUFBSSxDQUFDdkQsR0FBTCxJQUFVdUQsSUFBSSxDQUFDbEQsR0FBbEIsQ0FBUCxFQUE4QjtBQUFDRSxjQUFNLENBQUM0QyxjQUFQLENBQXNCRixNQUF0QixFQUE2QkksR0FBN0IsRUFBaUNFLElBQWpDO0FBQXdDLE9BQXZFLE1BQTJFO0FBQUNOLGNBQU0sQ0FBQ0ksR0FBRCxDQUFOLEdBQVlOLEdBQUcsQ0FBQ00sR0FBRCxDQUFmO0FBQXNCO0FBQUM7QUFBQzs7QUFBQUosUUFBTSxDQUFDN0IsT0FBUCxHQUFlMkIsR0FBZjs7QUFBbUIsTUFBR0QsS0FBSCxFQUFTO0FBQUNBLFNBQUssQ0FBQ3pDLEdBQU4sQ0FBVTBDLEdBQVYsRUFBY0UsTUFBZDtBQUF1Qjs7QUFBQSxTQUFPQSxNQUFQO0FBQWU7O0FBQUEsU0FBU3JFLHNCQUFULENBQWdDbUUsR0FBaEMsRUFBb0M7QUFBQyxTQUFPQSxHQUFHLElBQUVBLEdBQUcsQ0FBQ0MsVUFBVCxHQUFvQkQsR0FBcEIsR0FBd0I7QUFBQzNCLFdBQU8sRUFBQzJCO0FBQVQsR0FBL0I7QUFBOEM7O0FBQUEsU0FBU1MsZ0JBQVQsQ0FBMEJDLGFBQTFCLEVBQXdDQyxRQUF4QyxFQUFpREMsU0FBakQsRUFBMkQ7QUFBQyxRQUFNQyxXQUFXLEdBQUMsQ0FBQyxHQUFFcEIsYUFBYSxDQUFDcUIsWUFBakIsRUFBK0JKLGFBQS9CLEVBQTZDLE9BQTdDLENBQWxCO0FBQXdFLFFBQU1LLFNBQVMsR0FBQ0gsU0FBUyxHQUFDLEVBQUQsR0FBSSxDQUFDLEdBQUVuQixhQUFhLENBQUNxQixZQUFqQixFQUErQkosYUFBL0IsRUFBNkNDLFFBQTdDLENBQTdCO0FBQW9GLFNBQU07QUFBQ0UsZUFBRDtBQUFhRSxhQUFiO0FBQXVCQyxZQUFRLEVBQUMsQ0FBQyxHQUFHLElBQUk3RyxHQUFKLENBQVEsQ0FBQyxHQUFHMEcsV0FBSixFQUFnQixHQUFHRSxTQUFuQixDQUFSLENBQUo7QUFBaEMsR0FBTjtBQUFvRjs7QUFBQSxTQUFTRSxrQkFBVCxDQUE0QkMsT0FBNUIsRUFBb0NwSyxLQUFwQyxFQUEwQztBQUFDO0FBQ3BqRTtBQUNBLFFBQUs7QUFBQ3FLLGVBQUQ7QUFBYVQsaUJBQWI7QUFBMkJVLGlDQUEzQjtBQUF5REM7QUFBekQsTUFBa0ZILE9BQXZGO0FBQStGLFNBQU9SLGFBQWEsQ0FBQ1ksYUFBZCxDQUE0Qm5JLE1BQTVCLENBQW1Db0ksUUFBUSxJQUFFQSxRQUFRLENBQUNDLFFBQVQsQ0FBa0IsS0FBbEIsS0FBMEIsQ0FBQ0QsUUFBUSxDQUFDQyxRQUFULENBQWtCLFlBQWxCLENBQXhFLEVBQXlHdEksR0FBekcsQ0FBNkdxSSxRQUFRLElBQUUsYUFBYXJGLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsUUFBN0IsRUFBc0M7QUFBQ3FKLE9BQUcsRUFBQ2lCLFFBQUw7QUFBY0UsU0FBSyxFQUFDLENBQUNKLHVCQUFyQjtBQUE2Q0ssU0FBSyxFQUFDNUssS0FBSyxDQUFDNEssS0FBekQ7QUFBK0RDLGVBQVcsRUFBQzdLLEtBQUssQ0FBQzZLLFdBQU4sSUFBbUJDLFNBQTlGO0FBQThIakwsWUFBUSxFQUFDLElBQXZJO0FBQTRJZ0csT0FBRyxFQUFFLEdBQUV3RSxXQUFZLFVBQVNJLFFBQVMsR0FBRUgsNkJBQThCO0FBQWpOLEdBQXRDLENBQXBJLENBQVA7QUFBd1k7O0FBQUEsU0FBU1MsaUJBQVQsQ0FBMkJYLE9BQTNCLEVBQW1DcEssS0FBbkMsRUFBeUM7QUFBQyxRQUFLO0FBQUNnTCxnQkFBRDtBQUFjVDtBQUFkLE1BQXVDSCxPQUE1QztBQUFvRCxTQUFNLENBQUNZLFlBQVksQ0FBQ25ELGlCQUFiLElBQWdDLEVBQWpDLEVBQXFDekYsR0FBckMsQ0FBeUM2SSxJQUFJLElBQUU7QUFBQyxVQUFLO0FBQUNqRTtBQUFELFFBQTBCaUUsSUFBL0I7QUFBQSxVQUFrQkMsV0FBbEIsNEJBQStCRCxJQUEvQjs7QUFBb0MsV0FBTSxhQUFhN0YsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixRQUE3QixFQUFzQ3VHLE1BQU0sQ0FBQ3lFLE1BQVAsQ0FBYyxFQUFkLEVBQWlCRCxXQUFqQixFQUE2QjtBQUFDUCxXQUFLLEVBQUMsQ0FBQ0osdUJBQVI7QUFBZ0NLLFdBQUssRUFBQzVLLEtBQUssQ0FBQzRLLEtBQTVDO0FBQWtEQyxpQkFBVyxFQUFDN0ssS0FBSyxDQUFDNkssV0FBTixJQUFtQkMsU0FBK0JNO0FBQWhILEtBQTdCLENBQXRDLENBQW5CO0FBQTJNLEdBQS9SLENBQU47QUFBd1M7O0FBQUEsU0FBU0MsZ0JBQVQsQ0FBMEJqQixPQUExQixFQUFrQ3BLLEtBQWxDLEVBQXdDc0wsS0FBeEMsRUFBOEM7QUFBQyxRQUFLO0FBQUNDLGtCQUFEO0FBQWdCbEIsZUFBaEI7QUFBNEJtQixpQkFBNUI7QUFBMENsQixpQ0FBMUM7QUFBd0VDO0FBQXhFLE1BQWlHSCxPQUF0RztBQUE4RyxTQUFPbUIsY0FBYyxDQUFDbkosR0FBZixDQUFtQjZJLElBQUksSUFBRTtBQUFDLFFBQUcsQ0FBQ0EsSUFBSSxDQUFDUCxRQUFMLENBQWMsS0FBZCxDQUFELElBQXVCWSxLQUFLLENBQUNwQixRQUFOLENBQWV0RCxRQUFmLENBQXdCcUUsSUFBeEIsQ0FBMUIsRUFBd0QsT0FBTyxJQUFQO0FBQVksV0FBTSxhQUFhN0YsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixRQUE3QixFQUFzQztBQUFDc0wsV0FBSyxFQUFDLENBQUNELGFBQUQsSUFBZ0JqQix1QkFBdkI7QUFBK0NJLFdBQUssRUFBQyxDQUFDSix1QkFBdEQ7QUFBOEVmLFNBQUcsRUFBQ3lCLElBQWxGO0FBQXVGcEYsU0FBRyxFQUFFLEdBQUV3RSxXQUFZLFVBQVNxQixTQUFTLENBQUNULElBQUQsQ0FBTyxHQUFFWCw2QkFBOEIsRUFBbks7QUFBcUtNLFdBQUssRUFBQzVLLEtBQUssQ0FBQzRLLEtBQWpMO0FBQXVMQyxpQkFBVyxFQUFDN0ssS0FBSyxDQUFDNkssV0FBTixJQUFtQkMsU0FBK0JNO0FBQXJQLEtBQXRDLENBQW5CO0FBQWtULEdBQWhaLENBQVA7QUFBMFo7O0FBQUEsU0FBU08sVUFBVCxDQUFvQnZCLE9BQXBCLEVBQTRCcEssS0FBNUIsRUFBa0NzTCxLQUFsQyxFQUF3QztBQUFDLE1BQUlNLHFCQUFKOztBQUEwQixRQUFLO0FBQUN2QixlQUFEO0FBQWFULGlCQUFiO0FBQTJCNEIsaUJBQTNCO0FBQXlDbEIsaUNBQXpDO0FBQXVFQztBQUF2RSxNQUFnR0gsT0FBckc7QUFBNkcsUUFBTXlCLGFBQWEsR0FBQ1AsS0FBSyxDQUFDcEIsUUFBTixDQUFlN0gsTUFBZixDQUFzQjRJLElBQUksSUFBRUEsSUFBSSxDQUFDUCxRQUFMLENBQWMsS0FBZCxDQUE1QixDQUFwQjtBQUFzRSxRQUFNb0Isa0JBQWtCLEdBQUMsQ0FBQ0YscUJBQXFCLEdBQUNoQyxhQUFhLENBQUNtQyxnQkFBckMsS0FBd0QsSUFBeEQsR0FBNkQsS0FBSyxDQUFsRSxHQUFvRUgscUJBQXFCLENBQUN2SixNQUF0QixDQUE2QjRJLElBQUksSUFBRUEsSUFBSSxDQUFDUCxRQUFMLENBQWMsS0FBZCxDQUFuQyxDQUE3RjtBQUFzSixTQUFNLENBQUMsR0FBR21CLGFBQUosRUFBa0IsR0FBR0Msa0JBQXJCLEVBQXlDMUosR0FBekMsQ0FBNkM2SSxJQUFJLElBQUU7QUFBQyxXQUFNLGFBQWE3RixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLFFBQTdCLEVBQXNDO0FBQUNxSixTQUFHLEVBQUN5QixJQUFMO0FBQVVwRixTQUFHLEVBQUUsR0FBRXdFLFdBQVksVUFBU3FCLFNBQVMsQ0FBQ1QsSUFBRCxDQUFPLEdBQUVYLDZCQUE4QixFQUF0RjtBQUF3Rk0sV0FBSyxFQUFDNUssS0FBSyxDQUFDNEssS0FBcEc7QUFBMEdhLFdBQUssRUFBQyxDQUFDRCxhQUFELElBQWdCakIsdUJBQWhJO0FBQXdKSSxXQUFLLEVBQUMsQ0FBQ0osdUJBQS9KO0FBQXVMTSxpQkFBVyxFQUFDN0ssS0FBSyxDQUFDNkssV0FBTixJQUFtQkMsU0FBK0JNO0FBQXJQLEtBQXRDLENBQW5CO0FBQWtULEdBQXRXLENBQU47QUFBK1c7QUFBQTtBQUMvcEU7QUFDQTtBQUNBOzs7QUFBRyxNQUFNWSxRQUFOLFNBQXVCNUcsTUFBTSxDQUFDNkcsU0FBOUIsQ0FBdUM7QUFBQztBQUMzQztBQUNBO0FBQ0E7QUFBSyxlQUFhQyxlQUFiLENBQTZCQyxHQUE3QixFQUFpQztBQUFDLFVBQU1DLFVBQVUsR0FBQ0MsR0FBRyxJQUFFO0FBQUMsYUFBT3JNLEtBQUssSUFBRSxhQUFhb0YsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QmtNLEdBQTdCLEVBQWlDck0sS0FBakMsQ0FBM0I7QUFBb0UsS0FBM0Y7O0FBQTRGLFVBQUs7QUFBQ3NNLFVBQUQ7QUFBTS9JO0FBQU4sUUFBWSxNQUFNNEksR0FBRyxDQUFDSSxVQUFKLENBQWU7QUFBQ0g7QUFBRCxLQUFmLENBQXZCO0FBQW9ELFVBQU1JLE1BQU0sR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFFcEUsT0FBTyxDQUFDYixPQUFYLEdBQUosQ0FBYjtBQUF3QyxXQUFNO0FBQUMrRSxVQUFEO0FBQU0vSSxVQUFOO0FBQVdpSjtBQUFYLEtBQU47QUFBMEI7O0FBQUEsU0FBT0MsY0FBUCxDQUFzQkMsaUJBQXRCLEVBQXdDMU0sS0FBeEMsRUFBOEM7QUFBQyxXQUFNLGFBQWFvRixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCbUksZ0JBQWdCLENBQUNFLGVBQWpCLENBQWlDbUUsUUFBOUQsRUFBdUU7QUFBQ2xHLFdBQUssRUFBQ3pHO0FBQVAsS0FBdkUsRUFBcUYsYUFBYW9GLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkJ1TSxpQkFBN0IsRUFBK0MxTSxLQUEvQyxDQUFsRyxDQUFuQjtBQUE2Szs7QUFBQTRNLFFBQU0sR0FBRTtBQUFDLFdBQU0sYUFBYXhILE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkI2SCxJQUE3QixFQUFrQyxJQUFsQyxFQUF1QyxhQUFhNUMsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QjBNLElBQTdCLEVBQWtDLElBQWxDLENBQXBELEVBQTRGLGFBQWF6SCxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DLElBQXBDLEVBQXlDLGFBQWFpRixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCOEgsSUFBN0IsRUFBa0MsSUFBbEMsQ0FBdEQsRUFBOEYsYUFBYTdDLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIyTSxVQUE3QixFQUF3QyxJQUF4QyxDQUEzRyxDQUF6RyxDQUFuQjtBQUF3Ujs7QUFINXNCOztBQUc2c0J4TixlQUFBLEdBQWdCME0sUUFBaEI7O0FBQXlCLFNBQVNoRSxJQUFULENBQWNoSSxLQUFkLEVBQW9CO0FBQUMsUUFBSztBQUFDOEosYUFBRDtBQUFXaUQseUJBQVg7QUFBaUNDO0FBQWpDLE1BQXlDLENBQUMsR0FBRTVILE1BQU0sQ0FBQ3NDLFVBQVYsRUFBc0JZLGdCQUFnQixDQUFDRSxlQUF2QyxDQUE5QztBQUFzR3VFLHVCQUFxQixDQUFDL0UsSUFBdEIsR0FBMkIsSUFBM0I7QUFBZ0MsU0FBTSxhQUFhNUMsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixNQUE3QixFQUFvQ3VHLE1BQU0sQ0FBQ3lFLE1BQVAsQ0FBYyxFQUFkLEVBQWlCbkwsS0FBakIsRUFBdUI7QUFBQ2lOLFFBQUksRUFBQ2pOLEtBQUssQ0FBQ2lOLElBQU4sSUFBWUQsTUFBWixJQUFvQjFNLFNBQTFCO0FBQW9DNE0sT0FBRyxFQUFDcEQsU0FBUyxHQUFDLEVBQUQsR0FBSXhKLFNBQXJEO0FBQStELHVCQUFrQndKLFNBQVMsUUFBVCxHQUErQyxFQUEvQyxHQUFrRHhKO0FBQW5JLEdBQXZCLENBQXBDLENBQW5CO0FBQStOOztBQUFBLE1BQU11TSxJQUFOLFNBQW1CekgsTUFBTSxDQUFDNkcsU0FBMUIsQ0FBbUM7QUFBQ2tCLGFBQVcsQ0FBQyxHQUFHQyxJQUFKLEVBQVM7QUFBQyxVQUFNLEdBQUdBLElBQVQ7QUFBZSxTQUFLaEQsT0FBTCxHQUFhLEtBQUssQ0FBbEI7QUFBcUI7O0FBQUFpRCxhQUFXLENBQUMvQixLQUFELEVBQU87QUFBQyxVQUFLO0FBQUNqQixpQkFBRDtBQUFhQyxtQ0FBYjtBQUEyQ2lCO0FBQTNDLFFBQTJELEtBQUtuQixPQUFyRTtBQUE2RSxVQUFNa0QsUUFBUSxHQUFDaEMsS0FBSyxDQUFDcEIsUUFBTixDQUFlN0gsTUFBZixDQUFzQmtMLENBQUMsSUFBRUEsQ0FBQyxDQUFDN0MsUUFBRixDQUFXLE1BQVgsQ0FBekIsQ0FBZjtBQUE0RCxVQUFNWCxXQUFXLEdBQUMsSUFBSTFHLEdBQUosQ0FBUWlJLEtBQUssQ0FBQ3ZCLFdBQWQsQ0FBbEIsQ0FBMUksQ0FBdUw7QUFDaDdDOztBQUNBLFFBQUl5RCxhQUFhLEdBQUMsSUFBSW5LLEdBQUosQ0FBUSxFQUFSLENBQWxCO0FBQThCLFFBQUlvSyxlQUFlLEdBQUMxTSxLQUFLLENBQUMyTSxJQUFOLENBQVcsSUFBSXJLLEdBQUosQ0FBUWtJLGNBQWMsQ0FBQ2xKLE1BQWYsQ0FBc0I0SSxJQUFJLElBQUVBLElBQUksQ0FBQ1AsUUFBTCxDQUFjLE1BQWQsQ0FBNUIsQ0FBUixDQUFYLENBQXBCOztBQUE0RixRQUFHK0MsZUFBZSxDQUFDaEwsTUFBbkIsRUFBMEI7QUFBQyxZQUFNa0wsUUFBUSxHQUFDLElBQUl0SyxHQUFKLENBQVFpSyxRQUFSLENBQWY7QUFBaUNHLHFCQUFlLEdBQUNBLGVBQWUsQ0FBQ3BMLE1BQWhCLENBQXVCa0wsQ0FBQyxJQUFFLEVBQUVJLFFBQVEsQ0FBQzFILEdBQVQsQ0FBYXNILENBQWIsS0FBaUJ4RCxXQUFXLENBQUM5RCxHQUFaLENBQWdCc0gsQ0FBaEIsQ0FBbkIsQ0FBMUIsQ0FBaEI7QUFBa0ZDLG1CQUFhLEdBQUMsSUFBSW5LLEdBQUosQ0FBUW9LLGVBQVIsQ0FBZDtBQUF1Q0gsY0FBUSxDQUFDcEwsSUFBVCxDQUFjLEdBQUd1TCxlQUFqQjtBQUFtQzs7QUFBQSxRQUFJRyxlQUFlLEdBQUMsRUFBcEI7QUFBdUJOLFlBQVEsQ0FBQ3pLLE9BQVQsQ0FBaUJvSSxJQUFJLElBQUU7QUFBQyxZQUFNNEMsWUFBWSxHQUFDOUQsV0FBVyxDQUFDOUQsR0FBWixDQUFnQmdGLElBQWhCLENBQW5COztBQUF5QyxVQUFHLElBQUgsRUFBb0M7QUFBQzJDLHVCQUFlLENBQUMxTCxJQUFoQixFQUFxQixhQUFha0QsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixNQUE3QixFQUFvQztBQUFDcUosYUFBRyxFQUFFLEdBQUV5QixJQUFLLFVBQWI7QUFBdUJMLGVBQUssRUFBQyxLQUFLNUssS0FBTCxDQUFXNEssS0FBeEM7QUFBOENrRCxhQUFHLEVBQUMsU0FBbEQ7QUFBNERoSyxjQUFJLEVBQUUsR0FBRXVHLFdBQVksVUFBU3FCLFNBQVMsQ0FBQ1QsSUFBRCxDQUFPLEdBQUVYLDZCQUE4QixFQUF6STtBQUEySXlELFlBQUUsRUFBQyxPQUE5STtBQUFzSmxELHFCQUFXLEVBQUMsS0FBSzdLLEtBQUwsQ0FBVzZLLFdBQVgsSUFBd0JDLFNBQStCTTtBQUF6TixTQUFwQyxDQUFsQztBQUFvUzs7QUFBQSxZQUFNNEMsZUFBZSxHQUFDUixhQUFhLENBQUN2SCxHQUFkLENBQWtCZ0YsSUFBbEIsQ0FBdEI7QUFBOEMyQyxxQkFBZSxDQUFDMUwsSUFBaEIsRUFBcUIsYUFBYWtELE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsTUFBN0IsRUFBb0M7QUFBQ3FKLFdBQUcsRUFBQ3lCLElBQUw7QUFBVUwsYUFBSyxFQUFDLEtBQUs1SyxLQUFMLENBQVc0SyxLQUEzQjtBQUFpQ2tELFdBQUcsRUFBQyxZQUFyQztBQUFrRGhLLFlBQUksRUFBRSxHQUFFdUcsV0FBWSxVQUFTcUIsU0FBUyxDQUFDVCxJQUFELENBQU8sR0FBRVgsNkJBQThCLEVBQS9IO0FBQWlJTyxtQkFBVyxFQUFDLEtBQUs3SyxLQUFMLENBQVc2SyxXQUFYLElBQXdCQyxTQUFySztBQUFxTSxvQkFBV2tELGVBQWUsR0FBQzFOLFNBQUQsR0FBV3VOLFlBQVksR0FBQyxFQUFELEdBQUl2TixTQUExUDtBQUFvUSxvQkFBVzBOLGVBQWUsR0FBQzFOLFNBQUQsR0FBV3VOLFlBQVksR0FBQ3ZOLFNBQUQsR0FBVztBQUFoVSxPQUFwQyxDQUFsQztBQUE2WSxLQUFyMEI7O0FBQXUwQixRQUFHLEtBQUgsRUFBMkUsRUFBNEQ7O0FBQUEsV0FBT3NOLGVBQWUsQ0FBQ25MLE1BQWhCLEtBQXlCLENBQXpCLEdBQTJCLElBQTNCLEdBQWdDbUwsZUFBdkM7QUFBd0Q7O0FBQUFLLHlCQUF1QixHQUFFO0FBQUMsVUFBSztBQUFDMUMsb0JBQUQ7QUFBZ0JsQixpQkFBaEI7QUFBNEJDO0FBQTVCLFFBQTJELEtBQUtGLE9BQXJFO0FBQTZFLFdBQU9tQixjQUFjLENBQUNuSixHQUFmLENBQW1CNkksSUFBSSxJQUFFO0FBQUMsVUFBRyxDQUFDQSxJQUFJLENBQUNQLFFBQUwsQ0FBYyxLQUFkLENBQUosRUFBeUI7QUFBQyxlQUFPLElBQVA7QUFBYTs7QUFBQSxhQUFNLGFBQWF0RixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DO0FBQUMyTixXQUFHLEVBQUMsU0FBTDtBQUFldEUsV0FBRyxFQUFDeUIsSUFBbkI7QUFBd0JuSCxZQUFJLEVBQUUsR0FBRXVHLFdBQVksVUFBU3FCLFNBQVMsQ0FBQ1QsSUFBRCxDQUFPLEdBQUVYLDZCQUE4QixFQUFyRztBQUF1R3lELFVBQUUsRUFBQyxRQUExRztBQUFtSG5ELGFBQUssRUFBQyxLQUFLNUssS0FBTCxDQUFXNEssS0FBcEk7QUFBMElDLG1CQUFXLEVBQUMsS0FBSzdLLEtBQUwsQ0FBVzZLLFdBQVgsSUFBd0JDLFNBQStCTTtBQUE3TSxPQUFwQyxDQUFuQjtBQUF3USxLQUF6VSxFQUEwVTtBQUExVSxLQUM1OUMvSSxNQUQ0OUMsQ0FDcjlDNkwsT0FEcTlDLENBQVA7QUFDcDhDOztBQUFBQyxxQkFBbUIsQ0FBQzdDLEtBQUQsRUFBTztBQUFDLFVBQUs7QUFBQ2pCLGlCQUFEO0FBQWFDLG1DQUFiO0FBQTJDVTtBQUEzQyxRQUF5RCxLQUFLWixPQUFuRTtBQUEyRSxVQUFNZ0UsWUFBWSxHQUFDOUMsS0FBSyxDQUFDcEIsUUFBTixDQUFlN0gsTUFBZixDQUFzQjRJLElBQUksSUFBRTtBQUFDLGFBQU9BLElBQUksQ0FBQ1AsUUFBTCxDQUFjLEtBQWQsQ0FBUDtBQUE2QixLQUExRCxDQUFuQjtBQUErRSxXQUFNLENBQUMsR0FBRyxDQUFDTSxZQUFZLENBQUNuRCxpQkFBYixJQUFnQyxFQUFqQyxFQUFxQ3pGLEdBQXJDLENBQXlDNkksSUFBSSxJQUFFLGFBQWE3RixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DO0FBQUNxSixTQUFHLEVBQUN5QixJQUFJLENBQUNwRixHQUFWO0FBQWMrRSxXQUFLLEVBQUMsS0FBSzVLLEtBQUwsQ0FBVzRLLEtBQS9CO0FBQXFDa0QsU0FBRyxFQUFDLFNBQXpDO0FBQW1EaEssVUFBSSxFQUFDbUgsSUFBSSxDQUFDcEYsR0FBN0Q7QUFBaUVrSSxRQUFFLEVBQUMsUUFBcEU7QUFBNkVsRCxpQkFBVyxFQUFDLEtBQUs3SyxLQUFMLENBQVc2SyxXQUFYLElBQXdCQyxTQUErQk07QUFBaEosS0FBcEMsQ0FBNUQsQ0FBSixFQUF3UCxHQUFHZ0QsWUFBWSxDQUFDaE0sR0FBYixDQUFpQjZJLElBQUksSUFBRSxhQUFhN0YsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixNQUE3QixFQUFvQztBQUFDcUosU0FBRyxFQUFDeUIsSUFBTDtBQUFVTCxXQUFLLEVBQUMsS0FBSzVLLEtBQUwsQ0FBVzRLLEtBQTNCO0FBQWlDa0QsU0FBRyxFQUFDLFNBQXJDO0FBQStDaEssVUFBSSxFQUFFLEdBQUV1RyxXQUFZLFVBQVNxQixTQUFTLENBQUNULElBQUQsQ0FBTyxHQUFFWCw2QkFBOEIsRUFBNUg7QUFBOEh5RCxRQUFFLEVBQUMsUUFBakk7QUFBMElsRCxpQkFBVyxFQUFDLEtBQUs3SyxLQUFMLENBQVc2SyxXQUFYLElBQXdCQyxTQUErQk07QUFBN00sS0FBcEMsQ0FBcEMsQ0FBM1AsQ0FBTjtBQUE0aEI7O0FBQUFDLGtCQUFnQixDQUFDQyxLQUFELEVBQU87QUFBQyxXQUFPRCxnQkFBZ0IsQ0FBQyxLQUFLakIsT0FBTixFQUFjLEtBQUtwSyxLQUFuQixFQUF5QnNMLEtBQXpCLENBQXZCO0FBQXdEOztBQUFBUCxtQkFBaUIsR0FBRTtBQUFDLFdBQU9BLGlCQUFpQixDQUFDLEtBQUtYLE9BQU4sRUFBYyxLQUFLcEssS0FBbkIsQ0FBeEI7QUFBbUQ7O0FBQUEyTCxZQUFVLENBQUNMLEtBQUQsRUFBTztBQUFDLFdBQU9LLFVBQVUsQ0FBQyxLQUFLdkIsT0FBTixFQUFjLEtBQUtwSyxLQUFuQixFQUF5QnNMLEtBQXpCLENBQWpCO0FBQWtEOztBQUFBbkIsb0JBQWtCLEdBQUU7QUFBQyxXQUFPQSxrQkFBa0IsQ0FBQyxLQUFLQyxPQUFOLEVBQWMsS0FBS3BLLEtBQW5CLENBQXpCO0FBQW9EOztBQUFBcU8saUNBQStCLENBQUMzTixRQUFELEVBQVU7QUFBQyxVQUFLO0FBQUNzSztBQUFELFFBQWUsS0FBS1osT0FBekI7QUFBaUMsVUFBTWhELGlCQUFpQixHQUFDLEVBQXhCO0FBQTJCLFVBQU1rSCxnQkFBZ0IsR0FBQyxFQUF2Qjs7QUFBMEJsSixVQUFNLENBQUNtQyxPQUFQLENBQWVnSCxRQUFmLENBQXdCMUwsT0FBeEIsQ0FBZ0NuQyxRQUFoQyxFQUF5QzhOLEtBQUssSUFBRTtBQUFDLFVBQUdBLEtBQUssQ0FBQ3pPLElBQU4sS0FBYStJLE9BQU8sQ0FBQ3ZCLE9BQXhCLEVBQWdDO0FBQUMsWUFBR2lILEtBQUssQ0FBQ3hPLEtBQU4sQ0FBWWdILFFBQVosS0FBdUIsbUJBQTFCLEVBQThDO0FBQUNnRSxzQkFBWSxDQUFDbkQsaUJBQWIsR0FBK0IsQ0FBQ21ELFlBQVksQ0FBQ25ELGlCQUFiLElBQWdDLEVBQWpDLEVBQXFDQyxNQUFyQyxDQUE0QyxtQkFBSzBHLEtBQUssQ0FBQ3hPLEtBQVgsRUFBNUMsQ0FBL0I7QUFBK0Y7QUFBUSxTQUF0SixNQUEySixJQUFHLENBQUMsWUFBRCxFQUFjLGtCQUFkLEVBQWtDNEcsUUFBbEMsQ0FBMkM0SCxLQUFLLENBQUN4TyxLQUFOLENBQVlnSCxRQUF2RCxDQUFILEVBQW9FO0FBQUNJLDJCQUFpQixDQUFDbEYsSUFBbEIsQ0FBdUJzTSxLQUFLLENBQUN4TyxLQUE3QjtBQUFvQztBQUFRO0FBQUM7O0FBQUFzTyxzQkFBZ0IsQ0FBQ3BNLElBQWpCLENBQXNCc00sS0FBdEI7QUFBOEIsS0FBN1g7O0FBQStYLFNBQUtwRSxPQUFMLENBQWFxRSxhQUFiLENBQTJCekQsWUFBM0IsR0FBd0M1RCxpQkFBeEM7QUFBMEQsV0FBT2tILGdCQUFQO0FBQXlCOztBQUFBSSxxQkFBbUIsQ0FBQ0MsSUFBRCxFQUFNO0FBQUMsV0FBT3ZKLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZWdILFFBQWYsQ0FBd0JuTSxHQUF4QixDQUE0QnVNLElBQTVCLEVBQWlDQyxDQUFDLElBQUU7QUFBQyxVQUFHQSxDQUFDLENBQUM3TyxJQUFGLEtBQVMsTUFBVCxJQUFpQjZPLENBQUMsQ0FBQzVPLEtBQUYsQ0FBUSxNQUFSLENBQWpCLElBQWtDcUksVUFBVSxDQUFDd0csd0JBQVgsQ0FBb0NDLElBQXBDLENBQXlDLENBQUM7QUFBQ0M7QUFBRCxPQUFELEtBQVNILENBQUMsQ0FBQzVPLEtBQUYsQ0FBUSxNQUFSLEVBQWdCZ1AsVUFBaEIsQ0FBMkJELEdBQTNCLENBQWxELENBQXJDLEVBQXdIO0FBQUMsY0FBTUUsUUFBUSxxQkFBTUwsQ0FBQyxDQUFDNU8sS0FBRixJQUFTLEVBQWYsQ0FBZDs7QUFBa0NpUCxnQkFBUSxDQUFDLFdBQUQsQ0FBUixHQUFzQkEsUUFBUSxDQUFDLE1BQUQsQ0FBOUI7QUFBdUNBLGdCQUFRLENBQUMsTUFBRCxDQUFSLEdBQWlCM08sU0FBakI7QUFBMkIsZUFBTSxhQUFhOEUsTUFBTSxDQUFDbUMsT0FBUCxDQUFlMkgsWUFBZixDQUE0Qk4sQ0FBNUIsRUFBOEJLLFFBQTlCLENBQW5CO0FBQTRELE9BQXpSLE1BQThSLElBQUdMLENBQUMsQ0FBQzVPLEtBQUYsSUFBUzRPLENBQUMsQ0FBQzVPLEtBQUYsQ0FBUSxVQUFSLENBQVosRUFBZ0M7QUFBQzRPLFNBQUMsQ0FBQzVPLEtBQUYsQ0FBUSxVQUFSLElBQW9CLEtBQUswTyxtQkFBTCxDQUF5QkUsQ0FBQyxDQUFDNU8sS0FBRixDQUFRLFVBQVIsQ0FBekIsQ0FBcEI7QUFBbUU7O0FBQUEsYUFBTzRPLENBQVA7QUFBVSxLQUFqYixDQUFQO0FBQTJiOztBQUFBaEMsUUFBTSxHQUFFO0FBQUMsUUFBSXVDLGlCQUFKLEVBQXNCQyxrQkFBdEI7O0FBQXlDLFVBQUs7QUFBQzVDLFlBQUQ7QUFBUTZDLGFBQVI7QUFBZ0J2RixlQUFoQjtBQUEwQndGLGVBQTFCO0FBQW9DQyxtQkFBcEM7QUFBa0RkLG1CQUFsRDtBQUFnRWUscUJBQWhFO0FBQWdGQyxjQUFoRjtBQUF5RkMsd0JBQXpGO0FBQTRHQyx3QkFBNUc7QUFBK0hwRjtBQUEvSCxRQUF3SixLQUFLSCxPQUFsSztBQUEwSyxVQUFNd0YsZ0JBQWdCLEdBQUNGLGtCQUFrQixLQUFHLEtBQTVDO0FBQWtELFVBQU1HLGdCQUFnQixHQUFDRixrQkFBa0IsS0FBRyxLQUFyQixJQUE0QixDQUFDcEYsdUJBQXBEO0FBQTRFLFNBQUtILE9BQUwsQ0FBYTJDLHFCQUFiLENBQW1DRixJQUFuQyxHQUF3QyxJQUF4QztBQUE2QyxRQUFHO0FBQUN0SjtBQUFELFFBQU8sS0FBSzZHLE9BQWY7QUFBdUIsUUFBSTBGLFdBQVcsR0FBQyxFQUFoQjtBQUFtQixRQUFJQyxpQkFBaUIsR0FBQyxFQUF0Qjs7QUFBeUIsUUFBR3hNLElBQUgsRUFBUTtBQUFDQSxVQUFJLENBQUNWLE9BQUwsQ0FBYStMLENBQUMsSUFBRTtBQUFDLFlBQUdBLENBQUMsSUFBRUEsQ0FBQyxDQUFDN08sSUFBRixLQUFTLE1BQVosSUFBb0I2TyxDQUFDLENBQUM1TyxLQUFGLENBQVEsS0FBUixNQUFpQixTQUFyQyxJQUFnRDRPLENBQUMsQ0FBQzVPLEtBQUYsQ0FBUSxJQUFSLE1BQWdCLE9BQW5FLEVBQTJFO0FBQUM4UCxxQkFBVyxDQUFDNU4sSUFBWixDQUFpQjBNLENBQWpCO0FBQXFCLFNBQWpHLE1BQXFHO0FBQUNBLFdBQUMsSUFBRW1CLGlCQUFpQixDQUFDN04sSUFBbEIsQ0FBdUIwTSxDQUF2QixDQUFIO0FBQThCO0FBQUMsT0FBdEo7QUFBd0pyTCxVQUFJLEdBQUN1TSxXQUFXLENBQUNoSSxNQUFaLENBQW1CaUksaUJBQW5CLENBQUw7QUFBNEM7O0FBQUEsUUFBSXJQLFFBQVEsR0FBQzBFLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZWdILFFBQWYsQ0FBd0J5QixPQUF4QixDQUFnQyxLQUFLaFEsS0FBTCxDQUFXVSxRQUEzQyxFQUFxRDJCLE1BQXJELENBQTRENkwsT0FBNUQsQ0FBYixDQUEvb0IsQ0FBaXVCOzs7QUFDdnhGLGNBQXVDO0FBQUN4TixjQUFRLEdBQUMwRSxNQUFNLENBQUNtQyxPQUFQLENBQWVnSCxRQUFmLENBQXdCbk0sR0FBeEIsQ0FBNEIxQixRQUE1QixFQUFxQzhOLEtBQUssSUFBRTtBQUFDLFlBQUl5QixZQUFKOztBQUFpQixjQUFNQyxhQUFhLEdBQUMxQixLQUFLLElBQUUsSUFBUCxHQUFZLEtBQUssQ0FBakIsR0FBbUIsQ0FBQ3lCLFlBQVksR0FBQ3pCLEtBQUssQ0FBQ3hPLEtBQXBCLEtBQTRCLElBQTVCLEdBQWlDLEtBQUssQ0FBdEMsR0FBd0NpUSxZQUFZLENBQUMsbUJBQUQsQ0FBM0Y7O0FBQWlILFlBQUcsQ0FBQ0MsYUFBSixFQUFrQjtBQUFDLGNBQUlDLGFBQUo7O0FBQWtCLGNBQUcsQ0FBQzNCLEtBQUssSUFBRSxJQUFQLEdBQVksS0FBSyxDQUFqQixHQUFtQkEsS0FBSyxDQUFDek8sSUFBMUIsTUFBa0MsT0FBckMsRUFBNkM7QUFBQ3lCLG1CQUFPLENBQUM0TyxJQUFSLENBQWEsa0hBQWI7QUFBa0ksV0FBaEwsTUFBcUwsSUFBRyxDQUFDNUIsS0FBSyxJQUFFLElBQVAsR0FBWSxLQUFLLENBQWpCLEdBQW1CQSxLQUFLLENBQUN6TyxJQUExQixNQUFrQyxNQUFsQyxJQUEwQyxDQUFDeU8sS0FBSyxJQUFFLElBQVAsR0FBWSxLQUFLLENBQWpCLEdBQW1CLENBQUMyQixhQUFhLEdBQUMzQixLQUFLLENBQUN4TyxLQUFyQixLQUE2QixJQUE3QixHQUFrQyxLQUFLLENBQXZDLEdBQXlDbVEsYUFBYSxDQUFDRSxJQUEzRSxNQUFtRixVQUFoSSxFQUEySTtBQUFDN08sbUJBQU8sQ0FBQzRPLElBQVIsQ0FBYSxxSUFBYjtBQUFxSjtBQUFDOztBQUFBLGVBQU81QixLQUFQO0FBQWMsT0FBenJCLENBQVQ7QUFBb3NCLFVBQUcsS0FBS3hPLEtBQUwsQ0FBVzZLLFdBQWQsRUFBMEJySixPQUFPLENBQUM0TyxJQUFSLENBQWEsb0hBQWI7QUFBb0k7O0FBQUEsUUFBRyxLQUFILEVBQXVGLEVBQThDOztBQUFBMVAsWUFBUSxHQUFDLEtBQUsyTiwrQkFBTCxDQUFxQzNOLFFBQXJDLENBQVQ7QUFBd0QsUUFBSTRQLGFBQWEsR0FBQyxLQUFsQjtBQUF3QixRQUFJQyxlQUFlLEdBQUMsS0FBcEIsQ0FEdTlCLENBQzc3Qjs7QUFDem5DaE4sUUFBSSxHQUFDNkIsTUFBTSxDQUFDbUMsT0FBUCxDQUFlZ0gsUUFBZixDQUF3Qm5NLEdBQXhCLENBQTRCbUIsSUFBSSxJQUFFLEVBQWxDLEVBQXFDaUwsS0FBSyxJQUFFO0FBQUMsVUFBRyxDQUFDQSxLQUFKLEVBQVUsT0FBT0EsS0FBUDtBQUFhLFlBQUs7QUFBQ3pPLFlBQUQ7QUFBTUM7QUFBTixVQUFhd08sS0FBbEI7O0FBQXdCLFVBQUcxRSxTQUFILEVBQWE7QUFBQyxZQUFJMEcsT0FBTyxHQUFDLEVBQVo7O0FBQWUsWUFBR3pRLElBQUksS0FBRyxNQUFQLElBQWVDLEtBQUssQ0FBQ3FRLElBQU4sS0FBYSxVQUEvQixFQUEwQztBQUFDRyxpQkFBTyxHQUFDLGlCQUFSO0FBQTJCLFNBQXRFLE1BQTJFLElBQUd6USxJQUFJLEtBQUcsTUFBUCxJQUFlQyxLQUFLLENBQUM4TixHQUFOLEtBQVksV0FBOUIsRUFBMEM7QUFBQ3lDLHlCQUFlLEdBQUMsSUFBaEI7QUFBc0IsU0FBakUsTUFBc0UsSUFBR3hRLElBQUksS0FBRyxRQUFWLEVBQW1CO0FBQUM7QUFDblM7QUFDQTtBQUNBO0FBQ0EsY0FBR0MsS0FBSyxDQUFDNkYsR0FBTixJQUFXN0YsS0FBSyxDQUFDNkYsR0FBTixDQUFVNEssT0FBVixDQUFrQixZQUFsQixJQUFnQyxDQUFDLENBQTVDLElBQStDelEsS0FBSyxDQUFDVyx1QkFBTixLQUFnQyxDQUFDWCxLQUFLLENBQUNELElBQVAsSUFBYUMsS0FBSyxDQUFDRCxJQUFOLEtBQWEsaUJBQTFELENBQWxELEVBQStIO0FBQUN5USxtQkFBTyxHQUFDLFNBQVI7QUFBa0I5SixrQkFBTSxDQUFDZ0ssSUFBUCxDQUFZMVEsS0FBWixFQUFtQjZDLE9BQW5CLENBQTJCOE4sSUFBSSxJQUFFO0FBQUNILHFCQUFPLElBQUcsSUFBR0csSUFBSyxLQUFJM1EsS0FBSyxDQUFDMlEsSUFBRCxDQUFPLEdBQWxDO0FBQXNDLGFBQXhFO0FBQTBFSCxtQkFBTyxJQUFFLElBQVQ7QUFBZTtBQUFDOztBQUFBLFlBQUdBLE9BQUgsRUFBVztBQUFDaFAsaUJBQU8sQ0FBQzRPLElBQVIsQ0FBYyw4QkFBNkI1QixLQUFLLENBQUN6TyxJQUFLLDJCQUEwQnlRLE9BQVEsT0FBTS9CLGFBQWEsQ0FBQ21DLElBQUssd0RBQWpIO0FBQTBLLGlCQUFPLElBQVA7QUFBYTtBQUFDLE9BSi9VLE1BSW1WO0FBQUM7QUFDcmIsWUFBRzdRLElBQUksS0FBRyxNQUFQLElBQWVDLEtBQUssQ0FBQzhOLEdBQU4sS0FBWSxTQUE5QixFQUF3QztBQUFDd0MsdUJBQWEsR0FBQyxJQUFkO0FBQW9CO0FBQUM7O0FBQUEsYUFBTzlCLEtBQVA7QUFBYyxLQUx2RSxDQUFMLENBRnNqRSxDQU94K0Q7O0FBQzlFLFVBQU1xQyxTQUFTLEdBQUM5UCxLQUFLLENBQUNDLE9BQU4sQ0FBY3dMLE1BQWQsSUFBc0JBLE1BQXRCLEdBQTZCLEVBQTdDOztBQUFnRCxRQUFHMUMsU0FBUyxJQUFFMEMsTUFBWCxJQUFtQjtBQUN0RUEsVUFBTSxDQUFDeE0sS0FENEMsSUFDckM7QUFDZGUsU0FBSyxDQUFDQyxPQUFOLENBQWN3TCxNQUFNLENBQUN4TSxLQUFQLENBQWFVLFFBQTNCLENBRmdELEVBRVg7QUFBQyxZQUFNb1EsU0FBUyxHQUFDN1EsRUFBRSxJQUFFO0FBQUMsWUFBSThRLFNBQUosRUFBY0MscUJBQWQ7O0FBQW9DLGVBQU8vUSxFQUFFLElBQUUsSUFBSixHQUFTLEtBQUssQ0FBZCxHQUFnQixDQUFDOFEsU0FBUyxHQUFDOVEsRUFBRSxDQUFDRCxLQUFkLEtBQXNCLElBQXRCLEdBQTJCLEtBQUssQ0FBaEMsR0FBa0MsQ0FBQ2dSLHFCQUFxQixHQUFDRCxTQUFTLENBQUNwUSx1QkFBakMsS0FBMkQsSUFBM0QsR0FBZ0UsS0FBSyxDQUFyRSxHQUF1RXFRLHFCQUFxQixDQUFDblEsTUFBdEo7QUFBOEosT0FBdk4sQ0FBRCxDQUF5Tjs7O0FBQzlQMkwsWUFBTSxDQUFDeE0sS0FBUCxDQUFhVSxRQUFiLENBQXNCbUMsT0FBdEIsQ0FBOEIyTCxLQUFLLElBQUU7QUFBQyxZQUFHek4sS0FBSyxDQUFDQyxPQUFOLENBQWN3TixLQUFkLENBQUgsRUFBd0I7QUFBQ0EsZUFBSyxDQUFDM0wsT0FBTixDQUFjNUMsRUFBRSxJQUFFNlEsU0FBUyxDQUFDN1EsRUFBRCxDQUFULElBQWU0USxTQUFTLENBQUMzTyxJQUFWLENBQWVqQyxFQUFmLENBQWpDO0FBQXNELFNBQS9FLE1BQW9GLElBQUc2USxTQUFTLENBQUN0QyxLQUFELENBQVosRUFBb0I7QUFBQ3FDLG1CQUFTLENBQUMzTyxJQUFWLENBQWVzTSxLQUFmO0FBQXVCO0FBQUMsT0FBdks7QUFBMEs7O0FBQUEsVUFBTWxELEtBQUssR0FBQzNCLGdCQUFnQixDQUFDLEtBQUtTLE9BQUwsQ0FBYVIsYUFBZCxFQUE0QixLQUFLUSxPQUFMLENBQWFxRSxhQUFiLENBQTJCbUMsSUFBdkQsRUFBNEQ5RyxTQUE1RCxDQUE1QjtBQUFtRyxXQUFNLGFBQWExRSxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DLEtBQUtILEtBQXpDLEVBQStDLEtBQUtvSyxPQUFMLENBQWFvQixhQUFiLElBQTRCLGFBQWFwRyxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCaUYsTUFBTSxDQUFDbUMsT0FBUCxDQUFlMEosUUFBNUMsRUFBcUQsSUFBckQsRUFBMEQsYUFBYTdMLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsT0FBN0IsRUFBcUM7QUFBQyw2QkFBc0IsSUFBdkI7QUFBNEIseUJBQWtCMkosU0FBUyxHQUFDLE1BQUQsR0FBUXhKLFNBQS9EO0FBQXlFSyw2QkFBdUIsRUFBQztBQUFDRSxjQUFNLEVBQUU7QUFBVDtBQUFqRyxLQUFyQyxDQUF2RSxFQUE2TyxhQUFhdUUsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixVQUE3QixFQUF3QztBQUFDLDZCQUFzQixJQUF2QjtBQUE0Qix5QkFBa0IySixTQUFTLEdBQUMsTUFBRCxHQUFReEo7QUFBL0QsS0FBeEMsRUFBa0gsYUFBYThFLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsT0FBN0IsRUFBcUM7QUFBQ1EsNkJBQXVCLEVBQUM7QUFBQ0UsY0FBTSxFQUFFO0FBQVQ7QUFBekIsS0FBckMsQ0FBL0gsQ0FBMVAsQ0FBeEYsRUFBa2pCSCxRQUFsakIsRUFBMmpCb0ssTUFBQSxJQUFtQyxhQUFhMUYsQ0FBM21CLEVBQThxQjdCLElBQTlxQixFQUFtckIsYUFBYTZCLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsTUFBN0IsRUFBb0M7QUFBQ2tRLFVBQUksRUFBQyxpQkFBTjtBQUF3QnpPLGFBQU8sRUFBQ3dELE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZWdILFFBQWYsQ0FBd0IyQyxLQUF4QixDQUE4QjNOLElBQUksSUFBRSxFQUFwQyxFQUF3Q0wsUUFBeEM7QUFBaEMsS0FBcEMsQ0FBaHNCLEVBQXl6QjRHLFNBQVMsSUFBRSxhQUFhMUUsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QmlGLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZTBKLFFBQTVDLEVBQXFELElBQXJELEVBQTBELGFBQWE3TCxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DO0FBQUNrUSxVQUFJLEVBQUMsVUFBTjtBQUFpQnpPLGFBQU8sRUFBQztBQUF6QixLQUFwQyxDQUF2RSxFQUEyTCxDQUFDMk8sZUFBRCxJQUFrQixhQUFhbkwsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixNQUE3QixFQUFvQztBQUFDMk4sU0FBRyxFQUFDLFdBQUw7QUFBaUJoSyxVQUFJLEVBQUN5TCxhQUFhLEdBQUMsQ0FBQyxHQUFFM0csT0FBTyxDQUFDdUksWUFBWCxFQUF5QjNCLGVBQXpCO0FBQXBDLEtBQXBDLENBQTFOLEVBQThVLGFBQWFwSyxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DO0FBQUMyTixTQUFHLEVBQUMsU0FBTDtBQUFlQyxRQUFFLEVBQUMsUUFBbEI7QUFBMkJqSyxVQUFJLEVBQUM7QUFBaEMsS0FBcEMsQ0FBM1YsRUFBb2MwSSxNQUFNLElBQUUsYUFBYXBILE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsT0FBN0IsRUFBcUM7QUFBQyxvQkFBYSxFQUFkO0FBQWlCUSw2QkFBdUIsRUFBQztBQUFDRSxjQUFNLEVBQUNnUSxTQUFTLENBQUN6TyxHQUFWLENBQWNnUCxLQUFLLElBQUVBLEtBQUssQ0FBQ3BSLEtBQU4sQ0FBWVcsdUJBQVosQ0FBb0NFLE1BQXpELEVBQWlFSSxJQUFqRSxDQUFzRSxFQUF0RSxFQUEwRW9RLE9BQTFFLENBQWtGLGdDQUFsRixFQUFtSCxFQUFuSCxFQUF1SEEsT0FBdkgsQ0FBK0gsMEJBQS9ILEVBQTBKLEVBQTFKO0FBQVI7QUFBekMsS0FBckMsQ0FBemQsRUFBZ3RCLGFBQWFqTSxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE9BQTdCLEVBQXFDO0FBQUMseUJBQWtCLEVBQW5CO0FBQXNCUSw2QkFBdUIsRUFBQztBQUFDRSxjQUFNLEVBQUU7QUFBVDtBQUE5QyxLQUFyQyxDQUE3dEIsRUFBbzVDLGFBQWF1RSxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLFVBQTdCLEVBQXdDLElBQXhDLEVBQTZDLGFBQWFpRixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLE9BQTdCLEVBQXFDO0FBQUMseUJBQWtCLEVBQW5CO0FBQXNCUSw2QkFBdUIsRUFBQztBQUFDRSxjQUFNLEVBQUU7QUFBVDtBQUE5QyxLQUFyQyxDQUExRCxDQUFqNkMsRUFBK29ELGFBQWF1RSxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLFFBQTdCLEVBQXNDO0FBQUNzTCxXQUFLLEVBQUMsSUFBUDtBQUFZNUYsU0FBRyxFQUFDO0FBQWhCLEtBQXRDLENBQTVwRCxDQUFqMUIsRUFBeWtGLENBQUNpRSxTQUFELElBQVksYUFBYTFFLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkJpRixNQUFNLENBQUNtQyxPQUFQLENBQWUwSixRQUE1QyxFQUFxRCxJQUFyRCxFQUEwRCxDQUFDWCxhQUFELElBQWdCaEIsU0FBaEIsSUFBMkIsYUFBYWxLLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsTUFBN0IsRUFBb0M7QUFBQzJOLFNBQUcsRUFBQyxTQUFMO0FBQWVoSyxVQUFJLEVBQUN5TCxhQUFhLEdBQUMrQixVQUFVLENBQUNqQyxPQUFELEVBQVNHLGVBQVQ7QUFBNUMsS0FBcEMsQ0FBbEcsRUFBOE0sU0FBa0MsS0FBS25DLFdBQUwsQ0FBaUIvQixLQUFqQixDQUFoUCxFQUF3USxTQUFrQyxhQUFhbEcsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QixVQUE3QixFQUF3QztBQUFDLG9CQUFhLENBQUNnUCxpQkFBaUIsR0FBQyxLQUFLblAsS0FBTCxDQUFXNEssS0FBOUIsS0FBc0MsSUFBdEMsR0FBMkN1RSxpQkFBM0MsR0FBNkQ7QUFBM0UsS0FBeEMsQ0FBdlQsRUFBK2FyRSxNQUFBLElBQW9DLGFBQWExRixDQUFoZSxFQUFpaUIsQ0FBQ3dLLGdCQUFELElBQW1CLENBQUNDLGdCQUFwQixJQUFzQyxLQUFLNUIsdUJBQUwsRUFBdmtCLEVBQXNtQixDQUFDMkIsZ0JBQUQsSUFBbUIsQ0FBQ0MsZ0JBQXBCLElBQXNDLEtBQUsxQixtQkFBTCxDQUF5QjdDLEtBQXpCLENBQTVvQixFQUE0cUIsQ0FBQ2YsdUJBQUQsSUFBMEIsQ0FBQ3FGLGdCQUEzQixJQUE2QyxLQUFLekYsa0JBQUwsRUFBenRCLEVBQW12QixDQUFDSSx1QkFBRCxJQUEwQixDQUFDcUYsZ0JBQTNCLElBQTZDLEtBQUs3RSxpQkFBTCxFQUFoeUIsRUFBeXpCLENBQUNSLHVCQUFELElBQTBCLENBQUNxRixnQkFBM0IsSUFBNkMsS0FBS3ZFLGdCQUFMLENBQXNCQyxLQUF0QixDQUF0MkIsRUFBbTRCLENBQUNmLHVCQUFELElBQTBCLENBQUNxRixnQkFBM0IsSUFBNkMsS0FBS2pFLFVBQUwsQ0FBZ0JMLEtBQWhCLENBQWg3QixFQUF1OEJSLE1BQUEsSUFBaUMsQ0FBeCtCLEVBQWdnQ0EsTUFBQSxJQUFpQyxhQUFhMUYsQ0FBOWlDLEVBQXdxQyxLQUFLZ0YsT0FBTCxDQUFhb0IsYUFBYjtBQUE0QjtBQUFjO0FBQ3BsSTtBQUNBO0FBQ0FwRyxVQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCLFVBQTdCLEVBQXdDO0FBQUMwRSxRQUFFLEVBQUM7QUFBSixLQUF4QyxDQUhrNEYsRUFHenpGMkgsTUFBTSxJQUFFLElBSGl6RixDQUFsbUYsRUFHek0sYUFBYXBILE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkJpRixNQUFNLENBQUNtQyxPQUFQLENBQWUwSixRQUE1QyxFQUFxRCxFQUFyRCxFQUF3RCxJQUFJeEIsUUFBUSxJQUFFLEVBQWQsQ0FBeEQsQ0FINEwsQ0FBbkI7QUFHNUY7O0FBakI0L0I7O0FBaUIzL0JuUSxZQUFBLEdBQWF1TixJQUFiO0FBQWtCQSxJQUFJLENBQUMwRSxXQUFMLEdBQWlCakosZ0JBQWdCLENBQUNFLGVBQWxDO0FBQWtEcUUsSUFBSSxDQUFDMkUsU0FBTCxHQUFlO0FBQUM1RyxPQUFLLEVBQUMxQyxVQUFVLENBQUNYLE9BQVgsQ0FBbUJrSyxNQUExQjtBQUFpQzVHLGFBQVcsRUFBQzNDLFVBQVUsQ0FBQ1gsT0FBWCxDQUFtQmtLO0FBQWhFLENBQWY7O0FBQXVGLFNBQVN4SixJQUFULEdBQWU7QUFBQyxRQUFLO0FBQUM2QixhQUFEO0FBQVd3QyxRQUFYO0FBQWdCUztBQUFoQixNQUF1QyxDQUFDLEdBQUUzSCxNQUFNLENBQUNzQyxVQUFWLEVBQXNCWSxnQkFBZ0IsQ0FBQ0UsZUFBdkMsQ0FBNUM7QUFBb0d1RSx1QkFBcUIsQ0FBQzlFLElBQXRCLEdBQTJCLElBQTNCO0FBQWdDLE1BQUc2QixTQUFILEVBQWEsT0FBTSxhQUFhMUUsTUFBTSxDQUFDbUMsT0FBUCxDQUFlcEgsYUFBZixDQUE2QmlGLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZTBKLFFBQTVDLEVBQXFELElBQXJELEVBQTBENUksVUFBVSxDQUFDcUosaUJBQXJFLENBQW5CO0FBQTJHLFNBQU0sYUFBYXRNLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsS0FBN0IsRUFBbUM7QUFBQzBFLE1BQUUsRUFBQyxRQUFKO0FBQWFsRSwyQkFBdUIsRUFBQztBQUFDRSxZQUFNLEVBQUN5TDtBQUFSO0FBQXJDLEdBQW5DLENBQW5CO0FBQTRHOztBQUFBLE1BQU1RLFVBQU4sU0FBeUIxSCxNQUFNLENBQUM2RyxTQUFoQyxDQUF5QztBQUFDa0IsYUFBVyxDQUFDLEdBQUdDLElBQUosRUFBUztBQUFDLFVBQU0sR0FBR0EsSUFBVDtBQUFlLFNBQUtoRCxPQUFMLEdBQWEsS0FBSyxDQUFsQjtBQUFxQjs7QUFBQWlCLGtCQUFnQixDQUFDQyxLQUFELEVBQU87QUFBQyxXQUFPRCxnQkFBZ0IsQ0FBQyxLQUFLakIsT0FBTixFQUFjLEtBQUtwSyxLQUFuQixFQUF5QnNMLEtBQXpCLENBQXZCO0FBQXdEOztBQUFBUCxtQkFBaUIsR0FBRTtBQUFDLFdBQU9BLGlCQUFpQixDQUFDLEtBQUtYLE9BQU4sRUFBYyxLQUFLcEssS0FBbkIsQ0FBeEI7QUFBbUQ7O0FBQUEyTCxZQUFVLENBQUNMLEtBQUQsRUFBTztBQUFDLFdBQU9LLFVBQVUsQ0FBQyxLQUFLdkIsT0FBTixFQUFjLEtBQUtwSyxLQUFuQixFQUF5QnNMLEtBQXpCLENBQWpCO0FBQWtEOztBQUFBbkIsb0JBQWtCLEdBQUU7QUFBQyxXQUFPQSxrQkFBa0IsQ0FBQyxLQUFLQyxPQUFOLEVBQWMsS0FBS3BLLEtBQW5CLENBQXpCO0FBQW9EOztBQUFBLFNBQU8yUixxQkFBUCxDQUE2QkMsYUFBN0IsRUFBMkM7QUFBQyxVQUFLO0FBQUNuRDtBQUFELFFBQWdCbUQsYUFBckI7O0FBQW1DLFFBQUc7QUFBQyxZQUFNQyxJQUFJLEdBQUNDLElBQUksQ0FBQ0MsU0FBTCxDQUFldEQsYUFBZixDQUFYO0FBQXlDLGFBQU0sQ0FBQyxHQUFFNUYsV0FBVyxDQUFDbUosb0JBQWYsRUFBcUNILElBQXJDLENBQU47QUFBa0QsS0FBL0YsQ0FBK0YsT0FBTUksR0FBTixFQUFVO0FBQUMsVUFBR0EsR0FBRyxDQUFDQyxPQUFKLENBQVl6QixPQUFaLENBQW9CLG9CQUFwQixDQUFILEVBQTZDO0FBQUMsY0FBTSxJQUFJMEIsS0FBSixDQUFXLDJEQUEwRDFELGFBQWEsQ0FBQ21DLElBQUssd0RBQXhGLENBQU47QUFBd0o7O0FBQUEsWUFBTXFCLEdBQU47QUFBVztBQUFDOztBQUFBckYsUUFBTSxHQUFFO0FBQUMsVUFBSztBQUFDdkMsaUJBQUQ7QUFBYVAsZUFBYjtBQUF1QkYsbUJBQXZCO0FBQXFDOEYsd0JBQXJDO0FBQXdEM0MsMkJBQXhEO0FBQThFekMsbUNBQTlFO0FBQTRHQztBQUE1RyxRQUFxSSxLQUFLSCxPQUEvSTtBQUF1SixVQUFNd0YsZ0JBQWdCLEdBQUNGLGtCQUFrQixLQUFHLEtBQTVDO0FBQWtEM0MseUJBQXFCLENBQUNELFVBQXRCLEdBQWlDLElBQWpDOztBQUFzQyxRQUFHaEQsU0FBSCxFQUFhO0FBQUMsaUJBQXVDLEVBQWM7O0FBQUEsWUFBTXNJLFdBQVcsR0FBQyxDQUFDLEdBQUd4SSxhQUFhLENBQUN5SSxRQUFsQixFQUEyQixHQUFHekksYUFBYSxDQUFDWSxhQUE1QyxFQUEwRCxHQUFHWixhQUFhLENBQUN3SSxXQUEzRSxDQUFsQjtBQUEwRyxhQUFNLGFBQWFoTixNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCaUYsTUFBTSxDQUFDbUMsT0FBUCxDQUFlMEosUUFBNUMsRUFBcUQsSUFBckQsRUFBMERyQixnQkFBZ0IsR0FBQyxJQUFELEdBQU0sYUFBYXhLLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsUUFBN0IsRUFBc0M7QUFBQzBFLFVBQUUsRUFBQyxlQUFKO0FBQW9COUUsWUFBSSxFQUFDLGtCQUF6QjtBQUE0QzZLLGFBQUssRUFBQyxLQUFLNUssS0FBTCxDQUFXNEssS0FBN0Q7QUFBbUVDLG1CQUFXLEVBQUMsS0FBSzdLLEtBQUwsQ0FBVzZLLFdBQVgsSUFBd0JDLFNBQXZHO0FBQXVJbkssK0JBQXVCLEVBQUM7QUFBQ0UsZ0JBQU0sRUFBQ2lNLFVBQVUsQ0FBQzZFLHFCQUFYLENBQWlDLEtBQUt2SCxPQUF0QztBQUFSLFNBQS9KO0FBQXVOLDJCQUFrQjtBQUF6TyxPQUF0QyxDQUE3RixFQUFtWGdJLFdBQVcsQ0FBQ2hRLEdBQVosQ0FBZ0I2SSxJQUFJLElBQUUsYUFBYTdGLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsUUFBN0IsRUFBc0M7QUFBQ3FKLFdBQUcsRUFBQ3lCLElBQUw7QUFBVXBGLFdBQUcsRUFBRSxHQUFFd0UsV0FBWSxVQUFTWSxJQUFLLEdBQUVYLDZCQUE4QixFQUEzRTtBQUE2RU0sYUFBSyxFQUFDLEtBQUs1SyxLQUFMLENBQVc0SyxLQUE5RjtBQUFvR0MsbUJBQVcsRUFBQyxLQUFLN0ssS0FBTCxDQUFXNkssV0FBWCxJQUF3QkMsU0FBeEk7QUFBd0ssMkJBQWtCO0FBQTFMLE9BQXRDLENBQW5DLENBQW5YLENBQW5CO0FBQW1wQjs7QUFBQSxjQUF1QztBQUFDLFVBQUcsS0FBSzlLLEtBQUwsQ0FBVzZLLFdBQWQsRUFBMEJySixPQUFPLENBQUM0TyxJQUFSLENBQWEsMEhBQWI7QUFBMEk7O0FBQUEsVUFBTTlFLEtBQUssR0FBQzNCLGdCQUFnQixDQUFDLEtBQUtTLE9BQUwsQ0FBYVIsYUFBZCxFQUE0QixLQUFLUSxPQUFMLENBQWFxRSxhQUFiLENBQTJCbUMsSUFBdkQsRUFBNEQ5RyxTQUE1RCxDQUE1QjtBQUFtRyxXQUFNLGFBQWExRSxNQUFNLENBQUNtQyxPQUFQLENBQWVwSCxhQUFmLENBQTZCaUYsTUFBTSxDQUFDbUMsT0FBUCxDQUFlMEosUUFBNUMsRUFBcUQsSUFBckQsRUFBMEQsQ0FBQ3JCLGdCQUFELElBQW1CaEcsYUFBYSxDQUFDeUksUUFBakMsR0FBMEN6SSxhQUFhLENBQUN5SSxRQUFkLENBQXVCalEsR0FBdkIsQ0FBMkI2SSxJQUFJLElBQUUsYUFBYTdGLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsUUFBN0IsRUFBc0M7QUFBQ3FKLFNBQUcsRUFBQ3lCLElBQUw7QUFBVXBGLFNBQUcsRUFBRSxHQUFFd0UsV0FBWSxVQUFTcUIsU0FBUyxDQUFDVCxJQUFELENBQU8sR0FBRVgsNkJBQThCLEVBQXRGO0FBQXdGTSxXQUFLLEVBQUMsS0FBSzVLLEtBQUwsQ0FBVzRLLEtBQXpHO0FBQStHQyxpQkFBVyxFQUFDLEtBQUs3SyxLQUFMLENBQVc2SyxXQUFYLElBQXdCQyxTQUErQk07QUFBbEwsS0FBdEMsQ0FBOUMsQ0FBMUMsR0FBb1QsSUFBOVcsRUFBbVh3RSxnQkFBZ0IsR0FBQyxJQUFELEdBQU0sYUFBYXhLLE1BQU0sQ0FBQ21DLE9BQVAsQ0FBZXBILGFBQWYsQ0FBNkIsUUFBN0IsRUFBc0M7QUFBQzBFLFFBQUUsRUFBQyxlQUFKO0FBQW9COUUsVUFBSSxFQUFDLGtCQUF6QjtBQUE0QzZLLFdBQUssRUFBQyxLQUFLNUssS0FBTCxDQUFXNEssS0FBN0Q7QUFBbUVDLGlCQUFXLEVBQUMsS0FBSzdLLEtBQUwsQ0FBVzZLLFdBQVgsSUFBd0JDLFNBQXZHO0FBQXVJbkssNkJBQXVCLEVBQUM7QUFBQ0UsY0FBTSxFQUFDaU0sVUFBVSxDQUFDNkUscUJBQVgsQ0FBaUMsS0FBS3ZILE9BQXRDO0FBQVI7QUFBL0osS0FBdEMsQ0FBdFosRUFBcXBCRyx1QkFBdUIsSUFBRSxDQUFDcUYsZ0JBQTFCLElBQTRDLEtBQUt6RixrQkFBTCxFQUFqc0IsRUFBMnRCSSx1QkFBdUIsSUFBRSxDQUFDcUYsZ0JBQTFCLElBQTRDLEtBQUs3RSxpQkFBTCxFQUF2d0IsRUFBZ3lCUix1QkFBdUIsSUFBRSxDQUFDcUYsZ0JBQTFCLElBQTRDLEtBQUt2RSxnQkFBTCxDQUFzQkMsS0FBdEIsQ0FBNTBCLEVBQXkyQmYsdUJBQXVCLElBQUUsQ0FBQ3FGLGdCQUExQixJQUE0QyxLQUFLakUsVUFBTCxDQUFnQkwsS0FBaEIsQ0FBcjVCLENBQW5CO0FBQWk4Qjs7QUFBamhHOztBQUFraEdoTSxrQkFBQSxHQUFtQndOLFVBQW5CO0FBQThCQSxVQUFVLENBQUN5RSxXQUFYLEdBQXVCakosZ0JBQWdCLENBQUNFLGVBQXhDO0FBQXdEc0UsVUFBVSxDQUFDMEUsU0FBWCxHQUFxQjtBQUFDNUcsT0FBSyxFQUFDMUMsVUFBVSxDQUFDWCxPQUFYLENBQW1Ca0ssTUFBMUI7QUFBaUM1RyxhQUFXLEVBQUMzQyxVQUFVLENBQUNYLE9BQVgsQ0FBbUJrSztBQUFoRSxDQUFyQjtBQUE2RjNFLFVBQVUsQ0FBQ3dGLGlCQUFYLEdBQTZCLDBUQUE3Qjs7QUFBd1YsU0FBU2hCLFVBQVQsQ0FBb0JqQyxPQUFwQixFQUE0QmtELE1BQTVCLEVBQW1DO0FBQUMsU0FBT2xELE9BQU8sSUFBRyxHQUFFa0QsTUFBTyxHQUFFQSxNQUFNLENBQUMzTCxRQUFQLENBQWdCLEdBQWhCLElBQXFCLEdBQXJCLEdBQXlCLEdBQUksT0FBekQ7QUFBaUUsQzs7Ozs7Ozs7Ozs7QUN6Qm4ySSxrQkFBa0IsTUFBTSw0QkFBNEIsc0JBQXNCO0FBQ3ZGO0FBQ0EscUJBQXFCLGlGQUFpRix3Q0FBd0MsbUNBQW1DO0FBQ2pMLHNDOzs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBLG1CQUFtQixzQkFBc0I7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwwQjs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDOzs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtDOzs7Ozs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjs7QUFFQSxJQUFJLElBQXFDO0FBQ3pDLDZCQUE2QixtQkFBTyxDQUFDLDJHQUE0QjtBQUNqRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRHQUE0RztBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0M7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViLGNBQWMsbUJBQU8sQ0FBQyw0RkFBVTtBQUNoQyxhQUFhLG1CQUFPLENBQUMsb0NBQWU7O0FBRXBDLDJCQUEyQixtQkFBTyxDQUFDLDJHQUE0QjtBQUMvRCxxQkFBcUIsbUJBQU8sQ0FBQyx1RkFBa0I7O0FBRS9DO0FBQ0E7O0FBRUEsSUFBSSxJQUFxQztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw2QkFBNkI7QUFDN0IsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLEtBQUs7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCw0QkFBNEI7QUFDNUIsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSxJQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFVBQVUsS0FBcUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QjtBQUNuQix3QkFBd0I7QUFDeEIseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QixpQkFBaUI7QUFDakIsb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2QsY0FBYztBQUNkLGdCQUFnQjtBQUNoQixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQiwwQkFBMEI7QUFDMUIsY0FBYztBQUNkLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7O0FDcExhOztBQUViLElBQUksS0FBcUMsRUFBRSxFQUUxQztBQUNELEVBQUUsMEtBQXlEO0FBQzNEOzs7Ozs7Ozs7Ozs7QUNOQSxvRTs7Ozs7Ozs7Ozs7QUNBQSwyRTs7Ozs7Ozs7Ozs7QUNBQSwrRTs7Ozs7Ozs7Ozs7QUNBQSxnRTs7Ozs7Ozs7Ozs7QUNBQSw0RTs7Ozs7Ozs7Ozs7QUNBQSxtRTs7Ozs7Ozs7Ozs7QUNBQSwyQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQyIsImZpbGUiOiJwYWdlcy9fZG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmRlZmF1bHQ9aW5pdEhlYWRNYW5hZ2VyO2V4cG9ydHMuRE9NQXR0cmlidXRlTmFtZXM9dm9pZCAwO2NvbnN0IERPTUF0dHJpYnV0ZU5hbWVzPXthY2NlcHRDaGFyc2V0OidhY2NlcHQtY2hhcnNldCcsY2xhc3NOYW1lOidjbGFzcycsaHRtbEZvcjonZm9yJyxodHRwRXF1aXY6J2h0dHAtZXF1aXYnLG5vTW9kdWxlOidub01vZHVsZSd9O2V4cG9ydHMuRE9NQXR0cmlidXRlTmFtZXM9RE9NQXR0cmlidXRlTmFtZXM7ZnVuY3Rpb24gcmVhY3RFbGVtZW50VG9ET00oe3R5cGUscHJvcHN9KXtjb25zdCBlbD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO2Zvcihjb25zdCBwIGluIHByb3BzKXtpZighcHJvcHMuaGFzT3duUHJvcGVydHkocCkpY29udGludWU7aWYocD09PSdjaGlsZHJlbid8fHA9PT0nZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnKWNvbnRpbnVlOy8vIHdlIGRvbid0IHJlbmRlciB1bmRlZmluZWQgcHJvcHMgdG8gdGhlIERPTVxuaWYocHJvcHNbcF09PT11bmRlZmluZWQpY29udGludWU7Y29uc3QgYXR0cj1ET01BdHRyaWJ1dGVOYW1lc1twXXx8cC50b0xvd2VyQ2FzZSgpO2lmKHR5cGU9PT0nc2NyaXB0JyYmKGF0dHI9PT0nYXN5bmMnfHxhdHRyPT09J2RlZmVyJ3x8YXR0cj09PSdub01vZHVsZScpKXs7ZWxbYXR0cl09ISFwcm9wc1twXTt9ZWxzZXtlbC5zZXRBdHRyaWJ1dGUoYXR0cixwcm9wc1twXSk7fX1jb25zdHtjaGlsZHJlbixkYW5nZXJvdXNseVNldElubmVySFRNTH09cHJvcHM7aWYoZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpe2VsLmlubmVySFRNTD1kYW5nZXJvdXNseVNldElubmVySFRNTC5fX2h0bWx8fCcnO31lbHNlIGlmKGNoaWxkcmVuKXtlbC50ZXh0Q29udGVudD10eXBlb2YgY2hpbGRyZW49PT0nc3RyaW5nJz9jaGlsZHJlbjpBcnJheS5pc0FycmF5KGNoaWxkcmVuKT9jaGlsZHJlbi5qb2luKCcnKTonJzt9cmV0dXJuIGVsO31mdW5jdGlvbiB1cGRhdGVFbGVtZW50cyh0eXBlLGNvbXBvbmVudHMpe2NvbnN0IGhlYWRFbD1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO2NvbnN0IGhlYWRDb3VudEVsPWhlYWRFbC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9bmV4dC1oZWFkLWNvdW50XScpO2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtpZighaGVhZENvdW50RWwpe2NvbnNvbGUuZXJyb3IoJ1dhcm5pbmc6IG5leHQtaGVhZC1jb3VudCBpcyBtaXNzaW5nLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9uZXh0LWhlYWQtY291bnQtbWlzc2luZycpO3JldHVybjt9fWNvbnN0IGhlYWRDb3VudD1OdW1iZXIoaGVhZENvdW50RWwuY29udGVudCk7Y29uc3Qgb2xkVGFncz1bXTtmb3IobGV0IGk9MCxqPWhlYWRDb3VudEVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7aTxoZWFkQ291bnQ7aSsrLGo9ai5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKXtpZihqLnRhZ05hbWUudG9Mb3dlckNhc2UoKT09PXR5cGUpe29sZFRhZ3MucHVzaChqKTt9fWNvbnN0IG5ld1RhZ3M9Y29tcG9uZW50cy5tYXAocmVhY3RFbGVtZW50VG9ET00pLmZpbHRlcihuZXdUYWc9Pntmb3IobGV0IGs9MCxsZW49b2xkVGFncy5sZW5ndGg7azxsZW47aysrKXtjb25zdCBvbGRUYWc9b2xkVGFnc1trXTtpZihvbGRUYWcuaXNFcXVhbE5vZGUobmV3VGFnKSl7b2xkVGFncy5zcGxpY2UoaywxKTtyZXR1cm4gZmFsc2U7fX1yZXR1cm4gdHJ1ZTt9KTtvbGRUYWdzLmZvckVhY2godD0+dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHQpKTtuZXdUYWdzLmZvckVhY2godD0+aGVhZEVsLmluc2VydEJlZm9yZSh0LGhlYWRDb3VudEVsKSk7aGVhZENvdW50RWwuY29udGVudD0oaGVhZENvdW50LW9sZFRhZ3MubGVuZ3RoK25ld1RhZ3MubGVuZ3RoKS50b1N0cmluZygpO31mdW5jdGlvbiBpbml0SGVhZE1hbmFnZXIoKXtsZXQgdXBkYXRlUHJvbWlzZT1udWxsO3JldHVybnttb3VudGVkSW5zdGFuY2VzOm5ldyBTZXQoKSx1cGRhdGVIZWFkOmhlYWQ9Pntjb25zdCBwcm9taXNlPXVwZGF0ZVByb21pc2U9UHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKT0+e2lmKHByb21pc2UhPT11cGRhdGVQcm9taXNlKXJldHVybjt1cGRhdGVQcm9taXNlPW51bGw7Y29uc3QgdGFncz17fTtoZWFkLmZvckVhY2goaD0+e2lmKC8vIElmIHRoZSBmb250IHRhZyBpcyBsb2FkZWQgb25seSBvbiBjbGllbnQgbmF2aWdhdGlvblxuLy8gaXQgd29uJ3QgYmUgaW5saW5lZC4gSW4gdGhpcyBjYXNlIHJldmVydCB0byB0aGUgb3JpZ2luYWwgYmVoYXZpb3JcbmgudHlwZT09PSdsaW5rJyYmaC5wcm9wc1snZGF0YS1vcHRpbWl6ZWQtZm9udHMnXSYmIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlW2RhdGEtaHJlZj1cIiR7aC5wcm9wc1snZGF0YS1ocmVmJ119XCJdYCkpe2gucHJvcHMuaHJlZj1oLnByb3BzWydkYXRhLWhyZWYnXTtoLnByb3BzWydkYXRhLWhyZWYnXT11bmRlZmluZWQ7fWNvbnN0IGNvbXBvbmVudHM9dGFnc1toLnR5cGVdfHxbXTtjb21wb25lbnRzLnB1c2goaCk7dGFnc1toLnR5cGVdPWNvbXBvbmVudHM7fSk7Y29uc3QgdGl0bGVDb21wb25lbnQ9dGFncy50aXRsZT90YWdzLnRpdGxlWzBdOm51bGw7bGV0IHRpdGxlPScnO2lmKHRpdGxlQ29tcG9uZW50KXtjb25zdHtjaGlsZHJlbn09dGl0bGVDb21wb25lbnQucHJvcHM7dGl0bGU9dHlwZW9mIGNoaWxkcmVuPT09J3N0cmluZyc/Y2hpbGRyZW46QXJyYXkuaXNBcnJheShjaGlsZHJlbik/Y2hpbGRyZW4uam9pbignJyk6Jyc7fWlmKHRpdGxlIT09ZG9jdW1lbnQudGl0bGUpZG9jdW1lbnQudGl0bGU9dGl0bGU7WydtZXRhJywnYmFzZScsJ2xpbmsnLCdzdHlsZScsJ3NjcmlwdCddLmZvckVhY2godHlwZT0+e3VwZGF0ZUVsZW1lbnRzKHR5cGUsdGFnc1t0eXBlXXx8W10pO30pO30pO319O31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWQtbWFuYWdlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjaz1leHBvcnRzLnJlcXVlc3RJZGxlQ2FsbGJhY2s9dm9pZCAwO2NvbnN0IHJlcXVlc3RJZGxlQ2FsbGJhY2s9dHlwZW9mIHNlbGYhPT0ndW5kZWZpbmVkJyYmc2VsZi5yZXF1ZXN0SWRsZUNhbGxiYWNrfHxmdW5jdGlvbihjYil7bGV0IHN0YXJ0PURhdGUubm93KCk7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtjYih7ZGlkVGltZW91dDpmYWxzZSx0aW1lUmVtYWluaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIE1hdGgubWF4KDAsNTAtKERhdGUubm93KCktc3RhcnQpKTt9fSk7fSwxKTt9O2V4cG9ydHMucmVxdWVzdElkbGVDYWxsYmFjaz1yZXF1ZXN0SWRsZUNhbGxiYWNrO2NvbnN0IGNhbmNlbElkbGVDYWxsYmFjaz10eXBlb2Ygc2VsZiE9PSd1bmRlZmluZWQnJiZzZWxmLmNhbmNlbElkbGVDYWxsYmFja3x8ZnVuY3Rpb24oaWQpe3JldHVybiBjbGVhclRpbWVvdXQoaWQpO307ZXhwb3J0cy5jYW5jZWxJZGxlQ2FsbGJhY2s9Y2FuY2VsSWRsZUNhbGxiYWNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVxdWVzdC1pZGxlLWNhbGxiYWNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO3ZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0PXJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmluaXRTY3JpcHRMb2FkZXI9aW5pdFNjcmlwdExvYWRlcjtleHBvcnRzLmRlZmF1bHQ9dm9pZCAwO3ZhciBfZXh0ZW5kczI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzXCIpKTt2YXIgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UyPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZVwiKSk7dmFyIF9yZWFjdD1yZXF1aXJlKFwicmVhY3RcIik7dmFyIF9oZWFkTWFuYWdlckNvbnRleHQ9cmVxdWlyZShcIi4uL25leHQtc2VydmVyL2xpYi9oZWFkLW1hbmFnZXItY29udGV4dFwiKTt2YXIgX2hlYWRNYW5hZ2VyPXJlcXVpcmUoXCIuL2hlYWQtbWFuYWdlclwiKTt2YXIgX3JlcXVlc3RJZGxlQ2FsbGJhY2s9cmVxdWlyZShcIi4vcmVxdWVzdC1pZGxlLWNhbGxiYWNrXCIpO2NvbnN0IFNjcmlwdENhY2hlPW5ldyBNYXAoKTtjb25zdCBMb2FkQ2FjaGU9bmV3IFNldCgpO2NvbnN0IGlnbm9yZVByb3BzPVsnb25Mb2FkJywnZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnLCdjaGlsZHJlbicsJ29uRXJyb3InLCdzdHJhdGVneSddO2NvbnN0IGxvYWRTY3JpcHQ9cHJvcHM9Pntjb25zdHtzcmMsaWQsb25Mb2FkPSgpPT57fSxkYW5nZXJvdXNseVNldElubmVySFRNTCxjaGlsZHJlbj0nJyxvbkVycm9yfT1wcm9wcztjb25zdCBjYWNoZUtleT1pZHx8c3JjO2lmKFNjcmlwdENhY2hlLmhhcyhzcmMpKXtpZighTG9hZENhY2hlLmhhcyhjYWNoZUtleSkpe0xvYWRDYWNoZS5hZGQoY2FjaGVLZXkpOy8vIEV4ZWN1dGUgb25Mb2FkIHNpbmNlIHRoZSBzY3JpcHQgbG9hZGluZyBoYXMgYmVndW5cblNjcmlwdENhY2hlLmdldChzcmMpLnRoZW4ob25Mb2FkLG9uRXJyb3IpO31yZXR1cm47fWNvbnN0IGVsPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO2NvbnN0IGxvYWRQcm9taXNlPW5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntlbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe3Jlc29sdmUoKTtpZihvbkxvYWQpe29uTG9hZC5jYWxsKHRoaXMpO319KTtlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsZnVuY3Rpb24oKXtyZWplY3QoKTtpZihvbkVycm9yKXtvbkVycm9yKCk7fX0pO30pO2lmKHNyYyl7U2NyaXB0Q2FjaGUuc2V0KHNyYyxsb2FkUHJvbWlzZSk7TG9hZENhY2hlLmFkZChjYWNoZUtleSk7fWlmKGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKXtlbC5pbm5lckhUTUw9ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sfHwnJzt9ZWxzZSBpZihjaGlsZHJlbil7ZWwudGV4dENvbnRlbnQ9dHlwZW9mIGNoaWxkcmVuPT09J3N0cmluZyc/Y2hpbGRyZW46QXJyYXkuaXNBcnJheShjaGlsZHJlbik/Y2hpbGRyZW4uam9pbignJyk6Jyc7fWVsc2UgaWYoc3JjKXtlbC5zcmM9c3JjO31mb3IoY29uc3Rbayx2YWx1ZV1vZiBPYmplY3QuZW50cmllcyhwcm9wcykpe2lmKHZhbHVlPT09dW5kZWZpbmVkfHxpZ25vcmVQcm9wcy5pbmNsdWRlcyhrKSl7Y29udGludWU7fWNvbnN0IGF0dHI9X2hlYWRNYW5hZ2VyLkRPTUF0dHJpYnV0ZU5hbWVzW2tdfHxrLnRvTG93ZXJDYXNlKCk7ZWwuc2V0QXR0cmlidXRlKGF0dHIsdmFsdWUpO31kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTt9O2Z1bmN0aW9uIGhhbmRsZUNsaWVudFNjcmlwdExvYWQocHJvcHMpe2NvbnN0e3N0cmF0ZWd5PSdhZnRlckludGVyYWN0aXZlJ309cHJvcHM7aWYoc3RyYXRlZ3k9PT0nYWZ0ZXJJbnRlcmFjdGl2ZScpe2xvYWRTY3JpcHQocHJvcHMpO31lbHNlIGlmKHN0cmF0ZWd5PT09J2xhenlPbmxvYWQnKXt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsKCk9PnsoMCxfcmVxdWVzdElkbGVDYWxsYmFjay5yZXF1ZXN0SWRsZUNhbGxiYWNrKSgoKT0+bG9hZFNjcmlwdChwcm9wcykpO30pO319ZnVuY3Rpb24gbG9hZExhenlTY3JpcHQocHJvcHMpe2lmKGRvY3VtZW50LnJlYWR5U3RhdGU9PT0nY29tcGxldGUnKXsoMCxfcmVxdWVzdElkbGVDYWxsYmFjay5yZXF1ZXN0SWRsZUNhbGxiYWNrKSgoKT0+bG9hZFNjcmlwdChwcm9wcykpO31lbHNle3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywoKT0+eygwLF9yZXF1ZXN0SWRsZUNhbGxiYWNrLnJlcXVlc3RJZGxlQ2FsbGJhY2spKCgpPT5sb2FkU2NyaXB0KHByb3BzKSk7fSk7fX1mdW5jdGlvbiBpbml0U2NyaXB0TG9hZGVyKHNjcmlwdExvYWRlckl0ZW1zKXtzY3JpcHRMb2FkZXJJdGVtcy5mb3JFYWNoKGhhbmRsZUNsaWVudFNjcmlwdExvYWQpO31mdW5jdGlvbiBTY3JpcHQocHJvcHMpe2NvbnN0e3NyYz0nJyxvbkxvYWQ9KCk9Pnt9LHN0cmF0ZWd5PSdhZnRlckludGVyYWN0aXZlJyxvbkVycm9yfT1wcm9wcyxyZXN0UHJvcHM9KDAsX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UyLmRlZmF1bHQpKHByb3BzLFtcInNyY1wiLFwib25Mb2FkXCIsXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiLFwic3RyYXRlZ3lcIixcIm9uRXJyb3JcIl0pOy8vIENvbnRleHQgaXMgYXZhaWxhYmxlIG9ubHkgZHVyaW5nIFNTUlxuY29uc3R7dXBkYXRlU2NyaXB0cyxzY3JpcHRzfT0oMCxfcmVhY3QudXNlQ29udGV4dCkoX2hlYWRNYW5hZ2VyQ29udGV4dC5IZWFkTWFuYWdlckNvbnRleHQpOygwLF9yZWFjdC51c2VFZmZlY3QpKCgpPT57aWYoc3RyYXRlZ3k9PT0nYWZ0ZXJJbnRlcmFjdGl2ZScpe2xvYWRTY3JpcHQocHJvcHMpO31lbHNlIGlmKHN0cmF0ZWd5PT09J2xhenlPbmxvYWQnKXtsb2FkTGF6eVNjcmlwdChwcm9wcyk7fX0sW3Byb3BzLHN0cmF0ZWd5XSk7aWYoc3RyYXRlZ3k9PT0nYmVmb3JlSW50ZXJhY3RpdmUnKXtpZih1cGRhdGVTY3JpcHRzKXtzY3JpcHRzLmJlZm9yZUludGVyYWN0aXZlPShzY3JpcHRzLmJlZm9yZUludGVyYWN0aXZlfHxbXSkuY29uY2F0KFsoMCxfZXh0ZW5kczIuZGVmYXVsdCkoe3NyYyxvbkxvYWQsb25FcnJvcn0scmVzdFByb3BzKV0pO3VwZGF0ZVNjcmlwdHMoc2NyaXB0cyk7fX1yZXR1cm4gbnVsbDt9dmFyIF9kZWZhdWx0PVNjcmlwdDtleHBvcnRzLmRlZmF1bHQ9X2RlZmF1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY3JpcHQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5IdG1sPUh0bWw7ZXhwb3J0cy5NYWluPU1haW47ZXhwb3J0cy5OZXh0U2NyaXB0PWV4cG9ydHMuSGVhZD1leHBvcnRzLmRlZmF1bHQ9dm9pZCAwO3ZhciBfcHJvcFR5cGVzPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcInByb3AtdHlwZXNcIikpO3ZhciBfcmVhY3Q9X2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcInJlYWN0XCIpKTt2YXIgX3NlcnZlcj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJzdHlsZWQtanN4L3NlcnZlclwiKSk7dmFyIF9jb25zdGFudHM9cmVxdWlyZShcIi4uL25leHQtc2VydmVyL2xpYi9jb25zdGFudHNcIik7dmFyIF9kb2N1bWVudENvbnRleHQ9cmVxdWlyZShcIi4uL25leHQtc2VydmVyL2xpYi9kb2N1bWVudC1jb250ZXh0XCIpO3ZhciBfdXRpbHM9cmVxdWlyZShcIi4uL25leHQtc2VydmVyL2xpYi91dGlsc1wiKTtleHBvcnRzLkRvY3VtZW50Q29udGV4dD1fdXRpbHMuRG9jdW1lbnRDb250ZXh0O2V4cG9ydHMuRG9jdW1lbnRJbml0aWFsUHJvcHM9X3V0aWxzLkRvY3VtZW50SW5pdGlhbFByb3BzO2V4cG9ydHMuRG9jdW1lbnRQcm9wcz1fdXRpbHMuRG9jdW1lbnRQcm9wczt2YXIgX2dldFBhZ2VGaWxlcz1yZXF1aXJlKFwiLi4vbmV4dC1zZXJ2ZXIvc2VydmVyL2dldC1wYWdlLWZpbGVzXCIpO3ZhciBfdXRpbHMyPXJlcXVpcmUoXCIuLi9uZXh0LXNlcnZlci9zZXJ2ZXIvdXRpbHNcIik7dmFyIF9odG1sZXNjYXBlPXJlcXVpcmUoXCIuLi9zZXJ2ZXIvaHRtbGVzY2FwZVwiKTt2YXIgX3NjcmlwdD1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi9jbGllbnQvc2NyaXB0XCIpKTtmdW5jdGlvbiBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUoKXtpZih0eXBlb2YgV2Vha01hcCE9PVwiZnVuY3Rpb25cIilyZXR1cm4gbnVsbDt2YXIgY2FjaGU9bmV3IFdlYWtNYXAoKTtfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGU9ZnVuY3Rpb24oKXtyZXR1cm4gY2FjaGU7fTtyZXR1cm4gY2FjaGU7fWZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iail7aWYob2JqJiZvYmouX19lc01vZHVsZSl7cmV0dXJuIG9iajt9aWYob2JqPT09bnVsbHx8dHlwZW9mIG9iaiE9PVwib2JqZWN0XCImJnR5cGVvZiBvYmohPT1cImZ1bmN0aW9uXCIpe3JldHVybntkZWZhdWx0Om9ian07fXZhciBjYWNoZT1fZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUoKTtpZihjYWNoZSYmY2FjaGUuaGFzKG9iaikpe3JldHVybiBjYWNoZS5nZXQob2JqKTt9dmFyIG5ld09iaj17fTt2YXIgaGFzUHJvcGVydHlEZXNjcmlwdG9yPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIGtleSBpbiBvYmope2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosa2V5KSl7dmFyIGRlc2M9aGFzUHJvcGVydHlEZXNjcmlwdG9yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLGtleSk6bnVsbDtpZihkZXNjJiYoZGVzYy5nZXR8fGRlc2Muc2V0KSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaixrZXksZGVzYyk7fWVsc2V7bmV3T2JqW2tleV09b2JqW2tleV07fX19bmV3T2JqLmRlZmF1bHQ9b2JqO2lmKGNhY2hlKXtjYWNoZS5zZXQob2JqLG5ld09iaik7fXJldHVybiBuZXdPYmo7fWZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKXtyZXR1cm4gb2JqJiZvYmouX19lc01vZHVsZT9vYmo6e2RlZmF1bHQ6b2JqfTt9ZnVuY3Rpb24gZ2V0RG9jdW1lbnRGaWxlcyhidWlsZE1hbmlmZXN0LHBhdGhuYW1lLGluQW1wTW9kZSl7Y29uc3Qgc2hhcmVkRmlsZXM9KDAsX2dldFBhZ2VGaWxlcy5nZXRQYWdlRmlsZXMpKGJ1aWxkTWFuaWZlc3QsJy9fYXBwJyk7Y29uc3QgcGFnZUZpbGVzPWluQW1wTW9kZT9bXTooMCxfZ2V0UGFnZUZpbGVzLmdldFBhZ2VGaWxlcykoYnVpbGRNYW5pZmVzdCxwYXRobmFtZSk7cmV0dXJue3NoYXJlZEZpbGVzLHBhZ2VGaWxlcyxhbGxGaWxlczpbLi4ubmV3IFNldChbLi4uc2hhcmVkRmlsZXMsLi4ucGFnZUZpbGVzXSldfTt9ZnVuY3Rpb24gZ2V0UG9seWZpbGxTY3JpcHRzKGNvbnRleHQscHJvcHMpey8vIHBvbHlmaWxscy5qcyBoYXMgdG8gYmUgcmVuZGVyZWQgYXMgbm9tb2R1bGUgd2l0aG91dCBhc3luY1xuLy8gSXQgYWxzbyBoYXMgdG8gYmUgdGhlIGZpcnN0IHNjcmlwdCB0byBsb2FkXG5jb25zdHthc3NldFByZWZpeCxidWlsZE1hbmlmZXN0LGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nLGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nfT1jb250ZXh0O3JldHVybiBidWlsZE1hbmlmZXN0LnBvbHlmaWxsRmlsZXMuZmlsdGVyKHBvbHlmaWxsPT5wb2x5ZmlsbC5lbmRzV2l0aCgnLmpzJykmJiFwb2x5ZmlsbC5lbmRzV2l0aCgnLm1vZHVsZS5qcycpKS5tYXAocG9seWZpbGw9Pi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIse2tleTpwb2x5ZmlsbCxkZWZlcjohZGlzYWJsZU9wdGltaXplZExvYWRpbmcsbm9uY2U6cHJvcHMubm9uY2UsY3Jvc3NPcmlnaW46cHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU4sbm9Nb2R1bGU6dHJ1ZSxzcmM6YCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7cG9seWZpbGx9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gfSkpO31mdW5jdGlvbiBnZXRQcmVOZXh0U2NyaXB0cyhjb250ZXh0LHByb3BzKXtjb25zdHtzY3JpcHRMb2FkZXIsZGlzYWJsZU9wdGltaXplZExvYWRpbmd9PWNvbnRleHQ7cmV0dXJuKHNjcmlwdExvYWRlci5iZWZvcmVJbnRlcmFjdGl2ZXx8W10pLm1hcChmaWxlPT57Y29uc3R7c3RyYXRlZ3ksLi4uc2NyaXB0UHJvcHN9PWZpbGU7cmV0dXJuLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIixPYmplY3QuYXNzaWduKHt9LHNjcmlwdFByb3BzLHtkZWZlcjohZGlzYWJsZU9wdGltaXplZExvYWRpbmcsbm9uY2U6cHJvcHMubm9uY2UsY3Jvc3NPcmlnaW46cHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU59KSk7fSk7fWZ1bmN0aW9uIGdldER5bmFtaWNDaHVua3MoY29udGV4dCxwcm9wcyxmaWxlcyl7Y29uc3R7ZHluYW1pY0ltcG9ydHMsYXNzZXRQcmVmaXgsaXNEZXZlbG9wbWVudCxkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyxkaXNhYmxlT3B0aW1pemVkTG9hZGluZ309Y29udGV4dDtyZXR1cm4gZHluYW1pY0ltcG9ydHMubWFwKGZpbGU9PntpZighZmlsZS5lbmRzV2l0aCgnLmpzJyl8fGZpbGVzLmFsbEZpbGVzLmluY2x1ZGVzKGZpbGUpKXJldHVybiBudWxsO3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIse2FzeW5jOiFpc0RldmVsb3BtZW50JiZkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxkZWZlcjohZGlzYWJsZU9wdGltaXplZExvYWRpbmcsa2V5OmZpbGUsc3JjOmAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsbm9uY2U6cHJvcHMubm9uY2UsY3Jvc3NPcmlnaW46cHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU59KTt9KTt9ZnVuY3Rpb24gZ2V0U2NyaXB0cyhjb250ZXh0LHByb3BzLGZpbGVzKXt2YXIgX2J1aWxkTWFuaWZlc3QkbG93UHJpO2NvbnN0e2Fzc2V0UHJlZml4LGJ1aWxkTWFuaWZlc3QsaXNEZXZlbG9wbWVudCxkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyxkaXNhYmxlT3B0aW1pemVkTG9hZGluZ309Y29udGV4dDtjb25zdCBub3JtYWxTY3JpcHRzPWZpbGVzLmFsbEZpbGVzLmZpbHRlcihmaWxlPT5maWxlLmVuZHNXaXRoKCcuanMnKSk7Y29uc3QgbG93UHJpb3JpdHlTY3JpcHRzPShfYnVpbGRNYW5pZmVzdCRsb3dQcmk9YnVpbGRNYW5pZmVzdC5sb3dQcmlvcml0eUZpbGVzKT09bnVsbD92b2lkIDA6X2J1aWxkTWFuaWZlc3QkbG93UHJpLmZpbHRlcihmaWxlPT5maWxlLmVuZHNXaXRoKCcuanMnKSk7cmV0dXJuWy4uLm5vcm1hbFNjcmlwdHMsLi4ubG93UHJpb3JpdHlTY3JpcHRzXS5tYXAoZmlsZT0+e3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIse2tleTpmaWxlLHNyYzpgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLG5vbmNlOnByb3BzLm5vbmNlLGFzeW5jOiFpc0RldmVsb3BtZW50JiZkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxkZWZlcjohZGlzYWJsZU9wdGltaXplZExvYWRpbmcsY3Jvc3NPcmlnaW46cHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU59KTt9KTt9LyoqXG4gKiBgRG9jdW1lbnRgIGNvbXBvbmVudCBoYW5kbGVzIHRoZSBpbml0aWFsIGBkb2N1bWVudGAgbWFya3VwIGFuZCByZW5kZXJzIG9ubHkgb24gdGhlIHNlcnZlciBzaWRlLlxuICogQ29tbW9ubHkgdXNlZCBmb3IgaW1wbGVtZW50aW5nIHNlcnZlciBzaWRlIHJlbmRlcmluZyBmb3IgYGNzcy1pbi1qc2AgbGlicmFyaWVzLlxuICovY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBfcmVhY3QuQ29tcG9uZW50ey8qKlxuICAgKiBgZ2V0SW5pdGlhbFByb3BzYCBob29rIHJldHVybnMgdGhlIGNvbnRleHQgb2JqZWN0IHdpdGggdGhlIGFkZGl0aW9uIG9mIGByZW5kZXJQYWdlYC5cbiAgICogYHJlbmRlclBhZ2VgIGNhbGxiYWNrIGV4ZWN1dGVzIGBSZWFjdGAgcmVuZGVyaW5nIGxvZ2ljIHN5bmNocm9ub3VzbHkgdG8gc3VwcG9ydCBzZXJ2ZXItcmVuZGVyaW5nIHdyYXBwZXJzXG4gICAqL3N0YXRpYyBhc3luYyBnZXRJbml0aWFsUHJvcHMoY3R4KXtjb25zdCBlbmhhbmNlQXBwPUFwcD0+e3JldHVybiBwcm9wcz0+LyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQXBwLHByb3BzKTt9O2NvbnN0e2h0bWwsaGVhZH09YXdhaXQgY3R4LnJlbmRlclBhZ2Uoe2VuaGFuY2VBcHB9KTtjb25zdCBzdHlsZXM9Wy4uLigwLF9zZXJ2ZXIuZGVmYXVsdCkoKV07cmV0dXJue2h0bWwsaGVhZCxzdHlsZXN9O31zdGF0aWMgcmVuZGVyRG9jdW1lbnQoRG9jdW1lbnRDb21wb25lbnQscHJvcHMpe3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9kb2N1bWVudENvbnRleHQuRG9jdW1lbnRDb250ZXh0LlByb3ZpZGVyLHt2YWx1ZTpwcm9wc30sLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoRG9jdW1lbnRDb21wb25lbnQscHJvcHMpKTt9cmVuZGVyKCl7cmV0dXJuLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoSHRtbCxudWxsLC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEhlYWQsbnVsbCksLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIsbnVsbCwvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChNYWluLG51bGwpLC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KE5leHRTY3JpcHQsbnVsbCkpKTt9fWV4cG9ydHMuZGVmYXVsdD1Eb2N1bWVudDtmdW5jdGlvbiBIdG1sKHByb3BzKXtjb25zdHtpbkFtcE1vZGUsZG9jQ29tcG9uZW50c1JlbmRlcmVkLGxvY2FsZX09KDAsX3JlYWN0LnVzZUNvbnRleHQpKF9kb2N1bWVudENvbnRleHQuRG9jdW1lbnRDb250ZXh0KTtkb2NDb21wb25lbnRzUmVuZGVyZWQuSHRtbD10cnVlO3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiLE9iamVjdC5hc3NpZ24oe30scHJvcHMse2xhbmc6cHJvcHMubGFuZ3x8bG9jYWxlfHx1bmRlZmluZWQsYW1wOmluQW1wTW9kZT8nJzp1bmRlZmluZWQsXCJkYXRhLWFtcGRldm1vZGVcIjppbkFtcE1vZGUmJnByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nPycnOnVuZGVmaW5lZH0pKTt9Y2xhc3MgSGVhZCBleHRlbmRzIF9yZWFjdC5Db21wb25lbnR7Y29uc3RydWN0b3IoLi4uYXJncyl7c3VwZXIoLi4uYXJncyk7dGhpcy5jb250ZXh0PXZvaWQgMDt9Z2V0Q3NzTGlua3MoZmlsZXMpe2NvbnN0e2Fzc2V0UHJlZml4LGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nLGR5bmFtaWNJbXBvcnRzfT10aGlzLmNvbnRleHQ7Y29uc3QgY3NzRmlsZXM9ZmlsZXMuYWxsRmlsZXMuZmlsdGVyKGY9PmYuZW5kc1dpdGgoJy5jc3MnKSk7Y29uc3Qgc2hhcmVkRmlsZXM9bmV3IFNldChmaWxlcy5zaGFyZWRGaWxlcyk7Ly8gVW5tYW5hZ2VkIGZpbGVzIGFyZSBDU1MgZmlsZXMgdGhhdCB3aWxsIGJlIGhhbmRsZWQgZGlyZWN0bHkgYnkgdGhlXG4vLyB3ZWJwYWNrIHJ1bnRpbWUgKGBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbmApLlxubGV0IHVubWFuZ2VkRmlsZXM9bmV3IFNldChbXSk7bGV0IGR5bmFtaWNDc3NGaWxlcz1BcnJheS5mcm9tKG5ldyBTZXQoZHluYW1pY0ltcG9ydHMuZmlsdGVyKGZpbGU9PmZpbGUuZW5kc1dpdGgoJy5jc3MnKSkpKTtpZihkeW5hbWljQ3NzRmlsZXMubGVuZ3RoKXtjb25zdCBleGlzdGluZz1uZXcgU2V0KGNzc0ZpbGVzKTtkeW5hbWljQ3NzRmlsZXM9ZHluYW1pY0Nzc0ZpbGVzLmZpbHRlcihmPT4hKGV4aXN0aW5nLmhhcyhmKXx8c2hhcmVkRmlsZXMuaGFzKGYpKSk7dW5tYW5nZWRGaWxlcz1uZXcgU2V0KGR5bmFtaWNDc3NGaWxlcyk7Y3NzRmlsZXMucHVzaCguLi5keW5hbWljQ3NzRmlsZXMpO31sZXQgY3NzTGlua0VsZW1lbnRzPVtdO2Nzc0ZpbGVzLmZvckVhY2goZmlsZT0+e2NvbnN0IGlzU2hhcmVkRmlsZT1zaGFyZWRGaWxlcy5oYXMoZmlsZSk7aWYoIXByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9DU1Mpe2Nzc0xpbmtFbGVtZW50cy5wdXNoKC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLHtrZXk6YCR7ZmlsZX0tcHJlbG9hZGAsbm9uY2U6dGhpcy5wcm9wcy5ub25jZSxyZWw6XCJwcmVsb2FkXCIsaHJlZjpgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLGFzOlwic3R5bGVcIixjcm9zc09yaWdpbjp0aGlzLnByb3BzLmNyb3NzT3JpZ2lufHxwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOfSkpO31jb25zdCBpc1VubWFuYWdlZEZpbGU9dW5tYW5nZWRGaWxlcy5oYXMoZmlsZSk7Y3NzTGlua0VsZW1lbnRzLnB1c2goLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIse2tleTpmaWxlLG5vbmNlOnRoaXMucHJvcHMubm9uY2UscmVsOlwic3R5bGVzaGVldFwiLGhyZWY6YCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxjcm9zc09yaWdpbjp0aGlzLnByb3BzLmNyb3NzT3JpZ2lufHxwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOLFwiZGF0YS1uLWdcIjppc1VubWFuYWdlZEZpbGU/dW5kZWZpbmVkOmlzU2hhcmVkRmlsZT8nJzp1bmRlZmluZWQsXCJkYXRhLW4tcFwiOmlzVW5tYW5hZ2VkRmlsZT91bmRlZmluZWQ6aXNTaGFyZWRGaWxlP3VuZGVmaW5lZDonJ30pKTt9KTtpZihwcm9jZXNzLmVudi5OT0RFX0VOViE9PSdkZXZlbG9wbWVudCcmJnByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9GT05UUyl7Y3NzTGlua0VsZW1lbnRzPXRoaXMubWFrZVN0eWxlc2hlZXRJbmVydChjc3NMaW5rRWxlbWVudHMpO31yZXR1cm4gY3NzTGlua0VsZW1lbnRzLmxlbmd0aD09PTA/bnVsbDpjc3NMaW5rRWxlbWVudHM7fWdldFByZWxvYWREeW5hbWljQ2h1bmtzKCl7Y29uc3R7ZHluYW1pY0ltcG9ydHMsYXNzZXRQcmVmaXgsZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9PXRoaXMuY29udGV4dDtyZXR1cm4gZHluYW1pY0ltcG9ydHMubWFwKGZpbGU9PntpZighZmlsZS5lbmRzV2l0aCgnLmpzJykpe3JldHVybiBudWxsO31yZXR1cm4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIix7cmVsOlwicHJlbG9hZFwiLGtleTpmaWxlLGhyZWY6YCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxhczpcInNjcmlwdFwiLG5vbmNlOnRoaXMucHJvcHMubm9uY2UsY3Jvc3NPcmlnaW46dGhpcy5wcm9wcy5jcm9zc09yaWdpbnx8cHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTn0pO30pLy8gRmlsdGVyIG91dCBudWxsZWQgc2NyaXB0c1xuLmZpbHRlcihCb29sZWFuKTt9Z2V0UHJlbG9hZE1haW5MaW5rcyhmaWxlcyl7Y29uc3R7YXNzZXRQcmVmaXgsZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmcsc2NyaXB0TG9hZGVyfT10aGlzLmNvbnRleHQ7Y29uc3QgcHJlbG9hZEZpbGVzPWZpbGVzLmFsbEZpbGVzLmZpbHRlcihmaWxlPT57cmV0dXJuIGZpbGUuZW5kc1dpdGgoJy5qcycpO30pO3JldHVyblsuLi4oc2NyaXB0TG9hZGVyLmJlZm9yZUludGVyYWN0aXZlfHxbXSkubWFwKGZpbGU9Pi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLHtrZXk6ZmlsZS5zcmMsbm9uY2U6dGhpcy5wcm9wcy5ub25jZSxyZWw6XCJwcmVsb2FkXCIsaHJlZjpmaWxlLnNyYyxhczpcInNjcmlwdFwiLGNyb3NzT3JpZ2luOnRoaXMucHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU59KSksLi4ucHJlbG9hZEZpbGVzLm1hcChmaWxlPT4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIix7a2V5OmZpbGUsbm9uY2U6dGhpcy5wcm9wcy5ub25jZSxyZWw6XCJwcmVsb2FkXCIsaHJlZjpgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLGFzOlwic2NyaXB0XCIsY3Jvc3NPcmlnaW46dGhpcy5wcm9wcy5jcm9zc09yaWdpbnx8cHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTn0pKV07fWdldER5bmFtaWNDaHVua3MoZmlsZXMpe3JldHVybiBnZXREeW5hbWljQ2h1bmtzKHRoaXMuY29udGV4dCx0aGlzLnByb3BzLGZpbGVzKTt9Z2V0UHJlTmV4dFNjcmlwdHMoKXtyZXR1cm4gZ2V0UHJlTmV4dFNjcmlwdHModGhpcy5jb250ZXh0LHRoaXMucHJvcHMpO31nZXRTY3JpcHRzKGZpbGVzKXtyZXR1cm4gZ2V0U2NyaXB0cyh0aGlzLmNvbnRleHQsdGhpcy5wcm9wcyxmaWxlcyk7fWdldFBvbHlmaWxsU2NyaXB0cygpe3JldHVybiBnZXRQb2x5ZmlsbFNjcmlwdHModGhpcy5jb250ZXh0LHRoaXMucHJvcHMpO31oYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zKGNoaWxkcmVuKXtjb25zdHtzY3JpcHRMb2FkZXJ9PXRoaXMuY29udGV4dDtjb25zdCBzY3JpcHRMb2FkZXJJdGVtcz1bXTtjb25zdCBmaWx0ZXJlZENoaWxkcmVuPVtdO19yZWFjdC5kZWZhdWx0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sY2hpbGQ9PntpZihjaGlsZC50eXBlPT09X3NjcmlwdC5kZWZhdWx0KXtpZihjaGlsZC5wcm9wcy5zdHJhdGVneT09PSdiZWZvcmVJbnRlcmFjdGl2ZScpe3NjcmlwdExvYWRlci5iZWZvcmVJbnRlcmFjdGl2ZT0oc2NyaXB0TG9hZGVyLmJlZm9yZUludGVyYWN0aXZlfHxbXSkuY29uY2F0KFt7Li4uY2hpbGQucHJvcHN9XSk7cmV0dXJuO31lbHNlIGlmKFsnbGF6eU9ubG9hZCcsJ2FmdGVySW50ZXJhY3RpdmUnXS5pbmNsdWRlcyhjaGlsZC5wcm9wcy5zdHJhdGVneSkpe3NjcmlwdExvYWRlckl0ZW1zLnB1c2goY2hpbGQucHJvcHMpO3JldHVybjt9fWZpbHRlcmVkQ2hpbGRyZW4ucHVzaChjaGlsZCk7fSk7dGhpcy5jb250ZXh0Ll9fTkVYVF9EQVRBX18uc2NyaXB0TG9hZGVyPXNjcmlwdExvYWRlckl0ZW1zO3JldHVybiBmaWx0ZXJlZENoaWxkcmVuO31tYWtlU3R5bGVzaGVldEluZXJ0KG5vZGUpe3JldHVybiBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAobm9kZSxjPT57aWYoYy50eXBlPT09J2xpbmsnJiZjLnByb3BzWydocmVmJ10mJl9jb25zdGFudHMuT1BUSU1JWkVEX0ZPTlRfUFJPVklERVJTLnNvbWUoKHt1cmx9KT0+Yy5wcm9wc1snaHJlZiddLnN0YXJ0c1dpdGgodXJsKSkpe2NvbnN0IG5ld1Byb3BzPXsuLi4oYy5wcm9wc3x8e30pfTtuZXdQcm9wc1snZGF0YS1ocmVmJ109bmV3UHJvcHNbJ2hyZWYnXTtuZXdQcm9wc1snaHJlZiddPXVuZGVmaW5lZDtyZXR1cm4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY2xvbmVFbGVtZW50KGMsbmV3UHJvcHMpO31lbHNlIGlmKGMucHJvcHMmJmMucHJvcHNbJ2NoaWxkcmVuJ10pe2MucHJvcHNbJ2NoaWxkcmVuJ109dGhpcy5tYWtlU3R5bGVzaGVldEluZXJ0KGMucHJvcHNbJ2NoaWxkcmVuJ10pO31yZXR1cm4gYzt9KTt9cmVuZGVyKCl7dmFyIF90aGlzJHByb3BzJG5vbmNlLF90aGlzJHByb3BzJG5vbmNlMjtjb25zdHtzdHlsZXMsYW1wUGF0aCxpbkFtcE1vZGUsaHlicmlkQW1wLGNhbm9uaWNhbEJhc2UsX19ORVhUX0RBVEFfXyxkYW5nZXJvdXNBc1BhdGgsaGVhZFRhZ3MsdW5zdGFibGVfcnVudGltZUpTLHVuc3RhYmxlX0pzUHJlbG9hZCxkaXNhYmxlT3B0aW1pemVkTG9hZGluZ309dGhpcy5jb250ZXh0O2NvbnN0IGRpc2FibGVSdW50aW1lSlM9dW5zdGFibGVfcnVudGltZUpTPT09ZmFsc2U7Y29uc3QgZGlzYWJsZUpzUHJlbG9hZD11bnN0YWJsZV9Kc1ByZWxvYWQ9PT1mYWxzZXx8IWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nO3RoaXMuY29udGV4dC5kb2NDb21wb25lbnRzUmVuZGVyZWQuSGVhZD10cnVlO2xldHtoZWFkfT10aGlzLmNvbnRleHQ7bGV0IGNzc1ByZWxvYWRzPVtdO2xldCBvdGhlckhlYWRFbGVtZW50cz1bXTtpZihoZWFkKXtoZWFkLmZvckVhY2goYz0+e2lmKGMmJmMudHlwZT09PSdsaW5rJyYmYy5wcm9wc1sncmVsJ109PT0ncHJlbG9hZCcmJmMucHJvcHNbJ2FzJ109PT0nc3R5bGUnKXtjc3NQcmVsb2Fkcy5wdXNoKGMpO31lbHNle2MmJm90aGVySGVhZEVsZW1lbnRzLnB1c2goYyk7fX0pO2hlYWQ9Y3NzUHJlbG9hZHMuY29uY2F0KG90aGVySGVhZEVsZW1lbnRzKTt9bGV0IGNoaWxkcmVuPV9yZWFjdC5kZWZhdWx0LkNoaWxkcmVuLnRvQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikuZmlsdGVyKEJvb2xlYW4pOy8vIHNob3cgYSB3YXJuaW5nIGlmIEhlYWQgY29udGFpbnMgPHRpdGxlPiAob25seSBpbiBkZXZlbG9wbWVudClcbmlmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtjaGlsZHJlbj1fcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sY2hpbGQ9Pnt2YXIgX2NoaWxkJHByb3BzO2NvbnN0IGlzUmVhY3RIZWxtZXQ9Y2hpbGQ9PW51bGw/dm9pZCAwOihfY2hpbGQkcHJvcHM9Y2hpbGQucHJvcHMpPT1udWxsP3ZvaWQgMDpfY2hpbGQkcHJvcHNbJ2RhdGEtcmVhY3QtaGVsbWV0J107aWYoIWlzUmVhY3RIZWxtZXQpe3ZhciBfY2hpbGQkcHJvcHMyO2lmKChjaGlsZD09bnVsbD92b2lkIDA6Y2hpbGQudHlwZSk9PT0ndGl0bGUnKXtjb25zb2xlLndhcm4oXCJXYXJuaW5nOiA8dGl0bGU+IHNob3VsZCBub3QgYmUgdXNlZCBpbiBfZG9jdW1lbnQuanMncyA8SGVhZD4uIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL25vLWRvY3VtZW50LXRpdGxlXCIpO31lbHNlIGlmKChjaGlsZD09bnVsbD92b2lkIDA6Y2hpbGQudHlwZSk9PT0nbWV0YScmJihjaGlsZD09bnVsbD92b2lkIDA6KF9jaGlsZCRwcm9wczI9Y2hpbGQucHJvcHMpPT1udWxsP3ZvaWQgMDpfY2hpbGQkcHJvcHMyLm5hbWUpPT09J3ZpZXdwb3J0Jyl7Y29uc29sZS53YXJuKFwiV2FybmluZzogdmlld3BvcnQgbWV0YSB0YWdzIHNob3VsZCBub3QgYmUgdXNlZCBpbiBfZG9jdW1lbnQuanMncyA8SGVhZD4uIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL25vLWRvY3VtZW50LXZpZXdwb3J0LW1ldGFcIik7fX1yZXR1cm4gY2hpbGQ7fSk7aWYodGhpcy5wcm9wcy5jcm9zc09yaWdpbiljb25zb2xlLndhcm4oJ1dhcm5pbmc6IGBIZWFkYCBhdHRyaWJ1dGUgYGNyb3NzT3JpZ2luYCBpcyBkZXByZWNhdGVkLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9kb2MtY3Jvc3NvcmlnaW4tZGVwcmVjYXRlZCcpO31pZihwcm9jZXNzLmVudi5OT0RFX0VOViE9PSdkZXZlbG9wbWVudCcmJnByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9GT05UUyYmIWluQW1wTW9kZSl7Y2hpbGRyZW49dGhpcy5tYWtlU3R5bGVzaGVldEluZXJ0KGNoaWxkcmVuKTt9Y2hpbGRyZW49dGhpcy5oYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zKGNoaWxkcmVuKTtsZXQgaGFzQW1waHRtbFJlbD1mYWxzZTtsZXQgaGFzQ2Fub25pY2FsUmVsPWZhbHNlOy8vIHNob3cgd2FybmluZyBhbmQgcmVtb3ZlIGNvbmZsaWN0aW5nIGFtcCBoZWFkIHRhZ3NcbmhlYWQ9X3JlYWN0LmRlZmF1bHQuQ2hpbGRyZW4ubWFwKGhlYWR8fFtdLGNoaWxkPT57aWYoIWNoaWxkKXJldHVybiBjaGlsZDtjb25zdHt0eXBlLHByb3BzfT1jaGlsZDtpZihpbkFtcE1vZGUpe2xldCBiYWRQcm9wPScnO2lmKHR5cGU9PT0nbWV0YScmJnByb3BzLm5hbWU9PT0ndmlld3BvcnQnKXtiYWRQcm9wPSduYW1lPVwidmlld3BvcnRcIic7fWVsc2UgaWYodHlwZT09PSdsaW5rJyYmcHJvcHMucmVsPT09J2Nhbm9uaWNhbCcpe2hhc0Nhbm9uaWNhbFJlbD10cnVlO31lbHNlIGlmKHR5cGU9PT0nc2NyaXB0Jyl7Ly8gb25seSBibG9jayBpZlxuLy8gMS4gaXQgaGFzIGEgc3JjIGFuZCBpc24ndCBwb2ludGluZyB0byBhbXBwcm9qZWN0J3MgQ0ROXG4vLyAyLiBpdCBpcyB1c2luZyBkYW5nZXJvdXNseVNldElubmVySFRNTCB3aXRob3V0IGEgdHlwZSBvclxuLy8gYSB0eXBlIG9mIHRleHQvamF2YXNjcmlwdFxuaWYocHJvcHMuc3JjJiZwcm9wcy5zcmMuaW5kZXhPZignYW1wcHJvamVjdCcpPC0xfHxwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCYmKCFwcm9wcy50eXBlfHxwcm9wcy50eXBlPT09J3RleHQvamF2YXNjcmlwdCcpKXtiYWRQcm9wPSc8c2NyaXB0JztPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChwcm9wPT57YmFkUHJvcCs9YCAke3Byb3B9PVwiJHtwcm9wc1twcm9wXX1cImA7fSk7YmFkUHJvcCs9Jy8+Jzt9fWlmKGJhZFByb3Ape2NvbnNvbGUud2FybihgRm91bmQgY29uZmxpY3RpbmcgYW1wIHRhZyBcIiR7Y2hpbGQudHlwZX1cIiB3aXRoIGNvbmZsaWN0aW5nIHByb3AgJHtiYWRQcm9wfSBpbiAke19fTkVYVF9EQVRBX18ucGFnZX0uIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL2NvbmZsaWN0aW5nLWFtcC10YWdgKTtyZXR1cm4gbnVsbDt9fWVsc2V7Ly8gbm9uLWFtcCBtb2RlXG5pZih0eXBlPT09J2xpbmsnJiZwcm9wcy5yZWw9PT0nYW1waHRtbCcpe2hhc0FtcGh0bWxSZWw9dHJ1ZTt9fXJldHVybiBjaGlsZDt9KTsvLyB0cnkgdG8gcGFyc2Ugc3R5bGVzIGZyb20gZnJhZ21lbnQgZm9yIGJhY2t3YXJkcyBjb21wYXRcbmNvbnN0IGN1clN0eWxlcz1BcnJheS5pc0FycmF5KHN0eWxlcyk/c3R5bGVzOltdO2lmKGluQW1wTW9kZSYmc3R5bGVzJiYvLyBAdHMtaWdub3JlIFByb3BlcnR5ICdwcm9wcycgZG9lcyBub3QgZXhpc3Qgb24gdHlwZSBSZWFjdEVsZW1lbnRcbnN0eWxlcy5wcm9wcyYmLy8gQHRzLWlnbm9yZSBQcm9wZXJ0eSAncHJvcHMnIGRvZXMgbm90IGV4aXN0IG9uIHR5cGUgUmVhY3RFbGVtZW50XG5BcnJheS5pc0FycmF5KHN0eWxlcy5wcm9wcy5jaGlsZHJlbikpe2NvbnN0IGhhc1N0eWxlcz1lbD0+e3ZhciBfZWwkcHJvcHMsX2VsJHByb3BzJGRhbmdlcm91c2x5O3JldHVybiBlbD09bnVsbD92b2lkIDA6KF9lbCRwcm9wcz1lbC5wcm9wcyk9PW51bGw/dm9pZCAwOihfZWwkcHJvcHMkZGFuZ2Vyb3VzbHk9X2VsJHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKT09bnVsbD92b2lkIDA6X2VsJHByb3BzJGRhbmdlcm91c2x5Ll9faHRtbDt9Oy8vIEB0cy1pZ25vcmUgUHJvcGVydHkgJ3Byb3BzJyBkb2VzIG5vdCBleGlzdCBvbiB0eXBlIFJlYWN0RWxlbWVudFxuc3R5bGVzLnByb3BzLmNoaWxkcmVuLmZvckVhY2goY2hpbGQ9PntpZihBcnJheS5pc0FycmF5KGNoaWxkKSl7Y2hpbGQuZm9yRWFjaChlbD0+aGFzU3R5bGVzKGVsKSYmY3VyU3R5bGVzLnB1c2goZWwpKTt9ZWxzZSBpZihoYXNTdHlsZXMoY2hpbGQpKXtjdXJTdHlsZXMucHVzaChjaGlsZCk7fX0pO31jb25zdCBmaWxlcz1nZXREb2N1bWVudEZpbGVzKHRoaXMuY29udGV4dC5idWlsZE1hbmlmZXN0LHRoaXMuY29udGV4dC5fX05FWFRfREFUQV9fLnBhZ2UsaW5BbXBNb2RlKTtyZXR1cm4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImhlYWRcIix0aGlzLnByb3BzLHRoaXMuY29udGV4dC5pc0RldmVsb3BtZW50JiYvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3QuZGVmYXVsdC5GcmFnbWVudCxudWxsLC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIix7XCJkYXRhLW5leHQtaGlkZS1mb3VjXCI6dHJ1ZSxcImRhdGEtYW1wZGV2bW9kZVwiOmluQW1wTW9kZT8ndHJ1ZSc6dW5kZWZpbmVkLGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOntfX2h0bWw6YGJvZHl7ZGlzcGxheTpub25lfWB9fSksLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLHtcImRhdGEtbmV4dC1oaWRlLWZvdWNcIjp0cnVlLFwiZGF0YS1hbXBkZXZtb2RlXCI6aW5BbXBNb2RlPyd0cnVlJzp1bmRlZmluZWR9LC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIix7ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6e19faHRtbDpgYm9keXtkaXNwbGF5OmJsb2NrfWB9fSkpKSxjaGlsZHJlbixwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibWV0YVwiLHtuYW1lOlwibmV4dC1mb250LXByZWNvbm5lY3RcIn0pLGhlYWQsLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIse25hbWU6XCJuZXh0LWhlYWQtY291bnRcIixjb250ZW50Ol9yZWFjdC5kZWZhdWx0LkNoaWxkcmVuLmNvdW50KGhlYWR8fFtdKS50b1N0cmluZygpfSksaW5BbXBNb2RlJiYvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3QuZGVmYXVsdC5GcmFnbWVudCxudWxsLC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibWV0YVwiLHtuYW1lOlwidmlld3BvcnRcIixjb250ZW50Olwid2lkdGg9ZGV2aWNlLXdpZHRoLG1pbmltdW0tc2NhbGU9MSxpbml0aWFsLXNjYWxlPTFcIn0pLCFoYXNDYW5vbmljYWxSZWwmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLHtyZWw6XCJjYW5vbmljYWxcIixocmVmOmNhbm9uaWNhbEJhc2UrKDAsX3V0aWxzMi5jbGVhbkFtcFBhdGgpKGRhbmdlcm91c0FzUGF0aCl9KSwvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIix7cmVsOlwicHJlbG9hZFwiLGFzOlwic2NyaXB0XCIsaHJlZjpcImh0dHBzOi8vY2RuLmFtcHByb2plY3Qub3JnL3YwLmpzXCJ9KSxzdHlsZXMmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIix7XCJhbXAtY3VzdG9tXCI6XCJcIixkYW5nZXJvdXNseVNldElubmVySFRNTDp7X19odG1sOmN1clN0eWxlcy5tYXAoc3R5bGU9PnN0eWxlLnByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLl9faHRtbCkuam9pbignJykucmVwbGFjZSgvXFwvXFwqIyBzb3VyY2VNYXBwaW5nVVJMPS4qXFwqXFwvL2csJycpLnJlcGxhY2UoL1xcL1xcKkAgc291cmNlVVJMPS4qP1xcKlxcLy9nLCcnKX19KSwvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIse1wiYW1wLWJvaWxlcnBsYXRlXCI6XCJcIixkYW5nZXJvdXNseVNldElubmVySFRNTDp7X19odG1sOmBib2R5ey13ZWJraXQtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7LW1vei1hbmltYXRpb246LWFtcC1zdGFydCA4cyBzdGVwcygxLGVuZCkgMHMgMSBub3JtYWwgYm90aDstbXMtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7YW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGh9QC13ZWJraXQta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUAtbW96LWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW1zLWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW8ta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUBrZXlmcmFtZXMgLWFtcC1zdGFydHtmcm9te3Zpc2liaWxpdHk6aGlkZGVufXRve3Zpc2liaWxpdHk6dmlzaWJsZX19YH19KSwvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm5vc2NyaXB0XCIsbnVsbCwvKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIse1wiYW1wLWJvaWxlcnBsYXRlXCI6XCJcIixkYW5nZXJvdXNseVNldElubmVySFRNTDp7X19odG1sOmBib2R5ey13ZWJraXQtYW5pbWF0aW9uOm5vbmU7LW1vei1hbmltYXRpb246bm9uZTstbXMtYW5pbWF0aW9uOm5vbmU7YW5pbWF0aW9uOm5vbmV9YH19KSksLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIix7YXN5bmM6dHJ1ZSxzcmM6XCJodHRwczovL2Nkbi5hbXBwcm9qZWN0Lm9yZy92MC5qc1wifSkpLCFpbkFtcE1vZGUmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LG51bGwsIWhhc0FtcGh0bWxSZWwmJmh5YnJpZEFtcCYmLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIse3JlbDpcImFtcGh0bWxcIixocmVmOmNhbm9uaWNhbEJhc2UrZ2V0QW1wUGF0aChhbXBQYXRoLGRhbmdlcm91c0FzUGF0aCl9KSwhcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyYmdGhpcy5nZXRDc3NMaW5rcyhmaWxlcyksIXByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9DU1MmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibm9zY3JpcHRcIix7XCJkYXRhLW4tY3NzXCI6KF90aGlzJHByb3BzJG5vbmNlPXRoaXMucHJvcHMubm9uY2UpIT1udWxsP190aGlzJHByb3BzJG5vbmNlOicnfSkscHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0lNQUdFUyYmLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIse25hbWU6XCJuZXh0LWltYWdlLXByZWxvYWRcIn0pLCFkaXNhYmxlUnVudGltZUpTJiYhZGlzYWJsZUpzUHJlbG9hZCYmdGhpcy5nZXRQcmVsb2FkRHluYW1pY0NodW5rcygpLCFkaXNhYmxlUnVudGltZUpTJiYhZGlzYWJsZUpzUHJlbG9hZCYmdGhpcy5nZXRQcmVsb2FkTWFpbkxpbmtzKGZpbGVzKSwhZGlzYWJsZU9wdGltaXplZExvYWRpbmcmJiFkaXNhYmxlUnVudGltZUpTJiZ0aGlzLmdldFBvbHlmaWxsU2NyaXB0cygpLCFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyYmIWRpc2FibGVSdW50aW1lSlMmJnRoaXMuZ2V0UHJlTmV4dFNjcmlwdHMoKSwhZGlzYWJsZU9wdGltaXplZExvYWRpbmcmJiFkaXNhYmxlUnVudGltZUpTJiZ0aGlzLmdldER5bmFtaWNDaHVua3MoZmlsZXMpLCFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyYmIWRpc2FibGVSdW50aW1lSlMmJnRoaXMuZ2V0U2NyaXB0cyhmaWxlcykscHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyYmdGhpcy5nZXRDc3NMaW5rcyhmaWxlcykscHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyYmLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLHtcImRhdGEtbi1jc3NcIjooX3RoaXMkcHJvcHMkbm9uY2UyPXRoaXMucHJvcHMubm9uY2UpIT1udWxsP190aGlzJHByb3BzJG5vbmNlMjonJ30pLHRoaXMuY29udGV4dC5pc0RldmVsb3BtZW50JiYvKiNfX1BVUkVfXyovIC8vIHRoaXMgZWxlbWVudCBpcyB1c2VkIHRvIG1vdW50IGRldmVsb3BtZW50IHN0eWxlcyBzbyB0aGVcbi8vIG9yZGVyaW5nIG1hdGNoZXMgcHJvZHVjdGlvblxuLy8gKGJ5IGRlZmF1bHQsIHN0eWxlLWxvYWRlciBpbmplY3RzIGF0IHRoZSBib3R0b20gb2YgPGhlYWQgLz4pXG5fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibm9zY3JpcHRcIix7aWQ6XCJfX25leHRfY3NzX19ET19OT1RfVVNFX19cIn0pLHN0eWxlc3x8bnVsbCksLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQse30sLi4uKGhlYWRUYWdzfHxbXSkpKTt9fWV4cG9ydHMuSGVhZD1IZWFkO0hlYWQuY29udGV4dFR5cGU9X2RvY3VtZW50Q29udGV4dC5Eb2N1bWVudENvbnRleHQ7SGVhZC5wcm9wVHlwZXM9e25vbmNlOl9wcm9wVHlwZXMuZGVmYXVsdC5zdHJpbmcsY3Jvc3NPcmlnaW46X3Byb3BUeXBlcy5kZWZhdWx0LnN0cmluZ307ZnVuY3Rpb24gTWFpbigpe2NvbnN0e2luQW1wTW9kZSxodG1sLGRvY0NvbXBvbmVudHNSZW5kZXJlZH09KDAsX3JlYWN0LnVzZUNvbnRleHQpKF9kb2N1bWVudENvbnRleHQuRG9jdW1lbnRDb250ZXh0KTtkb2NDb21wb25lbnRzUmVuZGVyZWQuTWFpbj10cnVlO2lmKGluQW1wTW9kZSlyZXR1cm4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3QuZGVmYXVsdC5GcmFnbWVudCxudWxsLF9jb25zdGFudHMuQU1QX1JFTkRFUl9UQVJHRVQpO3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIse2lkOlwiX19uZXh0XCIsZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6e19faHRtbDpodG1sfX0pO31jbGFzcyBOZXh0U2NyaXB0IGV4dGVuZHMgX3JlYWN0LkNvbXBvbmVudHtjb25zdHJ1Y3RvciguLi5hcmdzKXtzdXBlciguLi5hcmdzKTt0aGlzLmNvbnRleHQ9dm9pZCAwO31nZXREeW5hbWljQ2h1bmtzKGZpbGVzKXtyZXR1cm4gZ2V0RHluYW1pY0NodW5rcyh0aGlzLmNvbnRleHQsdGhpcy5wcm9wcyxmaWxlcyk7fWdldFByZU5leHRTY3JpcHRzKCl7cmV0dXJuIGdldFByZU5leHRTY3JpcHRzKHRoaXMuY29udGV4dCx0aGlzLnByb3BzKTt9Z2V0U2NyaXB0cyhmaWxlcyl7cmV0dXJuIGdldFNjcmlwdHModGhpcy5jb250ZXh0LHRoaXMucHJvcHMsZmlsZXMpO31nZXRQb2x5ZmlsbFNjcmlwdHMoKXtyZXR1cm4gZ2V0UG9seWZpbGxTY3JpcHRzKHRoaXMuY29udGV4dCx0aGlzLnByb3BzKTt9c3RhdGljIGdldElubGluZVNjcmlwdFNvdXJjZShkb2N1bWVudFByb3BzKXtjb25zdHtfX05FWFRfREFUQV9ffT1kb2N1bWVudFByb3BzO3RyeXtjb25zdCBkYXRhPUpTT04uc3RyaW5naWZ5KF9fTkVYVF9EQVRBX18pO3JldHVybigwLF9odG1sZXNjYXBlLmh0bWxFc2NhcGVKc29uU3RyaW5nKShkYXRhKTt9Y2F0Y2goZXJyKXtpZihlcnIubWVzc2FnZS5pbmRleE9mKCdjaXJjdWxhciBzdHJ1Y3R1cmUnKSl7dGhyb3cgbmV3IEVycm9yKGBDaXJjdWxhciBzdHJ1Y3R1cmUgaW4gXCJnZXRJbml0aWFsUHJvcHNcIiByZXN1bHQgb2YgcGFnZSBcIiR7X19ORVhUX0RBVEFfXy5wYWdlfVwiLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9jaXJjdWxhci1zdHJ1Y3R1cmVgKTt9dGhyb3cgZXJyO319cmVuZGVyKCl7Y29uc3R7YXNzZXRQcmVmaXgsaW5BbXBNb2RlLGJ1aWxkTWFuaWZlc3QsdW5zdGFibGVfcnVudGltZUpTLGRvY0NvbXBvbmVudHNSZW5kZXJlZCxkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyxkaXNhYmxlT3B0aW1pemVkTG9hZGluZ309dGhpcy5jb250ZXh0O2NvbnN0IGRpc2FibGVSdW50aW1lSlM9dW5zdGFibGVfcnVudGltZUpTPT09ZmFsc2U7ZG9jQ29tcG9uZW50c1JlbmRlcmVkLk5leHRTY3JpcHQ9dHJ1ZTtpZihpbkFtcE1vZGUpe2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WPT09J3Byb2R1Y3Rpb24nKXtyZXR1cm4gbnVsbDt9Y29uc3QgYW1wRGV2RmlsZXM9Wy4uLmJ1aWxkTWFuaWZlc3QuZGV2RmlsZXMsLi4uYnVpbGRNYW5pZmVzdC5wb2x5ZmlsbEZpbGVzLC4uLmJ1aWxkTWFuaWZlc3QuYW1wRGV2RmlsZXNdO3JldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LG51bGwsZGlzYWJsZVJ1bnRpbWVKUz9udWxsOi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIse2lkOlwiX19ORVhUX0RBVEFfX1wiLHR5cGU6XCJhcHBsaWNhdGlvbi9qc29uXCIsbm9uY2U6dGhpcy5wcm9wcy5ub25jZSxjcm9zc09yaWdpbjp0aGlzLnByb3BzLmNyb3NzT3JpZ2lufHxwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOLGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOntfX2h0bWw6TmV4dFNjcmlwdC5nZXRJbmxpbmVTY3JpcHRTb3VyY2UodGhpcy5jb250ZXh0KX0sXCJkYXRhLWFtcGRldm1vZGVcIjp0cnVlfSksYW1wRGV2RmlsZXMubWFwKGZpbGU9Pi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIse2tleTpmaWxlLHNyYzpgJHthc3NldFByZWZpeH0vX25leHQvJHtmaWxlfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxub25jZTp0aGlzLnByb3BzLm5vbmNlLGNyb3NzT3JpZ2luOnRoaXMucHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU4sXCJkYXRhLWFtcGRldm1vZGVcIjp0cnVlfSkpKTt9aWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpe2lmKHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4pY29uc29sZS53YXJuKCdXYXJuaW5nOiBgTmV4dFNjcmlwdGAgYXR0cmlidXRlIGBjcm9zc09yaWdpbmAgaXMgZGVwcmVjYXRlZC4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvZG9jLWNyb3Nzb3JpZ2luLWRlcHJlY2F0ZWQnKTt9Y29uc3QgZmlsZXM9Z2V0RG9jdW1lbnRGaWxlcyh0aGlzLmNvbnRleHQuYnVpbGRNYW5pZmVzdCx0aGlzLmNvbnRleHQuX19ORVhUX0RBVEFfXy5wYWdlLGluQW1wTW9kZSk7cmV0dXJuLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsbnVsbCwhZGlzYWJsZVJ1bnRpbWVKUyYmYnVpbGRNYW5pZmVzdC5kZXZGaWxlcz9idWlsZE1hbmlmZXN0LmRldkZpbGVzLm1hcChmaWxlPT4vKiNfX1BVUkVfXyovX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLHtrZXk6ZmlsZSxzcmM6YCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7ZW5jb2RlVVJJKGZpbGUpfSR7ZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmd9YCxub25jZTp0aGlzLnByb3BzLm5vbmNlLGNyb3NzT3JpZ2luOnRoaXMucHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU59KSk6bnVsbCxkaXNhYmxlUnVudGltZUpTP251bGw6LyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIix7aWQ6XCJfX05FWFRfREFUQV9fXCIsdHlwZTpcImFwcGxpY2F0aW9uL2pzb25cIixub25jZTp0aGlzLnByb3BzLm5vbmNlLGNyb3NzT3JpZ2luOnRoaXMucHJvcHMuY3Jvc3NPcmlnaW58fHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU4sZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6e19faHRtbDpOZXh0U2NyaXB0LmdldElubGluZVNjcmlwdFNvdXJjZSh0aGlzLmNvbnRleHQpfX0pLGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nJiYhZGlzYWJsZVJ1bnRpbWVKUyYmdGhpcy5nZXRQb2x5ZmlsbFNjcmlwdHMoKSxkaXNhYmxlT3B0aW1pemVkTG9hZGluZyYmIWRpc2FibGVSdW50aW1lSlMmJnRoaXMuZ2V0UHJlTmV4dFNjcmlwdHMoKSxkaXNhYmxlT3B0aW1pemVkTG9hZGluZyYmIWRpc2FibGVSdW50aW1lSlMmJnRoaXMuZ2V0RHluYW1pY0NodW5rcyhmaWxlcyksZGlzYWJsZU9wdGltaXplZExvYWRpbmcmJiFkaXNhYmxlUnVudGltZUpTJiZ0aGlzLmdldFNjcmlwdHMoZmlsZXMpKTt9fWV4cG9ydHMuTmV4dFNjcmlwdD1OZXh0U2NyaXB0O05leHRTY3JpcHQuY29udGV4dFR5cGU9X2RvY3VtZW50Q29udGV4dC5Eb2N1bWVudENvbnRleHQ7TmV4dFNjcmlwdC5wcm9wVHlwZXM9e25vbmNlOl9wcm9wVHlwZXMuZGVmYXVsdC5zdHJpbmcsY3Jvc3NPcmlnaW46X3Byb3BUeXBlcy5kZWZhdWx0LnN0cmluZ307TmV4dFNjcmlwdC5zYWZhcmlOb21vZHVsZUZpeD0nIWZ1bmN0aW9uKCl7dmFyIGU9ZG9jdW1lbnQsdD1lLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7aWYoIShcIm5vTW9kdWxlXCJpbiB0KSYmXCJvbmJlZm9yZWxvYWRcImluIHQpe3ZhciBuPSExO2UuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZWxvYWRcIixmdW5jdGlvbihlKXtpZihlLnRhcmdldD09PXQpbj0hMDtlbHNlIGlmKCFlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJub21vZHVsZVwiKXx8IW4pcmV0dXJuO2UucHJldmVudERlZmF1bHQoKX0sITApLHQudHlwZT1cIm1vZHVsZVwiLHQuc3JjPVwiLlwiLGUuaGVhZC5hcHBlbmRDaGlsZCh0KSx0LnJlbW92ZSgpfX0oKTsnO2Z1bmN0aW9uIGdldEFtcFBhdGgoYW1wUGF0aCxhc1BhdGgpe3JldHVybiBhbXBQYXRofHxgJHthc1BhdGh9JHthc1BhdGguaW5jbHVkZXMoJz8nKT8nJic6Jz8nfWFtcD0xYDt9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1fZG9jdW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5odG1sRXNjYXBlSnNvblN0cmluZz1odG1sRXNjYXBlSnNvblN0cmluZzsvLyBUaGlzIHV0aWxpdHkgaXMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL3plcnRvc2gvaHRtbGVzY2FwZVxuLy8gTGljZW5zZTogaHR0cHM6Ly9naXRodWIuY29tL3plcnRvc2gvaHRtbGVzY2FwZS9ibG9iLzA1MjdjYTcxNTZhNTI0ZDI1NjEwMWJiMzEwYTlmOTcwZjYzMDc4YWQvTElDRU5TRVxuY29uc3QgRVNDQVBFX0xPT0tVUD17JyYnOidcXFxcdTAwMjYnLCc+JzonXFxcXHUwMDNlJywnPCc6J1xcXFx1MDAzYycsJ1xcdTIwMjgnOidcXFxcdTIwMjgnLCdcXHUyMDI5JzonXFxcXHUyMDI5J307Y29uc3QgRVNDQVBFX1JFR0VYPS9bJj48XFx1MjAyOFxcdTIwMjldL2c7ZnVuY3Rpb24gaHRtbEVzY2FwZUpzb25TdHJpbmcoc3RyKXtyZXR1cm4gc3RyLnJlcGxhY2UoRVNDQVBFX1JFR0VYLG1hdGNoPT5FU0NBUEVfTE9PS1VQW21hdGNoXSk7fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHRtbGVzY2FwZS5qcy5tYXAiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2V4dGVuZHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICB2YXIgdGFyZ2V0ID0ge307XG4gIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgdmFyIGtleSwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgdmFyIGhhcyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArXG4gICAgICAgICAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNldHMgd2FybmluZyBjYWNoZSB3aGVuIHRlc3RpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgZWxlbWVudFR5cGU6IGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIsXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJyArIHByb3BGdWxsTmFtZSArICdgIHByb3Agb24gYCcgKyBjb21wb25lbnROYW1lICArICdgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQgdHlwZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cyBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXksIGdvdCAnICsgYXJndW1lbnRzLmxlbmd0aCArICcgYXJndW1lbnRzLiAnICtcbiAgICAgICAgICAgICdBIGNvbW1vbiBtaXN0YWtlIGlzIHRvIHdyaXRlIG9uZU9mKHgsIHksIHopIGluc3RlYWQgb2Ygb25lT2YoW3gsIHksIHpdKS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcywgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgU3RyaW5nKHByb3BWYWx1ZSkgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKGhhcyhwcm9wVmFsdWUsIGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICcgKyBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlcikgKyAnIGF0IGluZGV4ICcgKyBpICsgJy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tXG4gICAgICAvLyBwcm9wcy5cbiAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGFsbEtleXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBmYWxzeSB2YWx1ZSBjYW4ndCBiZSBhIFN5bWJvbFxuICAgIGlmICghcHJvcFZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBjaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZTtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0SXMgPSByZXF1aXJlKCdyZWFjdC1pcycpO1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoUmVhY3RJcy5pc0VsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi4xMy4xXG4gKiByZWFjdC1pcy5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIGhhc1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wb3J0YWwnKSA6IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnJhZ21lbnQnKSA6IDB4ZWFjYjtcbnZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3RyaWN0X21vZGUnKSA6IDB4ZWFjYztcbnZhciBSRUFDVF9QUk9GSUxFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvZmlsZXInKSA6IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvdmlkZXInKSA6IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb250ZXh0JykgOiAweGVhY2U7IC8vIFRPRE86IFdlIGRvbid0IHVzZSBBc3luY01vZGUgb3IgQ29uY3VycmVudE1vZGUgYW55bW9yZS4gVGhleSB3ZXJlIHRlbXBvcmFyeVxuLy8gKHVuc3RhYmxlKSBBUElzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQuIENhbiB3ZSByZW1vdmUgdGhlIHN5bWJvbHM/XG5cbnZhciBSRUFDVF9BU1lOQ19NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5hc3luY19tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb25jdXJyZW50X21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKSA6IDB4ZWFkMDtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKSA6IDB4ZWFkMTtcbnZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0JykgOiAweGVhZDg7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubWVtbycpIDogMHhlYWQzO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmxhenknKSA6IDB4ZWFkNDtcbnZhciBSRUFDVF9CTE9DS19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuYmxvY2snKSA6IDB4ZWFkOTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnVuZGFtZW50YWwnKSA6IDB4ZWFkNTtcbnZhciBSRUFDVF9SRVNQT05ERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnJlc3BvbmRlcicpIDogMHhlYWQ2O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zY29wZScpIDogMHhlYWQ3O1xuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9SRVNQT05ERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9TQ09QRV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUpO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0FTWU5DX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciAkJHR5cGVvZlR5cGUgPSB0eXBlICYmIHR5cGUuJCR0eXBlb2Y7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoJCR0eXBlb2ZUeXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZlR5cGU7XG5cbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn0gLy8gQXN5bmNNb2RlIGlzIGRlcHJlY2F0ZWQgYWxvbmcgd2l0aCBpc0FzeW5jTW9kZVxuXG52YXIgQXN5bmNNb2RlID0gUkVBQ1RfQVNZTkNfTU9ERV9UWVBFO1xudmFyIENvbmN1cnJlbnRNb2RlID0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU7XG52YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xudmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG52YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbnZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbnZhciBGcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG52YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbnZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xudmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xudmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbnZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbnZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTsgLy8gQXN5bmNNb2RlIHNob3VsZCBiZSBkZXByZWNhdGVkXG5cbmZ1bmN0aW9uIGlzQXN5bmNNb2RlKG9iamVjdCkge1xuICB7XG4gICAgaWYgKCFoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSB0cnVlOyAvLyBVc2luZyBjb25zb2xlWyd3YXJuJ10gdG8gZXZhZGUgQmFiZWwgYW5kIEVTTGludFxuXG4gICAgICBjb25zb2xlWyd3YXJuJ10oJ1RoZSBSZWFjdElzLmlzQXN5bmNNb2RlKCkgYWxpYXMgaGFzIGJlZW4gZGVwcmVjYXRlZCwgJyArICdhbmQgd2lsbCBiZSByZW1vdmVkIGluIFJlYWN0IDE3Ky4gVXBkYXRlIHlvdXIgY29kZSB0byB1c2UgJyArICdSZWFjdElzLmlzQ29uY3VycmVudE1vZGUoKSBpbnN0ZWFkLiBJdCBoYXMgdGhlIGV4YWN0IHNhbWUgQVBJLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkgfHwgdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0FTWU5DX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU7XG59XG5mdW5jdGlvbiBpc0NvbnRleHRDb25zdW1lcihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05URVhUX1RZUEU7XG59XG5mdW5jdGlvbiBpc0NvbnRleHRQcm92aWRlcihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QUk9WSURFUl9UWVBFO1xufVxuZnVuY3Rpb24gaXNFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNGb3J3YXJkUmVmKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG59XG5mdW5jdGlvbiBpc0ZyYWdtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG59XG5mdW5jdGlvbiBpc0xhenkob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTEFaWV9UWVBFO1xufVxuZnVuY3Rpb24gaXNNZW1vKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX01FTU9fVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUG9ydGFsKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BPUlRBTF9UWVBFO1xufVxuZnVuY3Rpb24gaXNQcm9maWxlcihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdHJpY3RNb2RlKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG59XG5mdW5jdGlvbiBpc1N1c3BlbnNlKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG59XG5cbmV4cG9ydHMuQXN5bmNNb2RlID0gQXN5bmNNb2RlO1xuZXhwb3J0cy5Db25jdXJyZW50TW9kZSA9IENvbmN1cnJlbnRNb2RlO1xuZXhwb3J0cy5Db250ZXh0Q29uc3VtZXIgPSBDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLkNvbnRleHRQcm92aWRlciA9IENvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuRWxlbWVudCA9IEVsZW1lbnQ7XG5leHBvcnRzLkZvcndhcmRSZWYgPSBGb3J3YXJkUmVmO1xuZXhwb3J0cy5GcmFnbWVudCA9IEZyYWdtZW50O1xuZXhwb3J0cy5MYXp5ID0gTGF6eTtcbmV4cG9ydHMuTWVtbyA9IE1lbW87XG5leHBvcnRzLlBvcnRhbCA9IFBvcnRhbDtcbmV4cG9ydHMuUHJvZmlsZXIgPSBQcm9maWxlcjtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IFN0cmljdE1vZGU7XG5leHBvcnRzLlN1c3BlbnNlID0gU3VzcGVuc2U7XG5leHBvcnRzLmlzQXN5bmNNb2RlID0gaXNBc3luY01vZGU7XG5leHBvcnRzLmlzQ29uY3VycmVudE1vZGUgPSBpc0NvbmN1cnJlbnRNb2RlO1xuZXhwb3J0cy5pc0NvbnRleHRDb25zdW1lciA9IGlzQ29udGV4dENvbnN1bWVyO1xuZXhwb3J0cy5pc0NvbnRleHRQcm92aWRlciA9IGlzQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5pc0VsZW1lbnQgPSBpc0VsZW1lbnQ7XG5leHBvcnRzLmlzRm9yd2FyZFJlZiA9IGlzRm9yd2FyZFJlZjtcbmV4cG9ydHMuaXNGcmFnbWVudCA9IGlzRnJhZ21lbnQ7XG5leHBvcnRzLmlzTGF6eSA9IGlzTGF6eTtcbmV4cG9ydHMuaXNNZW1vID0gaXNNZW1vO1xuZXhwb3J0cy5pc1BvcnRhbCA9IGlzUG9ydGFsO1xuZXhwb3J0cy5pc1Byb2ZpbGVyID0gaXNQcm9maWxlcjtcbmV4cG9ydHMuaXNTdHJpY3RNb2RlID0gaXNTdHJpY3RNb2RlO1xuZXhwb3J0cy5pc1N1c3BlbnNlID0gaXNTdXNwZW5zZTtcbmV4cG9ydHMuaXNWYWxpZEVsZW1lbnRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlO1xuZXhwb3J0cy50eXBlT2YgPSB0eXBlT2Y7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvY29uc3RhbnRzLmpzXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL2RvY3VtZW50LWNvbnRleHQuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvaGVhZC1tYW5hZ2VyLWNvbnRleHQuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvdXRpbHMuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9zZXJ2ZXIvZ2V0LXBhZ2UtZmlsZXMuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9zZXJ2ZXIvdXRpbHMuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHlsZWQtanN4L3NlcnZlclwiKTs7Il0sInNvdXJjZVJvb3QiOiIifQ==