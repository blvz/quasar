/*!
 * Quasar Framework v0.9.1
 * (c) 2016 Razvan Stoenescu
 * Released under the MIT License.
 */
import Velocity$1 from 'velocity-animate';
import moment from 'moment';
import FastClick from 'fastclick';

/* eslint-disable no-useless-escape */

function getUserAgent () {
  return (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
}

function getMatch (userAgent, platformMatch) {
  var match = /(edge)\/([\w.]+)/.exec(userAgent) ||
    /(opr)[\/]([\w.]+)/.exec(userAgent) ||
    /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
    /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
    /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
    /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
    /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
    /(msie) ([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
    [];

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent) ||
    /(ipod)/.exec(userAgent) ||
    /(windows phone)/.exec(userAgent) ||
    /(iphone)/.exec(userAgent) ||
    /(kindle)/.exec(userAgent) ||
    /(silk)/.exec(userAgent) ||
    /(android)/.exec(userAgent) ||
    /(win)/.exec(userAgent) ||
    /(mac)/.exec(userAgent) ||
    /(linux)/.exec(userAgent) ||
    /(cros)/.exec(userAgent) ||
    /(playbook)/.exec(userAgent) ||
    /(bb)/.exec(userAgent) ||
    /(blackberry)/.exec(userAgent) ||
    []
}

function getPlatform () {
  let
    userAgent = getUserAgent(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser['windows phone']) {
    browser.mobile = true;
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }

  if (browser['windows phone']) {
    browser.winphone = true;
    delete browser['windows phone'];
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv || browser.iemobile) {
    matched.browser = 'ie';
    browser.ie = true;
  }

  // Edge is officially known as Microsoft Edge, so rewrite the key to match
  if (browser.edge) {
    matched.browser = 'edge';
    browser.edge = true;
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = 'blackberry';
    browser.blackberry = true;
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook';
    browser.playbook = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera';
    browser.opera = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android';
    browser.android = true;
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle';
    browser.kindle = true;
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk';
    browser.silk = true;
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi';
    browser.vivaldi = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  if (window._cordovaNative) {
    browser.cordova = true;
  }

  if (window && window.process && window.process.versions && window.process.versions.electron) {
    browser.electron = true;
  }

  return browser
}

var Platform = {
  is: getPlatform(),
  has: {
    touch: (() => !!('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints > 0)()
  },
  within: {
    iframe: window.self !== window.top
  }
};

let bus;

function install$1 (_Vue) {
  bus = new _Vue();
}

var Events = {
  $on (...args) { bus && bus.$on(...args); },
  $once (...args) { bus && bus.$once(...args); },
  $emit (...args) { bus && bus.$emit(...args); },
  $off (...args) { bus && bus.$off(...args); }
};

/*
 * Credits go to sindresorhus
 */

function rgbToHex (red, green, blue) {
  if (typeof red === 'string') {
    const res = red.match(/\b\d{1,3}\b/g).map(Number);
    red = res[0];
    green = res[1];
    blue = res[2];
  }

  if (
    typeof red !== 'number' ||
    typeof green !== 'number' ||
    typeof blue !== 'number' ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  let num = parseInt(hex, 16);

  return [num >> 16, num >> 8 & 255, num & 255]
}


var colors = Object.freeze({
	rgbToHex: rgbToHex,
	hexToRgb: hexToRgb
});

let now = Date.now;

var debounce = function (fn, wait = 250, immediate) {
  let
    timeout, params, context, timestamp, result,
    later = () => {
      let last = now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      }
      else {
        timeout = null;
        if (!immediate) {
          result = fn.apply(context, params);
          if (!timeout) {
            context = params = null;
          }
        }
      }
    };

  return function (...args) {
    var callNow = immediate && !timeout;

    context = this;
    timestamp = now();
    params = args;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = fn.apply(context, args);
      context = params = null;
    }

    return result
  }
};

function offset (el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  let {top, left} = el.getBoundingClientRect();

  return {top, left}
}

function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

function height$1 (el) {
  if (el === window) {
    return viewport().height
  }
  return parseFloat(window.getComputedStyle(el).getPropertyValue('height'), 10)
}

function width$1 (el) {
  if (el === window) {
    return viewport().width
  }
  return parseFloat(window.getComputedStyle(el).getPropertyValue('width'), 10)
}

function css$1 (element, css) {
  let style = element.style;

  Object.keys(css).forEach(prop => {
    style[prop] = css[prop];
  });
}

function viewport () {
  let
    e = window,
    a = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  }
}

function ready$1 (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState === 'complete') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false);
}

function getScrollTarget (el) {
  return el.closest('.layout-view') || window
}

function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}


var dom = Object.freeze({
	offset: offset,
	style: style,
	height: height$1,
	width: width$1,
	css: css$1,
	viewport: viewport,
	ready: ready$1,
	getScrollTarget: getScrollTarget,
	getScrollPosition: getScrollPosition
});

function rightClick (e) {
  if (!e) {
    e = window.event;
  }

  if (e.which) {
    return e.which == 3 // eslint-disable-line
  }
  if (e.button) {
    return e.button == 2 // eslint-disable-line
  }

  return false
}

function position$1 (e) {
  let posx, posy;

  if (!e) {
    e = window.event;
  }
  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  }

  if (e.clientX || e.clientY) {
    posx = e.clientX;
    posy = e.clientY;
  }
  else if (e.pageX || e.pageY) {
    posx = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
    posy = e.pageY - document.body.scrollTop - document.documentElement.scrollTop;
  }

  return {
    top: posy,
    left: posx
  }
}

function targetElement (e) {
  let target;

  if (!e) {
    e = window.event;
  }

  if (e.target) {
    target = e.target;
  }
  else if (e.srcElement) {
    target = e.srcElement;
  }

  // defeat Safari bug
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  return target
}


var event = Object.freeze({
	rightClick: rightClick,
	position: position$1,
	targetElement: targetElement
});

let toString = Object.prototype.toString;
let hasOwn = Object.prototype.hasOwnProperty;
let class2type = {};

'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(name => {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

function type$1 (obj) {
  return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'
}

function isPlainObject (obj) {
  if (!obj || type$1(obj) !== 'object') {
    return false
  }

  if (obj.constructor &&
    !hasOwn.call(obj, 'constructor') &&
    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  let key;
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key)
}

function extend () {
  let
    options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && type$1(target) !== 'function') {
    target = {};
  }

  if (length === i) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = type$1(copy) === 'array'))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && type$1(src) === 'array' ? src : [];
          }
          else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target
}

var getVueRef = function (vm, refName) {
  let parent = vm.$parent;

  while (parent && (!parent.$refs || !parent.$refs[refName])) {
    parent = parent.$parent;
  }

  if (parent) {
    return parent.$refs[refName]
  }
};

var ModalGenerator = function (VueComponent) {
  return {
    create (props) {
      const node = document.createElement('div');
      document.body.appendChild(node);

      let vm = new Vue({
        el: node,
        data () {
          return {props}
        },
        render: h => h(VueComponent, {props})
      });

      return {
        close (fn) {
          vm.quasarClose(fn);
        }
      }
    }
  }
};

var Dialog$1 = {render: function(){with(this){return _h('q-modal',{ref:"dialog",staticClass:"minimized"},[_h('div',{staticClass:"modal-header",domProps:{"innerHTML":_s(title || '')}}),(message)?_h('div',{staticClass:"modal-body modal-scroll",domProps:{"innerHTML":_s(message)}}):_e(),(form)?_h('div',{staticClass:"modal-body modal-scroll"},[_l((form),function(el){return [(el.type === 'heading')?_h('h6',{domProps:{"innerHTML":_s(el.label)}}):_e(),(el.type === 'textbox')?_h('div',{staticClass:"floating-label",staticStyle:{"margin-bottom":"10px"}},[_h('input',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],staticClass:"full-width",attrs:{"type":"text","placeholder":el.placeholder,"required":""},domProps:{"value":_s(el.model)},on:{"input":function($event){if($event.target.composing)return;el.model=$event.target.value;}}}),_h('label',{domProps:{"innerHTML":_s(el.label)}})]):_e(),(el.type === 'textarea')?_h('div',{staticClass:"floating-label",staticStyle:{"margin-bottom":"10px"}},[_h('textarea',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],staticClass:"full-width",attrs:{"type":"text","placeholder":el.placeholder,"required":""},domProps:{"value":_s(el.model)},on:{"input":function($event){if($event.target.composing)return;el.model=$event.target.value;}}}),_h('label',{domProps:{"innerHTML":_s(el.label)}})]):_e(),(el.type === 'numeric')?_h('div',{staticStyle:{"margin-bottom":"10px"}},[_h('label',{domProps:{"innerHTML":_s(el.label)}}),_h('q-numeric',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],attrs:{"min":el.min,"max":el.max,"step":el.step},domProps:{"value":(el.model)},on:{"input":function($event){el.model=$event;}}})]):_e(),(el.type === 'chips')?_h('div',{staticStyle:{"margin-bottom":"10px"}},[_h('label',{domProps:{"innerHTML":_s(el.label)}}),_h('q-chips',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],domProps:{"value":(el.model)},on:{"input":function($event){el.model=$event;}}})]):_e(),_l((el.items),function(radio){return (el.type === 'radio')?_h('label',{staticClass:"item"},[_h('div',{staticClass:"item-primary"},[_h('q-radio',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],attrs:{"val":radio.value},domProps:{"value":(el.model)},on:{"input":function($event){el.model=$event;}}})]),_h('div',{staticClass:"item-content",domProps:{"innerHTML":_s(radio.label)}})]):_e()}),_l((el.items),function(checkbox){return (el.type === 'checkbox')?_h('label',{staticClass:"item"},[_h('div',{staticClass:"item-primary"},[_h('q-checkbox',{directives:[{name:"model",rawName:"v-model",value:(checkbox.model),expression:"checkbox.model"}],domProps:{"value":(checkbox.model)},on:{"input":function($event){checkbox.model=$event;}}})]),_h('div',{staticClass:"item-content",domProps:{"innerHTML":_s(checkbox.label)}})]):_e()}),_l((el.items),function(toggle){return (el.type === 'toggle')?_h('label',{staticClass:"item"},[_h('div',{staticClass:"item-content has-secondary",domProps:{"innerHTML":_s(toggle.label)}}),_h('div',{staticClass:"item-secondary"},[_h('q-toggle',{directives:[{name:"model",rawName:"v-model",value:(toggle.model),expression:"toggle.model"}],domProps:{"value":(toggle.model)},on:{"input":function($event){toggle.model=$event;}}})])]):_e()}),(el.type === 'rating')?_h('div',{staticStyle:{"margin-bottom":"10px"}},[_h('label',{domProps:{"innerHTML":_s(el.label)}}),_h('q-rating',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],style:({fontSize: el.size || '2rem'}),attrs:{"max":el.max,"icon":el.icon},domProps:{"value":(el.model)},on:{"input":function($event){el.model=$event;}}})]):_e()]})]):_e(),(progress)?_h('div',{staticClass:"modal-body"},[_h('q-progress',{staticClass:"primary stripe animate",class:{indeterminate: progress.indeterminate},attrs:{"percentage":progress.model}}),(!progress.indeterminate)?_h('span',[_s(progress.model)+" %"]):_e()]):_e(),(buttons)?_h('div',{staticClass:"modal-buttons",class:{row: !stackButtons, column: stackButtons}},[_l((buttons),function(button){return _h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(typeof button === 'string' ? button : button.label)},on:{"click":function($event){trigger(button.handler);}}})})]):_e(),(!buttons && !nobuttons)?_h('div',{staticClass:"modal-buttons row"},[_h('button',{staticClass:"primary clear",on:{"click":function($event){close();}}},["OK"])]):_e()])}},staticRenderFns: [],
  props: {
    title: String,
    message: String,
    form: Object,
    stackButtons: Boolean,
    buttons: Array,
    nobuttons: Boolean,
    progress: Object
  },
  computed: {
    opened () {
      return this.$refs.dialog.active
    }
  },
  methods: {
    trigger (handler) {
      this.close(() => {
        if (typeof handler === 'function') {
          handler(this.getFormData());
        }
      });
    },
    getFormData () {
      if (!this.form) {
        return
      }

      let data = {};

      Object.keys(this.form).forEach(name => {
        let el = this.form[name];
        if (['checkbox', 'toggle'].includes(el.type)) {
          data[name] = el.items.filter(item => item.model).map(item => item.value);
        }
        else if (el.type !== 'heading') {
          data[name] = el.model;
        }
      });

      return data
    },
    close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(() => {
        if (typeof fn === 'function') {
          fn();
        }
        this.$root.$destroy();
      });
    }
  },
  mounted () {
    this.$refs.dialog.open();
    this.$root.quasarClose = this.close;
  },
  destroyed () {
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el);
    }
  }
};

var Dialog = ModalGenerator(Dialog$1);

/* istanbul ignore next */
var openURL = (url) => {
  if (Platform.is.cordova) {
    navigator.app.loadUrl(url, {
      openExternal: true
    });

    return
  }

  let win = window.open(url, '_blank');

  if (win) {
    win.focus();
  }
  else {
    Dialog.create({
      title: 'Cannot Open Window',
      message: 'Please allow popups first, then please try again.'
    }).show();
  }
};

function getAnchorPosition (el) {
  const
    rect = el.getBoundingClientRect(),
    a = {
      top: rect.top,
      left: rect.left,
      width: el.offsetWidth,
      height: el.offsetHeight
    };

  a.right = rect.right || a.left + a.width;
  a.bottom = rect.bottom || a.top + a.height;
  a.middle = a.left + ((a.right - a.left) / 2);
  a.center = a.top + ((a.bottom - a.top) / 2);

  return a
}

function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getOverlapMode (anchor, target, median) {
  if ([anchor, target].indexOf(median) >= 0) return 'auto'
  if (anchor === target) return 'inclusive'
  return 'exclusive'
}

function getPositions (anchor, target) {
  const
    a = extend({}, anchor),
    t = extend({}, target);

  const positions = {
    x: ['left', 'right'].filter(p => p !== t.horizontal),
    y: ['top', 'bottom'].filter(p => p !== t.vertical)
  };

  const overlap = {
    x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
    y: getOverlapMode(a.vertical, t.vertical, 'center')
  };

  positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
  positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

  if (overlap.y !== 'auto') {
    a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
    if (overlap.y === 'inclusive') {
      t.vertical = t.vertical;
    }
  }

  if (overlap.x !== 'auto') {
    a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
    if (overlap.y === 'inclusive') {
      t.horizontal = t.horizontal;
    }
  }

  return {
    positions: positions,
    anchorPos: a
  }
}

function applyAutoPositionIfNeeded (anchor, target, selfOrigin, anchorOrigin, targetPosition) {
  const {positions, anchorPos} = getPositions(anchorOrigin, selfOrigin);

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
    let newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
    if (newTop + target.bottom <= window.innerHeight) {
      targetPosition.top = Math.max(0, newTop);
    }
    else {
      newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
      if (newTop + target.bottom <= window.innerHeight) {
        targetPosition.top = Math.max(0, newTop);
      }
    }
  }
  if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
    let newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
    if (newLeft + target.right <= window.innerWidth) {
      targetPosition.left = Math.max(0, newLeft);
    }
    else {
      newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
      if (newLeft + target.right <= window.innerWidth) {
        targetPosition.left = Math.max(0, newLeft);
      }
    }
  }
  return targetPosition
}

function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

function getTransformProperties ({selfOrigin}) {
  let
    vert = selfOrigin.vertical,
    horiz = parseHorizTransformOrigin(selfOrigin.horizontal);

  return {
    'transform-origin': vert + ' ' + horiz + ' 0px'
  }
}

function setPosition ({el, anchorEl, anchorOrigin, selfOrigin, maxHeight, event, anchorClick, touchPosition}) {
  let anchor;

  if (event && (!anchorClick || touchPosition)) {
    const {top, left} = position$1(event);
    anchor = {top, left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1};
  }
  else {
    anchor = getAnchorPosition(anchorEl);
  }

  let target = getTargetPosition(el);
  let targetPosition = {
    top: anchor[anchorOrigin.vertical] - target[selfOrigin.vertical],
    left: anchor[anchorOrigin.horizontal] - target[selfOrigin.horizontal]
  };

  targetPosition = applyAutoPositionIfNeeded(anchor, target, selfOrigin, anchorOrigin, targetPosition);

  el.style.top = Math.max(0, targetPosition.top) + 'px';
  el.style.left = Math.max(0, targetPosition.left) + 'px';
  el.style.maxHeight = this.maxHeight || window.innerHeight * 0.9 + 'px';
}

function positionValidator (pos) {
  let parts = pos.split(' ');
  if (parts.length !== 2) {
    return false
  }
  if (!['top', 'center', 'bottom'].includes(parts[0])) {
    return false
  }
  if (!['left', 'middle', 'right'].includes(parts[1])) {
    return false
  }
  return true
}

function parsePosition (pos) {
  let parts = pos.split(' ');
  return {vertical: parts[0], horizontal: parts[1]}
}


var popup = Object.freeze({
	getAnchorPosition: getAnchorPosition,
	getTargetPosition: getTargetPosition,
	getOverlapMode: getOverlapMode,
	getPositions: getPositions,
	applyAutoPositionIfNeeded: applyAutoPositionIfNeeded,
	parseHorizTransformOrigin: parseHorizTransformOrigin,
	getTransformProperties: getTransformProperties,
	setPosition: setPosition,
	positionValidator: positionValidator,
	parsePosition: parsePosition
});

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

var uid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
};

let data = {};

function add$1 (name, el, ctx) {
  let id = uid();
  el.dataset['__' + name] = id;
  if (!data[name]) {
    data[name] = {};
  }
  else if (data[name][id]) {
    console.warn('Element store [add]: overwriting data');
  }
  data[name][id] = ctx;
}

function get (name, el) {
  let id = el.dataset['__' + name];
  if (!id) {
    console.warn('Element store [get]: id not registered', name, el);
    return
  }
  if (!data[name]) {
    console.warn('Element store [get]: name not registered', name, el);
    return
  }
  let ctx = data[name][id];
  if (!ctx) {
    console.warn('Element store [get]: data not found for', name, ':', id, '->', el);
    return
  }
  return ctx
}

function remove$1 (name, el) {
  let id = el.dataset['__' + name];
  if (!id) {
    console.warn('Element store [remove]: id not registered', name, el);
    return
  }
  if (data[name] && data[name][id]) {
    delete data[name][id];
  }
}


var store = Object.freeze({
	add: add$1,
	get: get,
	remove: remove$1
});

var throttle = function (fn, limit = 250) {
  let wait = false;

  return function (...args) {
    if (wait) {
      return
    }

    wait = true;
    fn.apply(this, args);
    setTimeout(() => {
      wait = false;
    }, limit);
  }
};

var Utils = {
  colors,
  debounce,
  dom,
  event,
  extend,
  getVueRef,
  openURL,
  popup,
  store,
  throttle,
  uid
};

let transitionDuration = 300;
let displayDuration = 2500; // in ms

function parseOptions (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  let options = Utils.extend(
    true,
    {},
    defaults,
    typeof opts === 'string' ? {html: opts} : opts
  );

  if (!options.html) {
    throw new Error('Missing toast content/HTML.')
  }

  return options
}

var Toast = {render: function(){with(this){return _h('div',{staticClass:"q-toast-container",class:{active}},[(stack[0])?_h('div',{staticClass:"q-toast row no-wrap items-center non-selectable",class:classes,style:({color: stack[0].color, background: stack[0].bgColor})},[(stack[0].icon)?_h('i',[_s(stack[0].icon)]):_e()," ",(stack[0].image)?_h('img',{attrs:{"src":stack[0].image}}):_e(),_h('div',{staticClass:"q-toast-message auto",domProps:{"innerHTML":_s(stack[0].html)}}),(stack[0].button && stack[0].button.label)?_h('a',{style:({color: stack[0].button.color}),on:{"click":function($event){dismiss(stack[0].button.handler);}}},[_s(stack[0].button.label)+" "]):_e(),_h('a',{style:({color: stack[0].button.color}),on:{"click":function($event){dismiss();}}},[_h('i',["close"])])]):_e()])}},staticRenderFns: [],
  data () {
    return {
      active: false,
      inTransition: false,
      stack: [],
      timer: null,
      defaults: {
        color: 'white',
        bgColor: '#323232',
        button: {
          color: 'yellow'
        }
      }
    }
  },
  computed: {
    classes () {
      if (!this.stack.length || !this.stack[0].classes) {
        return {}
      }

      return this.stack[0].classes.split(' ')
    }
  },
  methods: {
    create (options) {
      this.stack.push(parseOptions(options, this.defaults));

      if (this.active || this.inTransition) {
        return
      }

      this.active = true;
      this.inTransition = true;

      this.__show();
    },
    __show () {
      Events.$emit('app:toast', this.stack[0].html);

      this.timer = setTimeout(() => {
        if (this.stack.length > 0) {
          this.dismiss();
        }
        else {
          this.inTransition = false;
        }
      }, transitionDuration + (this.stack[0].timeout || displayDuration));
    },
    dismiss (done) {
      this.active = false;

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      setTimeout(() => {
        if (typeof this.stack[0].onDismiss === 'function') {
          this.stack[0].onDismiss();
        }

        this.stack.shift();
        done && done();

        if (this.stack.length > 0) {
          this.active = true;
          this.__show();
          return
        }

        this.inTransition = false;
      }, transitionDuration + 50);
    },
    setDefaults (opts) {
      Utils.extend(true, this.defaults, opts);
    }
  }
};

let toast;
let types = [
    {
      name: 'positive',
      defaults: {icon: 'check', classes: 'bg-positive'}
    },
    {
      name: 'negative',
      defaults: {icon: 'error', classes: 'bg-negative'}
    },
    {
      name: 'info',
      defaults: {icon: 'info', classes: 'bg-info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning', classes: 'bg-warning'}
    }
  ];

function create (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  if (defaults) {
    opts = Utils.extend(
      true,
      typeof opts === 'string' ? {html: opts} : opts,
      defaults
    );
  }

  toast.create(opts);
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults);
});

function install$2 (_Vue) {
  let node = document.createElement('div');
  document.body.appendChild(node);
  toast = new _Vue(Toast).$mount(node);
}

var toast$1 = {
  create,
  setDefaults (opts) {
    toast.setDefaults(opts);
  },
  install: install$2
};

function set$1 (theme) {
  const currentTheme = current;
  current = theme;

  Utils.dom.ready(() => {
    if (currentTheme) {
      document.body.classList.remove(current);
    }
    document.body.classList.add(theme);
  });
}

var current;

if (typeof __THEME !== 'undefined') {
  set$1(__THEME);
}


var theme = Object.freeze({
	set: set$1,
	get current () { return current; }
});

var slide$1 = {
  enter (el, done) {
    Velocity(el, 'stop');
    Velocity(el, 'slideDown', done);
  },
  enterCancelled (el) {
    Velocity(el, 'stop');
    el.removeAttribute('style');
  },

  leave (el, done) {
    Velocity(el, 'stop');
    Velocity(el, 'slideUp', done);
  },
  leaveCancelled (el) {
    Velocity(el, 'stop');
    el.removeAttribute('style');
  }
};

let transitions = {slide: slide$1};

var Transition = {
  functional: true,
  props: {
    name: {
      type: String,
      default: 'slide',
      validator (value) {
        if (!transitions[value]) {
          console.error('Quasar Transition unknown: ' + value);
          return false
        }
        return true
      }
    },
    appear: Boolean
  },
  render (h, context) {
    if (!transitions[context.props.name]) {
      throw new Error(`Quasar Transition ${context.props.name} is unnowkn.`)
    }
    var data = {
      props: {
        name: 'q-transition',
        mode: 'out-in',
        appear: context.props.appear
      },
      on: transitions[context.props.name]
    };
    return h('transition', data, context.children)
  }
};

var dGoBack = {
  bind (el, { value, modifiers }, vnode) {
    let ctx = { value, position: window.history.length - 1, single: modifiers.single };

    if (Platform.is.cordova) {
      ctx.goBack = () => {
        vnode.context.$router.go(ctx.single ? -1 : ctx.position - window.history.length);
      };
    }
    else {
      ctx.goBack = () => {
        vnode.context.$router.replace(ctx.value);
      };
    }

    Utils.store.add('goback', el, ctx);
    el.addEventListener('click', ctx.goBack);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('goback', el);
      ctx.value = binding.value;
    }
  },
  unbind (el) {
    el.removeEventListener('click', Utils.store.get('goback', el).goBack);
    Utils.store.remove('goback', el);
  }
};

var dLink = {
  bind (el, binding, vnode) {
    let ctx = {
      route: binding.value,
      delay: binding.modifiers.delay,
      active: false,
      go () {
        const fn = () => {
          vnode.context.$router[ctx.route.replace ? 'replace' : 'push'](ctx.route);
        };
        if (ctx.delay) {
          setTimeout(fn, 100);
          return
        }
        fn();
      },
      updateClass () {
        const
          route = vnode.context.$route,
          ctxRoute = typeof ctx.route === 'string' ? {path: ctx.route} : ctx.route,
          prop = ctxRoute.name ? 'name' : 'path';
        let matched = ctx.route.exact ? route[prop] === ctxRoute[prop] : route.matched.some(r => r[prop] === ctxRoute[prop]);

        if (ctx.active !== matched) {
          el.classList[matched ? 'add' : 'remove']('router-link-active');
          ctx.active = matched;
        }
      }
    };

    ctx.destroyWatcher = vnode.context.$watch('$route', ctx.updateClass);
    ctx.updateClass();
    Utils.store.add('link', el, ctx);
    el.addEventListener('click', ctx.go);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('link', el);
      ctx.route = binding.value;
      ctx.updateClass();
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('link', el);
    ctx.destroyWatcher();
    el.removeEventListener('click', ctx.go);
    Utils.store.remove('link', el);
  }
};

function updateBinding (el, binding, ctx) {
  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll-fire requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
    ctx.scroll();
  }
}

var dScrollFire = {
  bind (el, binding) {
    let ctx = {
      scroll: Utils.debounce(() => {
        let containerBottom, elementBottom, fire;

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom;
          fire = elementBottom < Utils.dom.viewport().height;
        }
        else {
          containerBottom = Utils.dom.offset(ctx.scrollTarget).top + Utils.dom.height(ctx.scrollTarget);
          elementBottom = Utils.dom.offset(el).top + Utils.dom.height(el);
          fire = elementBottom < containerBottom;
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
          ctx.handler(el);
        }
      }, 25)
    };

    Utils.store.add('scrollfire', el, ctx);
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scrollfire', el);
    ctx.scrollTarget = Utils.dom.getScrollTarget(el);
    updateBinding(el, binding, ctx);
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding(el, binding, Utils.store.get('scrollfire', el));
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scrollfire', el);
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    Utils.store.remove('scrollfire', el);
  }
};

function updateBinding$1 (el, binding, ctx) {
  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
  }
}

var dScroll = {
  bind (el, binding) {
    let ctx = {
      scroll () {
        ctx.handler(Utils.dom.getScrollPosition(ctx.scrollTarget));
      }
    };
    Utils.store.add('scroll', el, ctx);
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scroll', el);
    ctx.scrollTarget = Utils.dom.getScrollTarget(el);
    updateBinding$1(el, binding, ctx);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding$1(el, binding, Utils.store.get('scrollfire', el));
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scroll', el);
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    Utils.store.remove('scroll', el);
  }
};

let defaultDuration = 800;

function updateBinding$2 (el, binding, ctx) {
  ctx.duration = parseInt(binding.arg, 10) || defaultDuration;
  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value;
  }
}

var dTouchHold = {
  bind (el, binding) {
    let ctx = {
      start (evt) {
        ctx.timer = setTimeout(() => {
          document.removeEventListener('mousemove', ctx.mouseAbort);
          document.removeEventListener('mouseup', ctx.mouseAbort);
          ctx.handler();
        }, ctx.duration);
      },
      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseAbort);
        document.addEventListener('mouseup', ctx.mouseAbort);
        ctx.start(evt);
      },
      abort (evt) {
        if (ctx.timer) {
          clearTimeout(ctx.timer);
          ctx.timer = null;
        }
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort);
        document.removeEventListener('mouseup', ctx.mouseAbort);
        ctx.abort(evt);
      }
    };

    Utils.store.add('touchhold', el, ctx);
    updateBinding$2(el, binding, ctx);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.abort);
    el.addEventListener('touchend', ctx.abort);
    el.addEventListener('mousedown', ctx.mouseStart);
  },
  update (el, binding) {
    updateBinding$2(el, binding, Utils.store.get('touchhold', el));
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchhold', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('touchmove', ctx.abort);
    el.removeEventListener('touchend', ctx.abort);
    el.removeEventListener('mousedown', ctx.mouseStart);
    document.removeEventListener('mousemove', ctx.mouseAbort);
    document.removeEventListener('mouseup', ctx.mouseAbort);
    Utils.store.remove('touchhold', el);
  }
};

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  let dir = {};['horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });

  return dir
}

function updateClasses (el, dir, scroll) {
  el.classList.add('q-touch');

  if (!scroll) {
    if (dir.horizontal && !dir.vertical) {
      el.classList.add('q-touch-y');
      el.classList.remove('q-touch-x');
    }
    else if (!dir.horizontal && dir.vertical) {
      el.classList.add('q-touch-x');
      el.classList.remove('q-touch-y');
    }
  }
}

function processChanges (evt, ctx, isFinal) {
  let
    direction,
    position = Utils.event.position(evt),
    distX = position.left - ctx.event.x,
    distY = position.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY);

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down';
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else {
    direction = distY < 0 ? 'up' : 'down';
  }

  return {
    evt,
    position,
    direction,
    isFirst: ctx.event.isFirst,
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
    },
    delta: {
      x: position.left - ctx.event.lastX,
      y: position.top - ctx.event.lastY
    }
  }
}

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

var dTouchPan = {
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      scroll: binding.modifiers.scroll,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseMove);
        document.addEventListener('mouseup', ctx.mouseEnd);
        ctx.start(evt);
      },
      start (evt) {
        let position = Utils.event.position(evt);
        ctx.event = {
          x: position.left,
          y: position.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical,
          isFirst: true,
          lastX: position.left,
          lastY: position.top
        };
      },
      mouseMove (evt) {
        ctx.event.prevent = true;
        ctx.move(evt);
      },
      move (evt) {
        if (ctx.event.prevent) {
          if (!ctx.scroll) {
            evt.preventDefault();
          }
          let changes = processChanges(evt, ctx, false);
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes);
            ctx.event.lastX = changes.position.left;
            ctx.event.lastY = changes.position.top;
            ctx.event.isFirst = false;
          }
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        let
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
      },
      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove);
        document.removeEventListener('mouseup', ctx.mouseEnd);
        ctx.end(evt);
      },
      end (evt) {
        if (!ctx.event.prevent || ctx.event.isFirst) {
          return
        }

        ctx.handler(processChanges(evt, ctx, true));
      }
    };

    Utils.store.add('touchpan', el, ctx);
    updateClasses(el, ctx.direction, ctx.scroll);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('mousedown', ctx.mouseStart);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      Utils.store.get('touchpan', el).handler = binding.value;
    }
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchpan', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.mouseStart);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    Utils.store.remove('touchpan', el);
  }
};

function getDirection$1 (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  let dir = {};['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });
  if (dir.horizontal) {
    dir.left = dir.right = true;
  }
  if (dir.vertical) {
    dir.up = dir.down = true;
  }
  if (dir.left || dir.right) {
    dir.horizontal = true;
  }
  if (dir.up || dir.down) {
    dir.vertical = true;
  }

  return dir
}

function updateClasses$1 (el, dir) {
  el.classList.add('q-touch');

  if (dir.horizontal && !dir.vertical) {
    el.classList.add('q-touch-y');
    el.classList.remove('q-touch-x');
  }
  else if (!dir.horizontal && dir.vertical) {
    el.classList.add('q-touch-x');
    el.classList.remove('q-touch-y');
  }
}

var dTouchSwipe = {
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      direction: getDirection$1(binding.modifiers),

      start (evt) {
        let position = Utils.event.position(evt);
        ctx.event = {
          x: position.left,
          y: position.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical
        };
        document.addEventListener('mousemove', ctx.move);
        document.addEventListener('mouseup', ctx.end);
      },
      move (evt) {
        let
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (ctx.event.prevent) {
          evt.preventDefault();
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
      },
      end (evt) {
        document.removeEventListener('mousemove', ctx.move);
        document.removeEventListener('mouseup', ctx.end);

        let
          direction,
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (distX !== 0 || distY !== 0) {
          if (Math.abs(distX) >= Math.abs(distY)) {
            direction = distX < 0 ? 'left' : 'right';
          }
          else {
            direction = distY < 0 ? 'up' : 'down';
          }

          if (ctx.direction[direction]) {
            ctx.handler({
              evt,
              direction,
              duration: new Date().getTime() - ctx.event.time,
              distance: {
                x: Math.abs(distX),
                y: Math.abs(distY)
              }
            });
          }
        }
      }
    };

    Utils.store.add('touchswipe', el, ctx);
    updateClasses$1(el, ctx.direction);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('mousedown', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('touchswipe', el);
      ctx.handler = binding.value;
    }
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchswipe', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.start);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    Utils.store.remove('touchswipe', el);
  }
};

var Checkbox = {render: function(){with(this){return _h('label',{staticClass:"q-checkbox",class:{disabled: disable}},[_h('input',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],attrs:{"type":"checkbox","disabled":disable},domProps:{"checked":Array.isArray(model)?_i(model,null)>-1:_q(model,true)},on:{"change":function($event){var $$a=model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_i($$a,$$v);if($$c){$$i<0&&(model=$$a.concat($$v));}else{$$i>-1&&(model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{model=$$c;}}}}),_h('div')])}},staticRenderFns: [],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  }
};

var Chips = {render: function(){with(this){return _h('div',{staticClass:"q-chips group textfield",class:{active, disabled: disable, readonly},on:{"click":focus}},[_l((value),function(label,index){return _h('span',{key:index,staticClass:"chip label bg-light text-grey-9"},[_s(label)+" ",_h('i',{staticClass:"on-right",on:{"click":function($event){remove(index);}}},["close"])])}),_h('div',{staticClass:"q-chips-input chip label text-grey-9"},[_h('input',{directives:[{name:"model",rawName:"v-model",value:(input),expression:"input"}],ref:"input",staticClass:"no-style",attrs:{"type":"text","disabled":disable,"placeholder":placeholder},domProps:{"value":_s(input)},on:{"keyup":function($event){if($event.keyCode!==13)return;add();},"focus":function($event){active = true;},"blur":function($event){active = false;},"input":function($event){if($event.target.composing)return;input=$event.target.value;}}})," ",_h('button',{staticClass:"small",class:{invisible: !input.length},on:{"click":function($event){add();}}},[_h('i',["send"])])])])}},staticRenderFns: [],
  props: {
    value: {
      type: Array,
      required: true
    },
    disable: Boolean,
    readonly: Boolean,
    placeholder: String
  },
  data () {
    return {
      active: false,
      input: ''
    }
  },
  methods: {
    add (value = this.input) {
      if (!this.disable && !this.readonly && value) {
        this.$emit('input', this.value.concat([value]));
        this.input = '';
      }
    },
    remove (index) {
      if (!this.disable && !this.readonly && index >= 0 && index < this.value.length) {
        let value = this.value.slice(0);
        value.splice(index, 1);
        this.$emit('input', value);
      }
    },
    focus () {
      this.$refs.input.focus();
    }
  }
};

var Collapsible = {render: function(){with(this){return _h('div',{staticClass:"q-collapsible"},[_h('div',{staticClass:"item item-link non-selectable item-collapsible",on:{"click":function($event){__toggleItem();}}},[(icon)?_h('i',{staticClass:"item-primary",domProps:{"textContent":_s(icon)}}):_e()," ",(img)?_h('img',{staticClass:"item-primary thumbnail",attrs:{"src":img}}):_e(),(avatar)?_h('img',{staticClass:"item-primary",attrs:{"src":avatar}}):_e(),_h('div',{staticClass:"item-content has-secondary"},[_h('div',[_s(label)])]),_h('i',{staticClass:"item-secondary",class:{'rotate-180': active},on:{"click":function($event){$event.stopPropagation();toggle();}}},["keyboard_arrow_down"])]),_h('q-transition',{attrs:{"name":"slide"}},[_h('div',{directives:[{name:"show",rawName:"v-show",value:(active),expression:"active"}],staticClass:"q-collapsible-sub-item"},[_t("default")])])])}},staticRenderFns: [],
  props: {
    opened: Boolean,
    icon: String,
    img: String,
    avatar: String,
    label: String,
    iconToggle: Boolean
  },
  data () {
    return {
      active: this.opened
    }
  },
  watch: {
    opened (value) {
      this.active = value;
    }
  },
  methods: {
    toggle () {
      this.active = !this.active;
    },
    open () {
      this.active = true;
    },
    close () {
      this.active = false;
    },
    __toggleItem () {
      if (!this.iconToggle) {
        this.toggle();
      }
    }
  }
};

var ContextMenuDesktop = {render: function(){with(this){return _h('q-popover',{ref:"popover",attrs:{"anchor-click":false}},[_t("default")])}},staticRenderFns: [],
  props: {
    disable: Boolean
  },
  methods: {
    close () {
      this.$refs.popover.close();
    },
    __open (event) {
      if (!this.disable) {
        this.$refs.popover.open(event);
      }
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode;
    this.target.addEventListener('contextmenu', this.__open);
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.handler);
  }
};

var ContextMenuMobile = {render: function(){with(this){return _h('q-modal',{ref:"dialog",staticClass:"minimized"},[_t("default")])}},staticRenderFns: [],
  props: {
    disable: Boolean
  },
  methods: {
    open () {
      this.handler();
    },
    close () {
      this.target.classList.remove('non-selectable');
      this.$refs.dialog.close();
    },
    toggle () {
      if (this.$refs.dialog.active) {
        this.close();
      }
      else {
        this.open();
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.target = this.$el.parentNode;

      this.handler = () => {
        if (!this.disable) {
          this.$refs.dialog.open();
        }
      };

      this.touchStartHandler = (event) => {
        this.target.classList.add('non-selectable');
        this.touchTimer = setTimeout(() => {
          event.preventDefault();
          event.stopPropagation();
          this.cleanup();
          setTimeout(() => {
            this.handler();
          }, 10);
        }, 600);
      };
      this.cleanup = () => {
        this.target.classList.remove('non-selectable');
        if (this.touchTimer) {
          clearTimeout(this.touchTimer);
          this.touchTimer = null;
        }
      };
      this.target.addEventListener('touchstart', this.touchStartHandler);
      this.target.addEventListener('touchcancel', this.cleanup);
      this.target.addEventListener('touchmove', this.cleanup);
      this.target.addEventListener('touchend', this.cleanup);
    });
  },
  beforeDestroy () {
    this.target.removeEventListener('touchstart', this.touchStartHandler);
    this.target.removeEventListener('touchcancel', this.cleanup);
    this.target.removeEventListener('touchmove', this.cleanup);
    this.target.removeEventListener('touchend', this.cleanup);
  }
};

let contentCSS = {
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  },
  mat: {
    maxWidth: '95vw',
    maxHeight: '98vh'
  }
};

var Datetime = {render: function(){with(this){return _h('q-picker-textfield',{attrs:{"disable":disable,"readonly":readonly,"label":label,"placeholder":placeholder,"value":actualValue},nativeOn:{"click":function($event){__open();}}},[(desktop)?_h('q-popover',{ref:"popup",attrs:{"disable":disable || readonly},on:{"open":function($event){__setModel();}}},[_h('q-inline-datetime',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],attrs:{"type":type,"min":min,"max":max},domProps:{"value":(model)},on:{"input":function($event){model=$event;}}},[_h('div',{staticClass:"modal-buttons row full-width"},[(!noClear)?_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(clearLabel)},on:{"click":function($event){clear();}}}):_e(),_h('div',{staticClass:"auto"}),_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(cancelLabel)},on:{"click":function($event){close();}}})," ",_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(okLabel)},on:{"click":function($event){close(__update);}}})])])]):_h('q-modal',{ref:"popup",staticClass:"with-backdrop",class:classNames,attrs:{"transition":transition,"position-classes":position,"content-css":css}},[_h('q-inline-datetime',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],staticClass:"no-border full-width",attrs:{"type":type,"min":min,"max":max},domProps:{"value":(model)},on:{"input":function($event){model=$event;}}},[_h('div',{staticClass:"modal-buttons row full-width"},[(!noClear)?_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(clearLabel)},on:{"click":function($event){clear();}}}):_e(),_h('div',{staticClass:"auto"}),_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(cancelLabel)},on:{"click":function($event){close();}}})," ",_h('button',{staticClass:"primary clear",domProps:{"innerHTML":_s(okLabel)},on:{"click":function($event){close(__update);}}})])])])])}},staticRenderFns: [],
  props: {
    type: {
      type: String,
      default: 'date'
    },
    value: {
      type: String,
      required: true
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    format: String,
    noClear: Boolean,
    clearLabel: {
      type: String,
      default: 'Clear'
    },
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    label: String,
    placeholder: String,
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    let data = Platform.is.desktop ? {} : {
      css: contentCSS[current],
      position: current === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: current === 'ios' ? 'q-modal-actions' : 'q-modal',
      classNames: current === 'ios' ? '' : 'minimized'
    };
    data.model = this.value || '';
    data.desktop = Platform.is.desktop;
    return data
  },
  computed: {
    actualValue () {
      let format;

      if (this.format) {
        format = this.format;
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD';
      }
      else if (this.type === 'time') {
        format = 'HH:mm';
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss';
      }

      return this.value ? moment(this.value).format(format) : ''
    }
  },
  methods: {
    open () {
      if (!this.disable && !this.readonly) {
        this.__setModel();
        this.$refs.popup.open();
      }
    },
    close (fn) {
      this.$refs.popup.close(fn);
    },
    clear () {
      this.$refs.popup.close();
      this.$emit('input', '');
    },
    __open () {
      if (!this.desktop) {
        this.open();
      }
    },
    __normalizeValue (value) {
      if (this.min) {
        value = moment.max(moment(this.min).clone(), value);
      }
      if (this.max) {
        value = moment.min(moment(this.max).clone(), value);
      }
      return value
    },
    __setModel () {
      this.model = this.value || this.__normalizeValue(moment()).format(this.format);
    },
    __update () {
      this.$emit('input', this.model);
    }
  }
};

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

var InlineDatetimeMaterial = {render: function(){with(this){return _h('div',{staticClass:"q-datetime inline column gt-md-row",class:{disabled: disable, readonly}},[(!value)?_h('div',{staticClass:"q-datetime-header column justify-center"},[" "]):_h('div',{staticClass:"q-datetime-header column justify-center"},[(typeHasDate)?_h('div',[_h('div',{staticClass:"q-datetime-weekdaystring"},[_s(weekDayString)]),_h('div',{staticClass:"q-datetime-datestring row gt-md-column items-center justify-center"},[_h('span',{staticClass:"q-datetime-link small",class:{active: view === 'month'},on:{"click":function($event){view = 'month';}}},[_s(monthString)+" "]),_h('span',{staticClass:"q-datetime-link",class:{active: view === 'day'},on:{"click":function($event){view = 'day';}}},[_s(dayString)+" "]),_h('span',{staticClass:"q-datetime-link small",class:{active: view === 'year'},on:{"click":function($event){view = 'year';}}},[_s(year)])])]):_e(),(typeHasTime)?_h('div',{staticClass:"q-datetime-time row gt-md-column items-center justify-center"},[_h('div',{staticClass:"q-datetime-clockstring"},[_h('span',{staticClass:"q-datetime-link",class:{active: view === 'hour'},on:{"click":function($event){view = 'hour';}}},[_s(__pad(hour, '  '))+" "]),_h('span',{staticStyle:{"opacity":"0.6"}},[":"])," ",_h('span',{staticClass:"q-datetime-link",class:{active: view === 'minute'},on:{"click":function($event){view = 'minute';}}},[_s(__pad(minute))])]),_h('div',{staticClass:"q-datetime-ampm column justify-around"},[_h('div',{staticClass:"q-datetime-link",class:{active: am},on:{"click":function($event){toggleAmPm();}}},["AM"]),_h('div',{staticClass:"q-datetime-link",class:{active: !am},on:{"click":function($event){toggleAmPm();}}},["PM"])])]):_e()]),_h('div',{staticClass:"q-datetime-content auto column"},[_h('div',{ref:"selector",staticClass:"q-datetime-selector auto row items-center justify-center"},[(view === 'year')?_h('div',{staticClass:"q-datetime-view-year full-width full-height"},[_l((yearInterval),function(n){return _h('button',{staticClass:"primary clear full-width",class:{active: n + yearMin === year},on:{"click":function($event){setYear(n + yearMin);}}},[_s(n + yearMin)])})]):_e(),(view === 'month')?_h('div',{staticClass:"q-datetime-view-month full-width full-height"},[_l((monthInterval),function(index){return _h('button',{staticClass:"primary clear full-width",class:{active: month === index + monthMin},on:{"click":function($event){setMonth(index + monthMin, true);}}},[_s(monthsList[index + monthMin - 1])])})]):_e(),(view === 'day')?_h('div',{staticClass:"q-datetime-view-day q-datetime-animate"},[_h('div',{staticClass:"row items-center content-center"},[_h('button',{staticClass:"primary clear",on:{"click":function($event){setMonth(month - 1, true);}}},[_h('i',["keyboard_arrow_left"])]),_h('div',{staticClass:"auto"},[_s(monthStamp)]),_h('button',{staticClass:"primary clear",on:{"click":function($event){setMonth(month + 1, true);}}},[_h('i',["keyboard_arrow_right"])])]),_h('div',{staticClass:"q-datetime-weekdays row items-center justify-start"},[_l((daysList),function(day){return _h('div',[_s(day)])})]),_h('div',{staticClass:"q-datetime-days row wrap items-center justify-start content-center"},[_l((fillerDays),function(fillerDay){return _h('div',{staticClass:"q-datetime-fillerday"})}),_l((beforeMinDays),function(fillerDay){return (min)?_h('div',{staticClass:"flex items-center content-center justify-center disabled"},[_s(fillerDay)]):_e()}),_l((daysInterval),function(monthDay){return _h('div',{staticClass:"flex items-center content-center justify-center cursor-pointer",class:{active: value && monthDay === day},on:{"click":function($event){setDay(monthDay);}}},[_s(monthDay)])}),_l((aferMaxDays),function(fillerDay){return (max)?_h('div',{staticClass:"flex items-center content-center justify-center disabled"},[_s(fillerDay + maxDay)]):_e()})])]):_e(),(view === 'hour' || view === 'minute')?_h('div',{ref:"clock",staticClass:"column items-center content-center justify-center"},[(view === 'hour')?_h('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":__dragStart,"mousemove":__dragMove,"mouseup":__dragStop,"touchstart":__dragStart,"touchmove":__dragMove,"touchend":__dragStop}},[_h('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_h('div',{staticClass:"q-datetime-clock-center"}),_h('div',{staticClass:"q-datetime-clock-pointer",class:{hidden: !value},style:(clockPointerStyle)},[_h('span')]),_l((12),function(n){return _h('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + n, value && n === hour ? 'active' : '']},[_s(n)])})])]):_e(),(view === 'minute')?_h('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":__dragStart,"mousemove":__dragMove,"mouseup":__dragStop,"touchstart":__dragStart,"touchmove":__dragMove,"touchend":__dragStop}},[_h('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_h('div',{staticClass:"q-datetime-clock-center"}),_h('div',{staticClass:"q-datetime-clock-pointer",style:(clockPointerStyle)},[_h('span')]),_l((12),function(n){return _h('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === minute ? 'active' : '']},[_s((n - 1) * 5)])})])]):_e()]):_e()]),_t("default")])])}},staticRenderFns: [],
  props: {
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'date',
      validator (value) {
        return ['date', 'time', 'datetime'].includes(value)
      }
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    let view;

    switch (this.type) {
      case 'time':
        view = 'hour';
        break
      case 'date':
      default:
        view = 'day';
        break
    }

    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date);
    });
    return {
      view,
      date: moment(this.value || undefined),
      dragging: false,
      centerClockPosition: 0,
      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
      daysList: moment.weekdaysShort(true),
      monthsList: moment.months()
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour';
      }
    },
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined));
    },
    min () {
      this.$nextTick(() => {
        this.__updateModel();
      });
    },
    max () {
      this.$nextTick(() => {
        this.__updateModel();
      });
    },
    view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      let
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - this.yearMin : this.month - this.monthMin;

      this.$nextTick(() => {
        view.scrollTop = rows * Utils.dom.height(view.children[0].children[0]) - Utils.dom.height(view) / 2.5;
      });
    }
  },
  computed: {
    model: {
      get () {
        return this.value || undefined
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    pmin () {
      return this.min ? moment(this.min) : ''
    },
    pmax () {
      return this.max ? moment(this.max) : ''
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.date.year()
    },
    month () {
      return this.date.month() + 1
    },
    day () {
      return this.date.date()
    },
    dayString () {
      return this.date.format('Do')
    },
    monthString () {
      return this.date.format('MMM')
    },
    monthStamp () {
      return this.date.format('MMMM YYYY')
    },
    weekDayString () {
      return this.date.format('dddd')
    },

    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0
    },

    fillerDays () {
      return Math.max(0, this.date.clone().date(1).day() - this.firstDayOfWeek)
    },
    beforeMinDays () {
      if (!this.pmin || this.pmin.month() !== this.date.month() || this.pmin.year() !== this.date.year()) {
        return false
      }
      return this.pmin.date() - 1
    },
    aferMaxDays () {
      if (!this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year()) {
        return false
      }
      return this.date.daysInMonth() - this.maxDay
    },
    maxDay () {
      return this.pmax ? this.pmax.date() : this.date.daysInMonth()
    },
    daysInterval () {
      let days = this.date.daysInMonth();
      let max = !this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year() ? 0 : days - this.pmax.date();
      if (this.beforeMinDays || max) {
        let min = this.beforeMinDays ? this.beforeMinDays + 1 : 1;
        return Array.apply(null, {length: days - min - max + 1}).map((day, index) => {
          return index + min
        })
      }
      return days
    },

    hour () {
      return convertToAmPm(this.date.hour())
    },
    minute () {
      return this.date.minute()
    },
    am () {
      return this.date.hour() <= 11
    },
    clockPointerStyle () {
      let
        divider = this.view === 'minute' ? 60 : 12,
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180;

      return {
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
      }
    },
    editable () {
      return !this.disabled && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (!this.editable) {
        return
      }
      this.date.year(this.__parseTypeValue('year', value));
      this.__updateModel();
    },
    setMonth (value, force) {
      if (!this.editable) {
        return
      }
      this.date.month((force ? value : this.__parseTypeValue('month', value)) - 1);
      this.__updateModel();
    },
    setDay (value) {
      if (!this.editable) {
        return
      }
      this.date.date(this.__parseTypeValue('date', value));
      this.__updateModel();
    },

    /* time */
    toggleAmPm () {
      if (!this.editable) {
        return
      }
      let
        hour = this.date.hour(),
        offset = this.am ? 12 : -12;

      this.date.hour(hour + offset);
      this.__updateModel();
    },
    setHour (value) {
      if (!this.editable) {
        return
      }
      value = this.__parseTypeValue('hour', value) % 12;

      if (!this.am) {
        value += 12;
      }

      this.date.hour(value);
      this.__updateModel();
    },
    setMinute (value) {
      if (!this.editable) {
        return
      }
      this.date.minute(this.__parseTypeValue('minute', value));
      this.__updateModel();
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __dragStart (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      let
        clock = this.$refs.clock,
        clockOffset = Utils.dom.offset(clock);

      this.centerClockPosition = {
        top: clockOffset.top + Utils.dom.height(clock) / 2,
        left: clockOffset.left + Utils.dom.width(clock) / 2
      };

      this.dragging = true;
      this.__updateClock(ev);
    },
    __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__updateClock(ev);
    },
    __dragStop (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
    },
    __updateClock (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerClockPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerClockPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerClockPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI);

      if (position.top < this.centerClockPosition.top) {
        angle = this.centerClockPosition.left < position.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerClockPosition.left < position.left ? angle + 90 : 270 - angle;
      }

      if (this.view === 'hour') {
        this.setHour(Math.round(angle / 30));
      }
      else {
        this.setMinute(Math.round(angle / 6));
      }
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return Math.max(1, Math.min(12, value))
      }
      if (type === 'date') {
        return Math.max(1, Math.min(this.date.daysInMonth(), value))
      }
      if (type === 'year') {
        return Math.max(1950, Math.min(2050, value))
      }
      if (type === 'hour') {
        return Math.max(0, Math.min(23, value))
      }
      if (type === 'minute') {
        return Math.max(0, Math.min(59, value))
      }
    },

    /* common */
    __normalizeValue (value) {
      if (this.pmin) {
        value = moment.max(this.pmin.clone(), value);
      }
      if (this.pmax) {
        value = moment.min(this.pmax.clone(), value);
      }
      return value
    },
    __updateModel () {
      this.model = this.__normalizeValue(this.date).toISOString();
    }
  }
};

var InlineDatetimeIOS = {render: function(){with(this){return _h('div',{staticClass:"q-datetime",class:['type-' + type, disable ? 'disabled' : '', readonly ? 'readonly' : '']},[_t("default"),_h('div',{staticClass:"q-datetime-content non-selectable"},[_h('div',{staticClass:"q-datetime-inner full-height flex justify-center"},[(typeHasDate)?[_h('div',{staticClass:"q-datetime-col q-datetime-col-month",on:{"touchstart":function($event){__dragStart($event, 'month');},"touchmove":function($event){__dragMove($event, 'month');},"touchend":function($event){__dragStop($event, 'month');}}},[_h('div',{ref:"month",staticClass:"q-datetime-col-wrapper",style:(__monthStyle)},[_l((monthInterval),function(index){return _h('div',{staticClass:"q-datetime-item",on:{"click":function($event){setMonth(index + monthMin);}}},[_s(monthsList[index + monthMin - 1])])})])]),_h('div',{staticClass:"q-datetime-col q-datetime-col-day",on:{"touchstart":function($event){__dragStart($event, 'date');},"touchmove":function($event){__dragMove($event, 'date');},"touchend":function($event){__dragStop($event, 'date');}}},[_h('div',{ref:"date",staticClass:"q-datetime-col-wrapper",style:(__dayStyle)},[_l((daysInterval),function(index){return _h('div',{staticClass:"q-datetime-item",on:{"click":function($event){setDay(index + dayMin - 1);}}},[_s(index + dayMin - 1)])})])]),_h('div',{staticClass:"q-datetime-col q-datetime-col-year",on:{"touchstart":function($event){__dragStart($event, 'year');},"touchmove":function($event){__dragMove($event, 'year');},"touchend":function($event){__dragStop($event, 'year');}}},[_h('div',{ref:"year",staticClass:"q-datetime-col-wrapper",style:(__yearStyle)},[_l((yearInterval),function(n){return _h('div',{staticClass:"q-datetime-item",on:{"click":function($event){setYear(n + yearMin);}}},[_s(n + yearMin)])})])])]:_e(),(typeHasTime)?[_h('div',{staticClass:"q-datetime-col q-datetime-col-hour",on:{"touchstart":function($event){__dragStart($event, 'hour');},"touchmove":function($event){__dragMove($event, 'hour');},"touchend":function($event){__dragStop($event, 'hour');}}},[_h('div',{ref:"hour",staticClass:"q-datetime-col-wrapper",style:(__hourStyle)},[_l((hourInterval),function(n){return _h('div',{staticClass:"q-datetime-item",on:{"click":function($event){setHour(n + hourMin - 1);}}},[_s(n + hourMin - 1)])})])]),_m(0),_h('div',{staticClass:"q-datetime-col q-datetime-col-minute",on:{"touchstart":function($event){__dragStart($event, 'minute');},"touchmove":function($event){__dragMove($event, 'minute');},"touchend":function($event){__dragStop($event, 'minute');}}},[_h('div',{ref:"minute",staticClass:"q-datetime-col-wrapper",style:(__minuteStyle)},[_l((minuteInterval),function(n){return _h('div',{staticClass:"q-datetime-item",on:{"click":function($event){setMinute(n + minuteMin - 1);}}},[_s(__pad(n + minuteMin - 1))])})])])]:_e(),_h('div',{staticClass:"q-datetime-highlight row items-center justify-center",class:{'q-datetime-no-selection': !value}},[(!value && typeHasDate)?[_h('div',{staticClass:"q-datetime-col-month"},["-----"]),_h('div',{staticClass:"q-datetime-col-day"},["--"]),_h('div',{staticClass:"q-datetime-col-year"},["----"])]:_e(),(!value && typeHasTime)?[_h('div',{staticClass:"q-datetime-col-hour"},["--"]),_h('div',{staticClass:"q-datetime-col-minute"},["--"])]:_e()])]),_h('div',{staticClass:"q-datetime-mask"})])])}},staticRenderFns: [function(){with(this){return _h('div',{staticClass:"q-datetime-col-divider"},[_h('div',{staticClass:"q-datetime-col-wrapper full-height row items-center justify-center"},[_h('div',[":"])])])}}],
  props: {
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'date',
      validator (value) {
        return ['date', 'time', 'datetime'].includes(value)
      }
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date);
    });
    return {
      date: moment(this.value || undefined),
      monthDragOffset: 0,
      dateDragOffset: 0,
      yearDragOffset: 0,
      hourDragOffset: 0,
      minuteDragOffset: 0,
      monthsList: moment.months(),
      dragging: false
    }
  },
  watch: {
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined));
      this.__updateAllPositions();
    },
    min (value) {
      this.$nextTick(() => {
        this.__updateModel();
        this.__updateAllPositions();
      });
    },
    max (value) {
      this.$nextTick(() => {
        this.__updateModel();
        this.__updateAllPositions();
      });
    }
  },
  computed: {
    model: {
      get () {
        return this.value || undefined
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    pmin () {
      return this.min ? moment(this.min) : false
    },
    pmax () {
      return this.max ? moment(this.max) : false
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.date.year()
    },
    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    month () {
      return this.date.month() + 1
    },
    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.year() === this.date.year() ? this.pmin.month() : 0
    },

    day () {
      return this.date.date()
    },
    dayMin () {
      return this.pmin && this.pmin.isSame(this.date, 'month') ? this.pmin.date() : 1
    },
    dayMax () {
      return this.pmax && this.pmax.isSame(this.date, 'month') ? this.pmax.date() : this.daysInMonth
    },
    daysInterval () {
      return this.dayMax - this.dayMin + 1
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },

    hour () {
      return this.date.hour()
    },
    hourMin () {
      return this.pmin && this.pmin.isSame(this.date, 'day') ? this.pmin.hour() : 0
    },
    hourInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'day') ? this.pmax.hour() : 23) - this.hourMin + 1
    },

    minute () {
      return this.date.minute()
    },
    minuteMin () {
      return this.pmin && this.pmin.isSame(this.date, 'hour') ? this.pmin.minute() : 0
    },
    minuteInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'hour') ? this.pmax.minute() : 59) - this.minuteMin + 1
    },

    __monthStyle () {
      return this.__colStyle(82 - (this.month - 1 + this.monthDragOffset) * 36)
    },
    __dayStyle () {
      return this.__colStyle(82 - (this.day + this.dateDragOffset) * 36)
    },
    __yearStyle () {
      return this.__colStyle(82 - (this.year + this.yearDragOffset) * 36)
    },
    __hourStyle () {
      return this.__colStyle(82 - (this.hour + this.hourDragOffset) * 36)
    },
    __minuteStyle () {
      return this.__colStyle(82 - (this.minute + this.minuteDragOffset) * 36)
    },
    editable () {
      return !this.disabled && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (this.editable) {
        this.date.year(this.__parseTypeValue('year', value));
        this.__updateModel();
      }
    },
    setMonth (value) {
      if (this.editable) {
        this.date.month(this.__parseTypeValue('month', value) - 1);
        this.__updateModel();
      }
    },
    setDay (value) {
      if (this.editable) {
        this.date.date(this.__parseTypeValue('date', value));
        this.__updateModel();
      }
    },

    /* time */
    setHour (value) {
      if (this.editable) {
        this.date.hour(this.__parseTypeValue('hour', value));
        this.__updateModel();
      }
    },
    setMinute (value) {
      if (this.editable) {
        this.date.minute(this.__parseTypeValue('minute', value));
        this.__updateModel();
      }
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return Math.max(1, Math.min(12, value))
      }
      if (type === 'date') {
        return Math.max(1, Math.min(this.daysInMonth, value))
      }
      if (type === 'year') {
        return Math.max(1950, Math.min(2050, value))
      }
      if (type === 'hour') {
        return Math.max(0, Math.min(23, value))
      }
      if (type === 'minute') {
        return Math.max(0, Math.min(59, value))
      }
    },
    __updateAllPositions () {
      this.$nextTick(() => {
        if (this.typeHasDate) {
          this.__updatePositions('month', this.date.month());
          this.__updatePositions('date', this.date.date());
          this.__updatePositions('year', this.date.year());
        }
        if (this.typeHasTime) {
          this.__updatePositions('hour', this.date.hour());
          this.__updatePositions('minute', this.date.minute());
        }
      });
    },
    __updatePositions (type, value) {
      let root = this.$refs[type];
      if (!root) {
        return
      }

      let delta = -value;
      if (type === 'year') {
        delta += this.yearMin + 1;
      }
      else if (type === 'date') {
        delta += this.dayMin;
      }
      else {
        delta += this[type + 'Min'];
      }

      [].slice.call(root.children).forEach(item => {
        Utils.dom.css(item, this.__itemStyle(value * 36, Math.max(-180, Math.min(180, delta * -18))));
        delta++;
      });
    },
    __colStyle (value) {
      return {
        '-webkit-transform': 'translate3d(0,' + value + 'px,0)',
        '-ms-transform': 'translate3d(0,' + value + 'px,0)',
        'transform': 'translate3d(0,' + value + 'px,0)'
      }
    },
    __itemStyle (translation, rotation) {
      return {
        '-webkit-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        '-ms-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        'transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)'
      }
    },

    /* common */
    __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      this.__dragCleanup()
      ;['month', 'date', 'year', 'hour', 'minute'].forEach(type => {
        this[type + 'DragOffset'] = 0;
      });
      ev.stopPropagation();
      ev.preventDefault();

      if (!this.value) {
        this.__updateModel();
      }

      this.dragging = type;
      this.__dragPosition = Utils.event.position(ev).top;
    },
    __dragMove (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this[type + 'DragOffset'] = (this.__dragPosition - Utils.event.position(ev).top) / 36;
      this.__updatePositions(type, this.date[type]() + this[type + 'DragOffset']);
    },
    __dragStop (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;

      let
        offset = Math.round(this[type + 'DragOffset']),
        newValue = this.__parseTypeValue(type, this[type === 'date' ? 'day' : type] + offset),
        actualType = type === 'date' ? 'day' : type;

      if (newValue !== this[actualType]) {
        this['set' + actualType.charAt(0).toUpperCase() + actualType.slice(1)](newValue);
        this[type + 'DragOffset'] = 0;
      }
      else {
        this.__updatePositions(type, this.date[type]());
        this.timeout = setTimeout(() => {
          this[type + 'DragOffset'] = 0;
        }, 150);
      }
    },
    __dragCleanup () {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    },
    __normalizeValue (value) {
      if (this.pmin) {
        value = moment.max(this.pmin.clone(), value);
      }
      if (this.pmax) {
        value = moment.min(this.pmax.clone(), value);
      }
      return value
    },
    __updateModel () {
      this.model = this.__normalizeValue(this.date).toISOString();
    }
  },
  mounted () {
    this.__updateAllPositions();
  },
  beforeDestroy () {
    this.__dragCleanup();
  }
};

const drawerAnimationSpeed = 150;
const backdropOpacity = {
    mat: 0.7,
    ios: 0.2
  };

function getCurrentPosition (node) {
  let transform = Utils.dom.style(node, 'transform');
  return transform && transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0
}

function getBetween (value, min, max) {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

var Drawer = {render: function(){with(this){return _h('div',{staticClass:"drawer",class:{'left-side': !rightSide, 'right-side': rightSide}},[_h('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(__openByTouch),expression:"__openByTouch",modifiers:{"horizontal":true}}],staticClass:"drawer-opener touch-only mobile-only",class:{'fixed-left': !rightSide, 'fixed-right': rightSide}},[" "]),_h('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(__closeByTouch),expression:"__closeByTouch",modifiers:{"horizontal":true}}],ref:"backdrop",staticClass:"drawer-backdrop fullscreen",staticStyle:{"background":"rgba(0, 0, 0, 0.01)"},on:{"click":function($event){setState(false);}}}),_h('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(__closeByTouch),expression:"__closeByTouch",modifiers:{"horizontal":true}}],ref:"content",staticClass:"drawer-content",class:{'left-side': !rightSide, 'right-side': rightSide}},[_t("default")])])}},staticRenderFns: [],
  props: {
    'right-side': Boolean,
    'swipe-only': Boolean
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    __matToggleAnimate (percentage, done) {
      const
        node = this.$refs.content,
        backdrop = this.$refs.backdrop,
        currentPosition = getCurrentPosition(node),
        closePosition = (this.rightSide ? 1 : -1) * this.width,
        animationNeeded = this.opened || (!this.opened && percentage !== 0),
        complete = () => {
          if (!this.opened) {
            backdrop.classList.remove('active');
          }
          else {
            window.addEventListener('resize', this.close);
          }
          if (typeof done === 'function') {
            done();
          }
        };

      Velocity(node, 'stop');
      Velocity(backdrop, 'stop');

      if (this.opened) {
        backdrop.classList.add('active');
        if (!Platform.within.iframe) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '');
          }
          else {
            window.history.state.__quasar_drawer = true;
          }
          let state = window.history.state || {};
          state.__quasar_drawer = true;
          window.history.replaceState(state, '');
          window.history.pushState({}, '');
          window.addEventListener('popstate', this.__popState);
        }
      }
      else {
        window.removeEventListener('resize', this.close);
        if (!Platform.within.iframe) {
          window.removeEventListener('popstate', this.__popState);
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1);
          }
        }
      }

      if (!animationNeeded) {
        complete();
        return
      }

      Velocity(
        node,
        {translateX: this.opened ? [0, currentPosition] : [closePosition, currentPosition]},
        {duration: !this.opened || currentPosition !== 0 ? drawerAnimationSpeed : 0}
      );
      Velocity(
        backdrop,
        {
          'backgroundColor': '#000',
          'backgroundColorAlpha': this.opened ? backdropOpacity.mat : 0.01
        },
        {
          duration: drawerAnimationSpeed,
          complete
        }
      );
    },
    __iosToggleAnimate (percentage, done) {
      const backdrop = this.$refs.backdrop;

      if (this.opened) {
        backdrop.classList.add('active');
        document.body.classList.add('drawer-opened');
        if (!Platform.within.iframe) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '');
          }
          else {
            window.history.state.__quasar_drawer = true;
          }
          window.history.pushState({}, '');
          window.addEventListener('popstate', this.__popState);
        }
      }
      else {
        window.removeEventListener('resize', this.close);
        if (!Platform.within.iframe) {
          window.removeEventListener('popstate', this.__popState);
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1);
          }
        }
      }

      let
        currentPosition = getCurrentPosition(this.layoutContainer),
        openPosition = (this.rightSide ? -1 : 1) * this.width,
        animationNeeded = this.opened || (!this.opened && percentage !== 0),
        complete = () => {
          if (!this.opened) {
            backdrop.classList.remove('active');
            document.body.classList.remove('drawer-opened');
          }
          else {
            window.addEventListener('resize', this.close);
          }
          if (typeof done === 'function') {
            done();
          }
        };

      Velocity(this.layoutContainer, 'stop');
      Velocity(backdrop, 'stop');

      if (!animationNeeded) {
        complete();
        return
      }

      Velocity(this.layoutContainer,
        {translateX: this.opened ? [openPosition, currentPosition] : [0, currentPosition]},
        {duration: !this.opened || currentPosition !== openPosition ? drawerAnimationSpeed : 0}
      );
      Velocity(
        backdrop,
        {
          'backgroundColor': '#000',
          'backgroundColorAlpha': this.opened ? backdropOpacity.ios : 0.01
        },
        {
          duration: drawerAnimationSpeed,
          complete
        }
      );
    },
    __openByTouch (event) {
      const
        content = this.$refs.content,
        backdrop = this.$refs.backdrop;

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      let
        position = event.distance.x,
        target,
        fn,
        percentage;

      if (event.isFinal) {
        this.opened = position > 75;
      }

      if (current === 'ios') {
        position = Math.min(position, this.width);
        percentage = 1.0 - (this.width - Math.abs(position)) / this.width;
        fn = this.__iosToggleAnimate;
        target = this.layoutContainer;
        position = (this.rightSide ? -1 : 1) * position;
      }
      else { // mat
        position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width);
        percentage = (this.width - Math.abs(position)) / this.width;
        fn = this.__matToggleAnimate;
        target = content;
      }

      if (event.isFinal) {
        fn(percentage, null);
        return
      }

      target.style.transform = 'translateX(' + position + 'px)';
      backdrop.classList.add('active');
      backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[current] + ')';
    },
    __closeByTouch (event) {
      const
        content = this.$refs.content,
        backdrop = this.$refs.backdrop;

      let
        target, fn, percentage, position,
        initialPosition;

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      position = this.rightSide ? getBetween((event.direction === 'left' ? -1 : 1) * event.distance.x, 0, this.width) : getBetween((event.direction === 'left' ? -1 : 1) * event.distance.x, -this.width, 0);
      initialPosition = (this.rightSide ? -1 : 1) * this.width;

      if (event.isFinal) {
        this.opened = Math.abs(position) <= 75;
      }

      if (current === 'ios') {
        position = initialPosition + position;
        percentage = (this.rightSide ? -1 : 1) * position / this.width;
        fn = this.__iosToggleAnimate;
        target = this.layoutContainer;
      }
      else { // mat
        percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width;
        fn = this.__matToggleAnimate;
        target = content;
      }

      if (event.isFinal) {
        fn(percentage, null);
        return
      }

      target.style.transform = 'translateX(' + position + 'px)';
      backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[current] + ')';
    },
    setState (state, done) {
      if (
        (!this.swipeOnly && Utils.dom.viewport().width > 600) ||
        (typeof state === 'boolean' && this.opened === state)
      ) {
        if (typeof done === 'function') {
          done();
        }
        return
      }

      this.opened = !this.opened;
      let fn = current === 'ios' ? this.__iosToggleAnimate : this.__matToggleAnimate;

      fn(this.opened ? 0.01 : 1, done);
    },
    __popState () {
      if (!Platform.within.iframe) {
        if (window.history.state && window.history.state.__quasar_drawer) {
          this.setState(false);
        }
      }
    },
    open (done) {
      this.setState(true, done);
    },
    close (done) {
      this.setState(false, done);
    },
    toggle (done) {
      this.setState(!this.opened, done);
    }
  },
  mounted () {
    this.$nextTick(() => {
      const content = this.$refs.content;

      if (current === 'ios') {
        this.layoutContainer = this.$el.closest('.layout') || document.getElementById('q-app');
      }

      this.width = Utils.dom.width(content)

      ;[].slice.call(content.getElementsByClassName('drawer-closer')).forEach(el => {
        el.addEventListener('click', (event) => {
          event.stopPropagation();
          this.setState(false);
        });
      });

      if (this.swipeOnly) {
        this.$el.classList.add('swipe-only');
      }

      this.__eventHandler = handler => {
        this.close(handler);
      };
    });
  },
  beforeDestroy () {
    this.setState(false);
  }
};

var DrawerLink = {render: function(){with(this){return _h('div',{directives:[{name:"link",rawName:"v-link.delay",value:(route),expression:"route",modifiers:{"delay":true}}],staticClass:"item item-link drawer-closer"},[(icon)?_h('i',{staticClass:"item-primary"},[_s(icon)]):_e(),_h('div',{staticClass:"item-content"},[_t("default")])])}},staticRenderFns: [],
  props: ['icon', 'route']
};

var Fab = {render: function(){with(this){return _h('div',{staticClass:"q-fab flex inline justify-center",class:{opened}},[_h('div',{staticClass:"backdrop animate-fade",on:{"click":function($event){toggle(true);}}}),_h('button',{staticClass:"circular raised",class:classNames,on:{"click":function($event){toggle();}}},[_h('i',{staticClass:"q-fab-icon"},[_s(icon)])," ",_h('i',{staticClass:"q-fab-active-icon"},[_s(activeIcon)])]),_h('div',{staticClass:"q-fab-actions flex inline items-center",class:[direction]},[_t("default")])])}},staticRenderFns: [],
  props: {
    classNames: {
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    open () {
      this.opened = true;
    },
    close (fn) {
      this.opened = false;
      if (typeof fn === 'function') {
        fn();
      }
    },
    toggle (fromBackdrop) {
      this.opened = !this.opened;

      if (!fromBackdrop && !this.opened) {
        this.$emit('click');
      }
    }
  }
};

var SmallFab = {render: function(){with(this){return _h('button',{staticClass:"circular small raised",on:{"click":function($event){$parent.close();}}},[_h('i',[_t("default")])])}},staticRenderFns: [],};

var Gallery = {render: function(){with(this){return _h('div',{staticClass:"q-gallery"},[_l((src),function(img,index){return _h('div',{key:index,style:({width: width})},[_h('img',{attrs:{"src":img}})])})])}},staticRenderFns: [],
  props: {
    src: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '150px'
    }
  }
};

var GallerySlider = {render: function(){with(this){return _h('q-slider',{ref:"slider",staticClass:"text-white bg-black q-gallery-slider",attrs:{"arrows":"","fullscreen":""},on:{"slide":__updateCurrentSlide}},[_l((src),function(img,index){return _h('div',{key:index,slot:"slide",staticClass:"no-padding flex items-center justify-center"},[_h('div',{staticClass:"full-width"},[_h('img',{attrs:{"src":img}})])])}),_h('div',{staticClass:"q-gallery-slider-overlay",class:{active: quickView},on:{"click":function($event){toggleQuickView();}}}),_h('i',{slot:"action",on:{"click":function($event){toggleQuickView();}}},["view_carousel"]),_h('div',{staticClass:"q-gallery-slider-quickview",class:{active: quickView}},[_l((src),function(img,index){return _h('div',{key:index},[_h('img',{class:{active: currentSlide === index},attrs:{"src":img},on:{"click":function($event){selectImage(index);}}})])})])])}},staticRenderFns: [],
  props: {
    src: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      quickView: false,
      currentSlide: 0
    }
  },
  methods: {
    toggleQuickView () {
      this.quickView = !this.quickView;
    },
    selectImage (index) {
      this.$refs.slider.goToSlide(index, true);
      this.toggleQuickView();
    },
    __updateCurrentSlide (value) {
      this.currentSlide = value;
    }
  }
};

var InfiniteScroll = {render: function(){with(this){return _h('div',{staticClass:"q-infinite-scroll"},[_h('div',{ref:"content",staticClass:"q-infinite-scroll-content"},[_t("default")]),_h('br'),_h('div',{directives:[{name:"show",rawName:"v-show",value:(fetching),expression:"fetching"}],staticClass:"q-infinite-scroll-message"},[_t("message")])])}},staticRenderFns: [],
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: Boolean,
    offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },
  methods: {
    poll () {
      if (this.fetching || !this.working) {
        return
      }

      let
        containerHeight = Utils.dom.height(this.scrollContainer),
        containerBottom = Utils.dom.offset(this.scrollContainer).top + containerHeight,
        triggerPosition = Utils.dom.offset(this.element).top + Utils.dom.height(this.element) - (this.offset || containerHeight);

      if (triggerPosition < containerBottom) {
        this.loadMore();
      }
    },
    loadMore () {
      if (this.fetching || !this.working) {
        return
      }

      this.index++;
      this.fetching = true;
      this.handler(this.index, stopLoading => {
        this.fetching = false;
        if (stopLoading) {
          this.stop();
          return
        }
        if (this.element.closest('body')) {
          this.poll();
        }
      });
    },
    reset () {
      this.index = 0;
    },
    resume () {
      this.working = true;
      this.scrollContainer.addEventListener('scroll', this.poll);
      this.poll();
    },
    stop () {
      this.working = false;
      this.scrollContainer.removeEventListener('scroll', this.poll);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.poll = Utils.debounce(this.poll, 50);
      this.element = this.$refs.content;

      this.scrollContainer = this.inline ? this.$el : Utils.dom.getScrollTarget(this.$el);
      if (this.working) {
        this.scrollContainer.addEventListener('scroll', this.poll);
      }

      this.poll();
    });
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll);
  }
};

var Knob = {render: function(){with(this){return _h('div',{staticClass:"q-knob non-selectable cursor-pointer",class:{disabled: disable},on:{"mousedown":__dragStart,"mousemove":__dragMove,"mouseup":__dragStop,"touchstart":__dragStart,"touchmove":__dragMove,"touchend":__dragStop}},[_h('div',{style:({width: size, height: size})},[_h('svg',{attrs:{"viewBox":"0 0 100 100"}},[_h('path',{attrs:{"d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":trackColor,"stroke-width":lineWidth,"fill-opacity":"0"}}),_h('path',{style:(svgStyle),attrs:{"stroke-linecap":"round","fill-opacity":"0","d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":color,"stroke-width":lineWidth}})]),_h('div',{staticClass:"q-knob-label row items-center justify-center content-center",style:({color: color}),domProps:{"innerHTML":_s(placeholder || value)}})])])}},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#027be3'
    },
    trackColor: {
      type: String,
      default: '#ececec'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    disable: Boolean,
    placeholder: String
  },
  computed: {
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.value - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    }
  },
  data () {
    return {
      dragging: false
    }
  },
  watch: {
    value (value) {
      if (value < this.min) {
        this.$emit('input', this.min);
      }
      else if (value > this.max) {
        this.$emit('input', this.max);
      }
    }
  },
  methods: {
    __dragStart (ev) {
      if (this.disable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();

      let knobOffset = Utils.dom.offset(this.$el);

      this.centerPosition = {
        top: knobOffset.top + Utils.dom.height(this.$el) / 2,
        left: knobOffset.left + Utils.dom.width(this.$el) / 2
      };

      this.dragging = true;
      this.__onInput(ev);
    },
    __dragMove (ev) {
      if (!this.dragging || this.disable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__onInput(ev);
    },
    __dragStop (ev) {
      if (this.disable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
    },
    __onInput (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI);

      if (position.top < this.centerPosition.top) {
        angle = this.centerPosition.left < position.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerPosition.left < position.left ? angle + 90 : 270 - angle;
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step;

      this.$emit('input', Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0))));
    }
  }
};

var Layout = {render: function(){with(this){return _h('div',{staticClass:"layout"},[_h('div',{staticClass:"layout-header"},[_t("header"),(!ios)?_t("navigation"):_e()]),_h('div',{staticClass:"layout-content"},[_t("default")]),_h('div',{staticClass:"layout-footer"},[(ios)?_t("navigation"):_e(),_t("footer")])])}},staticRenderFns: [],
  data () {
    return {
      ios: current === 'ios'
    }
  }
};

var ToolbarTitle = {render: function(){with(this){return _h('div',{staticClass:"toolbar-content"},[_h('div',{staticClass:"toolbar-title",class:['padding-' + padding]},[_h('div',[_t("default")])])])}},staticRenderFns: [],
  props: {
    padding: {
      type: Number,
      default: 1
    }
  }
};

let handlers = [];

if (Platform.is.desktop) {
  window.addEventListener('keyup', evt => {
    if (handlers.length === 0) {
      return
    }

    if (evt.which === 27 || evt.keyCode === 27) {
      handlers[handlers.length - 1]();
    }
  });
}

var EscapeKey = {
  register (handler) {
    if (Platform.is.desktop) {
      handlers.push(handler);
    }
  },
  pop () {
    if (Platform.is.desktop) {
      handlers.pop();
    }
  }
};

let duration = 200;
let openedModalNumber = 0;

var Modal = {render: function(){with(this){return _h('transition',{attrs:{"name":transition}},[_h('div',{directives:[{name:"show",rawName:"v-show",value:(active),expression:"active"}],staticClass:"modal fullscreen flex",class:positionClasses,on:{"click":function($event){click();}}},[_h('div',{ref:"content",staticClass:"modal-content",style:(contentCss),on:{"click":function($event){$event.stopPropagation();}}},[_t("default")])])])}},staticRenderFns: [],
  props: {
    transition: {
      type: String,
      default: 'q-modal'
    },
    positionClasses: {
      type: String,
      default: 'items-center justify-center'
    },
    contentCss: Object,
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    open (onShow) {
      if (this.active) {
        return
      }

      if (this.minimized && this.maximized) {
        throw new Error('Modal cannot be minimized & maximized simultaneous.')
      }

      document.body.classList.add('with-modal');
      EscapeKey.register(() => {
        if (this.noEscDismiss) {
          return
        }
        this.close(() => {
          this.$emit('escape-key');
        });
      });

      this.__popstate = () => {
        if (
          !Platform.within.iframe &&
          window.history.state &&
          window.history.state.modalId &&
          window.history.state.modalId >= this.__modalId
        ) {
          return
        }
        openedModalNumber--;
        EscapeKey.pop();
        this.active = false;

        if (!Platform.within.iframe) {
          window.removeEventListener('popstate', this.__popstate);
        }

        setTimeout(() => {
          if (!openedModalNumber) {
            document.body.classList.remove('with-modal');
          }
          if (typeof this.__onClose === 'function') {
            this.__onClose();
          }
          this.$emit('close');
        }, duration);
      };

      setTimeout(() => {
        this.$refs.content.scrollTop = 0
        ;[].slice.call(this.$refs.content.getElementsByClassName('modal-scroll')).forEach(el => {
          el.scrollTop = 0;
        });
      }, 10);

      this.active = true;
      this.__modalId = ++openedModalNumber;
      if (!Platform.within.iframe) {
        window.history.pushState({modalId: this.__modalId}, '');
        window.addEventListener('popstate', this.__popstate);
      }

      setTimeout(() => {
        if (typeof onShow === 'function') {
          onShow();
        }
        this.$emit('open');
      }, duration);
    },
    close (onClose) {
      this.__onClose = onClose;

      if (Platform.within.iframe) {
        this.__popstate();
      }
      else {
        window.history.go(-1);
      }
    },
    click (onClick) {
      if (this.noBackdropDismiss) {
        return
      }
      this.close(onClick);
    }
  }
};

var Numeric = {render: function(){with(this){return _h('div',{staticClass:"q-numeric textfield row inline items-center",class:{disabled: disable, readonly}},[_h('i',{on:{"click":function($event){__setByOffset(-1);}}},["remove"])," ",_h('input',{directives:[{name:"model",rawName:"v-model.number",value:(model),expression:"model",modifiers:{"number":true}}],staticClass:"no-style auto q-input-field",style:({width: (''+model).length * .7 + 'em'}),attrs:{"type":"number","disabled":disable,"readonly":readonly},domProps:{"value":_s(model)},on:{"blur":function($event){__updateValue();},"keydown":[function($event){if($event.keyCode!==13)return;__updateValue();},function($event){if($event.keyCode!==38)return;__setByOffset(1);},function($event){if($event.keyCode!==40)return;__setByOffset(-1);},function($event){if($event.keyCode!==27)return;model = value;}],"input":function($event){if($event.target.composing)return;model=_n($event.target.value);}}})," ",_h('i',{directives:[{name:"show",rawName:"v-show",value:(value !== model && model !== ''),expression:"value !== model && model !== ''"}]},["check"])," ",_h('i',{on:{"click":function($event){__setByOffset(1);}}},["add"])])}},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    min: Number,
    max: Number,
    readonly: Boolean,
    disable: Boolean
  },
  watch: {
    value () {
      this.model = this.value;
    }
  },
  data () {
    return {
      model: this.value
    }
  },
  methods: {
    __normalize (value) {
      if (typeof this.min === 'number' && value < this.min) {
        return this.min
      }
      else if (typeof this.max === 'number' && value > this.max) {
        return this.max
      }
      return value
    },
    __updateValue () {
      this.model = this.__normalize(this.model);
      if (!this.disable && !this.readonly && this.value !== this.model) {
        this.$emit('input', this.model);
      }
    },
    __setByOffset (direction) {
      if (this.disable || this.readonly) {
        return
      }

      let newValue = this.model + direction * this.step;
      if (typeof this.min === 'number' && newValue < this.min && this.model === this.min) {
        return
      }
      if (typeof this.max === 'number' && newValue > this.max && this.model === this.max) {
        return
      }
      this.model = newValue;
      this.__updateValue();
    }
  },
  created () {
    this.__updateValue();
  }
};

var Pagination = {render: function(){with(this){return _h('div',{staticClass:"q-pagination",class:{disabled: disable}},[_h('button',{staticClass:"primary clear small",class:{disabled: value === min},on:{"click":function($event){set(min);}}},[_h('i',["first_page"])])," ",_h('button',{staticClass:"primary clear small",class:{disabled: value === min},on:{"click":function($event){setByOffset(-1);}}},[_h('i',["keyboard_arrow_left"])])," ",_h('input',{directives:[{name:"model",rawName:"v-model.number.lazy",value:(newPage),expression:"newPage",modifiers:{"number":true,"lazy":true}}],ref:"input",style:({width: inputPlaceholder.length * 10 + 'px'}),attrs:{"type":"number","placeholder":inputPlaceholder,"disabled":disable},domProps:{"value":_s(newPage)},on:{"change":function($event){newPage=_n($event.target.value);}}})," ",_h('button',{staticClass:"primary clear small",class:{disabled: value === max},on:{"click":function($event){setByOffset(1);}}},[_h('i',["keyboard_arrow_right"])])," ",_h('button',{staticClass:"primary clear small",class:{disabled: value === max},on:{"click":function($event){set(max);}}},[_h('i',["last_page"])])])}},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    disable: Boolean
  },
  data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = value;
      }
    },
    setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset;
      }
    },
    __normalize (value) {
      return Math.min(this.max, Math.max(1, parseInt(value, 10)))
    }
  },
  watch: {
    newPage (value) {
      var parsed = parseInt(value, 10);

      if (parsed) {
        this.model = parsed;
        this.$refs.input.blur();
      }

      this.newPage = '';
    }
  },
  computed: {
    model: {
      get () {
        return this.__normalize(this.value)
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', this.__normalize(value));
        }
        this.$refs.input.blur();
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
};

var Parallax = {render: function(){with(this){return _h('div',{staticClass:"q-parallax column items-center justify-center",style:({height: height + 'px'})},[_h('div',{staticClass:"q-parallax-image"},[_h('img',{ref:"img",class:{ready: imageHasBeenLoaded},staticStyle:{"transform":"translate3D(-50%, 0, 0)"},attrs:{"src":src},on:{"load":function($event){__processImage();}}})]),_h('div',{staticClass:"q-parallax-text"},[(!imageHasBeenLoaded)?_t("loading"):_t("default")])])}},staticRenderFns: [],
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator (value) {
        return value >= 0 && value <= 1
      }
    }
  },
  data () {
    return {
      imageHasBeenLoaded: false
    }
  },
  watch: {
    src () {
      this.imageHasBeenLoaded = false;
    },
    height () {
      this.__updatePosition();
    }
  },
  methods: {
    __processImage () {
      this.imageHasBeenLoaded = true;
      this.__processResize();
    },
    __processResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      this.imageHeight = Utils.dom.height(this.image);
      this.__updatePosition();
    },
    __updatePosition () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let containerTop, containerHeight, containerBottom, top, bottom;

      if (this.scrollTarget === window) {
        containerTop = 0;
        containerHeight = Utils.dom.viewport().height;
        containerBottom = containerHeight;
      }
      else {
        containerTop = Utils.dom.offset(this.scrollTarget).top;
        containerHeight = Utils.dom.height(this.scrollTarget);
        containerBottom = containerTop + containerHeight;
      }
      top = Utils.dom.offset(this.container).top;
      bottom = top + this.height;

      if (bottom > containerTop && top < containerBottom) {
        let percentScrolled = (containerBottom - top) / (this.height + containerHeight);
        let imageOffset = Math.round((this.imageHeight - this.height) * percentScrolled * this.speed);
        requestAnimationFrame(() => {
          this.$refs.img.style.transform = 'translate3D(-50%,' + imageOffset + 'px, 0)';
        });
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.container = this.$el;
      this.image = this.$refs.img;

      this.scrollTarget = Utils.dom.getScrollTarget(this.$el);
      this.resizeHandler = Utils.debounce(this.__processResize, 50);

      window.addEventListener('resize', this.resizeHandler);
      this.scrollTarget.addEventListener('scroll', this.__updatePosition);
      this.__processResize();
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler);
    this.scrollTarget.removeEventListener('scroll', this.__updatePosition);
  }
};

var PickerTextfield = {render: function(){with(this){return _h('div',{staticClass:"q-picker-textfield cursor-pointer textfield caret",class:{disabled: disable, readonly, active, 'with-label': label}},[_h('div',{staticClass:"q-picker-textfield-label ellipsis",domProps:{"innerHTML":_s(label)}}),_h('div',{staticClass:"q-picker-textfield-value ellipsis"},[_s(actualValue)]),_t("default")])}},staticRenderFns: [],
  props: {
    label: String,
    placeholder: String,
    value: String,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    active () {
      return this.value.length > 0
    },
    actualValue () {
      return this.label ? this.value : this.value || this.placeholder
    }
  }
};

var Popover = {render: function(){with(this){return _h('div',{staticClass:"q-popover animate-scale",style:(transformCSS),on:{"click":function($event){$event.stopPropagation();}}},[_t("default")])}},staticRenderFns: [],
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: Utils.popup.positionValidator
    },
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    disable: Boolean
  },
  data () {
    return {
      opened: false,
      progress: false
    }
  },
  computed: {
    transformCSS () {
      return Utils.popup.getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode;
      this.anchorEl.removeChild(this.$el);
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer');
        this.anchorEl.addEventListener('click', this.toggle);
      }
    });
  },
  beforeDestroy () {
    if (this.anchorClick) {
      this.anchorEl.removeEventListener('click', this.toggle);
    }
    this.close();
  },
  methods: {
    toggle (event) {
      if (this.opened) {
        this.close();
      }
      else {
        this.open(event);
      }
    },
    open (event) {
      if (this.disable || this.opened) {
        return
      }
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      this.opened = true;
      document.body.click(); // close other Popovers
      document.body.appendChild(this.$el);
      EscapeKey.register(() => { this.close(); });
      this.scrollTarget = Utils.dom.getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.close);
      document.addEventListener('click', this.close);
      this.$nextTick(() => {
        this.__updatePosition(event);
        this.$emit('open');
      });
    },
    close (fn) {
      if (!this.opened || this.progress) {
        return
      }
      document.removeEventListener('click', this.close);
      this.scrollTarget.removeEventListener('scroll', this.close);
      EscapeKey.pop();
      this.progress = true;

      /*
        Using setTimeout to allow
        v-models to take effect
      */
      setTimeout(() => {
        this.opened = false;
        this.progress = false;
        document.body.removeChild(this.$el);
        this.$emit('close');
        if (typeof fn === 'function') {
          fn();
        }
      }, 1);
    },
    __updatePosition (event) {
      Utils.popup.setPosition({
        event,
        el: this.$el,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight,
        anchorClick: this.anchorClick,
        touchPosition: this.touchPosition
      });
    }
  }
};

var Progress = {render: function(){with(this){return _h('div',{staticClass:"q-progress"},[_h('div',{style:({width: model + '%'})})])}},staticRenderFns: [],
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    model () {
      return Math.max(0, Math.min(100, this.percentage))
    }
  }
};

var ProgressButton = {render: function(){with(this){return _h('button',{staticClass:"q-progress-button",class:{active, indeterminate}},[(!indeterminate)?_h('span',{staticClass:"q-progress-button-filler",class:{'q-progress-button-dark-filler': darkFiller},style:({width: computedPercentage})}):_e(),_h('div',{staticClass:"q-progress-button-content",class:stateClass},[_h('div',{staticClass:"q-progress-button-error"},[_h('i',[_s(errorIcon)])]),_h('div',{staticClass:"q-progress-button-label"},[_t("default")]),_h('div',{staticClass:"q-progress-button-success"},[_h('i',[_s(successIcon)])])])])}},staticRenderFns: [],
  props: {
    percentage: {
      type: Number,
      required: true
    },
    errorIcon: {
      type: String,
      default: 'warning'
    },
    successIcon: {
      type: String,
      default: 'done'
    },
    darkFiller: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      return this.percentage > 0 && this.percentage < 100
    },
    stateClass () {
      if (this.percentage >= 100) {
        return 'q-progress-button-complete'
      }
      if (this.percentage < 0) {
        return 'q-progress-button-incomplete'
      }
      return 'q-progress-button-default'
    },
    computedPercentage () {
      if (this.percentage >= 100) {
        return '0%'
      }

      return Math.max(0, this.percentage) + '%'
    }
  }
};

var PullToRefresh = {render: function(){with(this){return _h('div',{staticClass:"pull-to-refresh"},[_h('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical.scroll",value:(__pull),expression:"__pull",modifiers:{"vertical":true,"scroll":true}}],staticClass:"pull-to-refresh-container",style:({transform: 'translateY(' + pullPosition + 'px)'})},[_h('div',{staticClass:"pull-to-refresh-message row items-center justify-center"},[_h('i',{directives:[{name:"show",rawName:"v-show",value:(state !== 'refreshing'),expression:"state !== 'refreshing'"}],class:{'rotate-180': state === 'pulled'}},["arrow_downward"])," ",_h('i',{directives:[{name:"show",rawName:"v-show",value:(state === 'refreshing'),expression:"state === 'refreshing'"}],staticClass:"animate-spin"},[_s(refreshIcon)]),"    ",_h('span',{domProps:{"innerHTML":_s(message)}})]),_t("default")])])}},staticRenderFns: [],
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: {
      type: String,
      default: 'Pull down to refresh'
    },
    releaseMessage: {
      type: String,
      default: 'Release to refresh'
    },
    refreshMessage: {
      type: String,
      default: 'Refreshing...'
    },
    refreshIcon: {
      type: String,
      default: 'refresh'
    },
    inline: Boolean,
    disable: Boolean
  },
  data () {
    let height = 65;

    return {
      state: 'pull',
      pullPosition: -height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage
        case 'refreshing':
          return this.refreshMessage
        case 'pull':
        default:
          return this.pullMessage
      }
    }
  },
  methods: {
    __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        if (this.scrolling) {
          this.scrolling = false;
          this.pulling = false;
          return
        }
        this.scrolling = false;
        this.pulling = false;

        if (this.state === 'pulled') {
          this.state = 'refreshing';
          this.__animateTo(0);
          this.trigger();
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height);
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      let top = Utils.dom.getScrollPosition(this.scrollContainer);
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true;
        if (this.pulling) {
          this.pulling = false;
          this.state = 'pull';
          this.__animateTo(-this.height);
        }
        return true
      }

      event.evt.preventDefault();
      this.pulling = true;
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85));
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull';
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating);
      }

      this.pullPosition -= (this.pullPosition - target) / 7;

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(() => {
          this.__animateTo(target, done, true);
        });
      }
      else {
        this.animating = requestAnimationFrame(() => {
          this.pullPosition = target;
          this.animating = false;
          done && done();
        });
      }
    },
    trigger () {
      this.handler(() => {
        this.__animateTo(-this.height, () => {
          this.state = 'pull';
        });
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$el.parentNode : Utils.dom.getScrollTarget(this.$el);
    });
  }
};

var Radio = {render: function(){with(this){return _h('label',{staticClass:"q-radio",class:{disabled: disable}},[_h('input',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],attrs:{"type":"radio","disabled":disable},domProps:{"value":val,"checked":_q(model,val)},on:{"change":function($event){model=val;}}}),_h('div')])}},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  }
};

var Range = {render: function(){with(this){return _h('div',{staticClass:"q-range non-selectable",class:{disabled: disable},on:{"mousedown":function($event){$event.preventDefault();__setActive($event);},"touchstart":function($event){$event.preventDefault();__setActive($event);},"touchend":function($event){$event.preventDefault();__end($event);},"touchmove":function($event){$event.preventDefault();__update($event);}}},[_h('div',{ref:"handle",staticClass:"q-range-handle-container"},[_h('div',{staticClass:"q-range-track"}),_l((((max - min) / step + 1)),function(n){return (markers)?_h('div',{staticClass:"q-range-mark",style:({left: (n - 1) * 100 * step / (max - min) + '%'})}):_e()}),_h('div',{staticClass:"q-range-track active-track",class:{'no-transition': dragging, 'handle-at-minimum': value === min},style:({width: percentage})}),_h('div',{staticClass:"q-range-handle",class:{dragging, 'handle-at-minimum': value === min},style:({left: percentage})},[(label || labelAlways)?_h('div',{staticClass:"q-range-label",class:{'label-always': labelAlways}},[_s(value)]):_e()])])])}},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean
  },
  data () {
    return {
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.value - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    }
  },
  watch: {
    value (value) {
      if (this.dragging) {
        return
      }
      this.currentPercentage = (value - this.min) / (this.max - this.min);
    },
    min (value) {
      if (this.value < value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    max (value) {
      if (this.value > value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive (event) {
      if (this.disable) {
        return
      }

      let container = this.$refs.handle;

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      };
      this.__update(event);
    },
    __update (event) {
      if (!this.dragging) {
        return
      }

      let
        percentage = Math.min(1, Math.max(0, (Utils.event.position(event).left - this.dragging.left) / this.dragging.width)),
        model = this.min + percentage * (this.max - this.min),
        modulo = (model - this.min) % this.step;

      this.currentPercentage = percentage;
      this.$emit('input', Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0))));
    },
    __end () {
      this.dragging = false;
      this.currentPercentage = (this.value - this.min) / (this.max - this.min);
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step);
      }
    }
  },
  created () {
    this.__validateProps();
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update);
      document.body.addEventListener('mouseup', this.__end);
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update);
      document.body.removeEventListener('mouseup', this.__end);
    }
  }
};

var DoubleRange = {render: function(){with(this){return _h('div',{staticClass:"q-range non-selectable",class:{disabled: disable},on:{"mousedown":function($event){$event.preventDefault();__setActive($event);},"touchstart":function($event){$event.preventDefault();__setActive($event);},"touchend":function($event){$event.preventDefault();__end($event);},"touchmove":function($event){$event.preventDefault();__update($event);}}},[_h('div',{ref:"handle",staticClass:"q-range-handle-container"},[_h('div',{staticClass:"q-range-track"}),_l((((max - min) / step + 1)),function(n){return (markers)?_h('div',{staticClass:"q-range-mark",style:({left: (n - 1) * 100 * step / (max - min) + '%'})}):_e()}),_h('div',{staticClass:"q-range-track active-track",class:{dragging, 'track-draggable': dragRange},style:({left: percentageMin * 100 + '%', width: activeTrackWidth})}),_h('div',{staticClass:"q-range-handle range-handle-min",class:{dragging, 'handle-at-minimum': value.min === min, undraggable: disableMin},style:({left: percentageMin * 100 + '%'})},[(label || labelAlways)?_h('div',{staticClass:"q-range-label",class:{'label-always': labelAlways}},[_s(value.min)]):_e()]),_h('div',{staticClass:"q-range-handle range-handle-max",class:{dragging, 'handle-at-maximum': value.max === max, undraggable: disableMax},style:({left: percentageMax * 100 + '%'})},[(label || labelAlways)?_h('div',{staticClass:"q-range-label",class:{'label-always': labelAlways}},[_s(value.max)]):_e()])])])}},staticRenderFns: [],
  props: {
    value: {
      type: Object,
      required: true,
      validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean,
    disableMin: Boolean,
    disableMax: Boolean,
    dragRange: Boolean
  },
  data () {
    return {
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min),
      sensitivity: 0.02
    }
  },
  computed: {
    percentageMin () {
      return (!this.snap || this.disableMin) ? this.currentMinPercentage : (this.value.min - this.min) / (this.max - this.min)
    },
    percentageMax () {
      return (!this.snap || this.disableMax) ? this.currentMaxPercentage : (this.value.max - this.min) / (this.max - this.min)
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    }
  },
  watch: {
    'value.min' (value) {
      if (this.dragging) {
        return
      }
      if (value > this.value.max) {
        value = this.value.max;
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min);
    },
    'value.max' (value) {
      if (this.dragging) {
        return
      }
      if (value < this.value.min) {
        value = this.value.min;
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min);
    },
    min (value) {
      if (this.value.min < value) {
        this.____update({min: value});
      }
      if (this.value.max < value) {
        this.____update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    max (value) {
      if (this.value.min > value) {
        this.____update({min: value});
      }
      if (this.value.max > value) {
        this.____update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive (event) {
      if (this.disable) {
        return
      }
      let container = this.$refs.handle;
      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth,
        valueMin: this.value.min,
        percentageMin: this.currentMinPercentage,
        percentageMinLimit: this.disableMin ? -1 : 0,
        minPercentageOffset: 0,
        valueMax: this.value.max,
        percentageMax: this.currentMaxPercentage,
        maxPercentageOffset: 0,
        percentageMaxLimit: this.disableMax ? 2 : 1
      };
      let
        offset = Utils.event.position(event).left - this.dragging.left,
        percentage = Math.min(1, Math.max(0, offset / this.dragging.width));

      if (percentage < this.currentMinPercentage + this.sensitivity) {
        if (this.disableMin) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = -1; // Drag min
      }
      else if (percentage > this.currentMaxPercentage - this.sensitivity) {
        if (this.disableMax) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = 1;  // Drag max
      }
      else {
        if (!this.dragRange) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = 0;  // Drag range
        this.dragging.valueRange = this.dragging.valueMax - this.dragging.valueMin;
        this.dragging.minPercentageOffset = this.currentMinPercentage - percentage;
        this.dragging.maxPercentageOffset = this.currentMaxPercentage - percentage;
      }
      this.__update(event);
    },
    __update (event) {
      if (!this.dragging) {
        return
      }

      let percentage = (Utils.event.position(event).left - this.dragging.left) / this.dragging.width;
      percentage = (percentage + this.dragging.minPercentageOffset < this.dragging.percentageMinLimit) ? this.dragging.percentageMinLimit - this.dragging.minPercentageOffset : (percentage + this.dragging.maxPercentageOffset > this.dragging.percentageMaxLimit) ? this.dragging.percentageMaxLimit - this.dragging.maxPercentageOffset : percentage;
      let
        model = this.min + (percentage + this.dragging.minPercentageOffset) * (this.max - this.min),
        modulo = (model - this.min) % this.step;
      model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)));

      if (!this.disableMin && this.dragging.byPosition === -1) {
        if (percentage <= this.dragging.percentageMax) {
          this.currentMinPercentage = percentage;
          this.currentMaxPercentage = this.dragging.percentageMax;
          this.__updateInput({
            min: model,
            max: this.dragging.valueMax
          });
        }
        else {
          this.currentMinPercentage = this.dragging.percentageMax;
          this.currentMaxPercentage = this.disableMax ? this.dragging.percentageMax : percentage;
          this.__updateInput({
            min: this.dragging.valueMax,
            max: this.disableMax ? this.dragging.valueMax : model
          });
        }
      }
      else if (!this.disableMax && this.dragging.byPosition === 1) {
        if (percentage >= this.dragging.percentageMin) {
          this.currentMinPercentage = this.dragging.percentageMin;
          this.currentMaxPercentage = percentage;
          this.__updateInput({
            min: this.dragging.valueMin,
            max: model
          });
        }
        else {
          this.currentMinPercentage = this.disableMin ? this.dragging.percentageMin : percentage;
          this.currentMaxPercentage = this.dragging.percentageMin;
          this.__updateInput({
            min: this.disableMin ? this.dragging.valueMin : model,
            max: this.dragging.valueMin
          });
        }
      }
      else if (this.dragging.byPosition === 0) {
        this.currentMinPercentage =
          this.disableMin ? this.currentMinPercentage : this.disableMax && percentage + this.dragging.minPercentageOffset > this.currentMaxPercentage ? this.currentMaxPercentage : percentage + this.dragging.minPercentageOffset;
        this.currentMaxPercentage = this.disableMax ? this.currentMaxPercentage : this.disableMin && percentage + this.dragging.maxPercentageOffset < this.currentMinPercentage ? this.currentMinPercentage : percentage + this.dragging.maxPercentageOffset;
        this.__updateInput({
          min: this.disableMin ? this.dragging.valueMin : model,
          max: this.disableMax ? this.dragging.valueMax : model + this.dragging.valueRange
        });
      }
    },
    __updateInput ({min = this.value.min, max = this.value.max}) {
      this.$emit('input', {min, max});
    },
    __cancelDrag () {
      this.dragging = false;
    },
    __end () {
      this.__cancelDrag();
      this.currentMinPercentage = (this.value.min - this.min) / (this.max - this.min);
      this.currentMaxPercentage = (this.value.max - this.min) / (this.max - this.min);
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step);
      }
      else if ((this.value.min - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.$el, this.value.min, this.min, this.step);
      }
      else if ((this.value.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.$el, this.value.max, this.max, this.step);
      }
    }
  },
  created () {
    this.__validateProps();
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update);
      document.body.addEventListener('mouseup', this.__end);
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update);
      document.body.removeEventListener('mouseup', this.__end);
    }
  }
};

var Rating = {render: function(){with(this){return _h('div',{staticClass:"q-rating",class:{disabled: disable}},[_l((max),function(index){return _h('i',{class:{active: (!mouseModel && model >= index) || (mouseModel && mouseModel >= index)},on:{"click":function($event){set(index);},"mouseover":function($event){__setHoverValue(index);},"mouseout":function($event){mouseModel = 0;}}},[_s(icon)])})])}},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'grade'
    },
    disable: Boolean
  },
  data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', value);
        }
      }
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = Math.min(this.max, Math.max(1, parseInt(value, 10)));
      }
    },
    __setHoverValue (value) {
      if (!this.disable) {
        this.mouseModel = value;
      }
    }
  }
};

var Search = {render: function(){with(this){return _h('div',{staticClass:"q-search",class:{'q-search-centered': centered, disabled: disable, readonly}},[_h('div',{staticClass:"q-search-input-container"},[_h('button',{staticClass:"q-search-icon"},[_h('i',[_s(icon)])," ",_h('span',{directives:[{name:"show",rawName:"v-show",value:($quasar.theme === 'ios' && this.value === '' && !hasText),expression:"$quasar.theme === 'ios' && this.value === '' && !hasText"}]},[_s(placeholder)])])," ",_h('input',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],staticClass:"q-search-input no-style",attrs:{"type":"text","placeholder":$quasar.theme === 'mat' ? placeholder : '',"disabled":disable,"readonly":readonly},domProps:{"value":_s(model)},on:{"focus":function($event){focus();},"blur":function($event){blur();},"input":function($event){if($event.target.composing)return;model=$event.target.value;}}})," ",_h('button',{staticClass:"q-search-clear",class:{hidden: this.model === ''},on:{"click":function($event){clear();}}},[_h('i',{staticClass:"mat-only"},["clear"])," ",_h('i',{staticClass:"ios-only"},["cancel"])])])])}},staticRenderFns: [],
  props: {
    value: {
      type: String,
      default: ''
    },
    debounce: {
      type: Number,
      default: 300
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      focused: false,
      hasText: this.value.length > 0
    }
  },
  watch: {
    debounce (value) {
      this.__createDebouncedTrigger(value);
    }
  },
  computed: {
    model: {
      get () {
        this.hasText = this.value.length > 0;
        return this.value
      },
      set (value) {
        this.hasText = value.length > 0;
        this.__update(value);
      }
    },
    centered () {
      return !this.focused && this.value === ''
    }
  },
  methods: {
    clear () {
      if (!this.disable && !this.readonly) {
        this.$emit('input', '');
      }
    },
    __createDebouncedTrigger (debounce) {
      this.__update = Utils.debounce(value => {
        if (this.value !== value) {
          this.$emit('input', value);
        }
      }, debounce);
    },
    focus () {
      if (!this.disable && !this.readonly) {
        this.focused = true;
      }
    },
    blur () {
      this.focused = false;
    }
  },
  created () {
    this.__createDebouncedTrigger(this.debounce);
  }
};

var Select = {render: function(){with(this){return _h('q-picker-textfield',{attrs:{"disable":disable,"readonly":readonly,"label":label,"placeholder":placeholder,"value":actualValue}},[_h('q-popover',{ref:"popover",attrs:{"disable":disable || readonly}},[_h('div',{staticClass:"q-select-popover list highlight"},[_l((options),function(radio){return (type === 'radio')?_h('label',{staticClass:"item",on:{"click":close}},[_h('div',{staticClass:"item-primary"},[_h('q-radio',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],attrs:{"val":radio.value},domProps:{"value":(model)},on:{"input":function($event){model=$event;}}})]),_h('div',{staticClass:"item-content",domProps:{"innerHTML":_s(radio.label)}})]):_e()}),_l((options),function(checkbox,index){return (type === 'checkbox')?_h('label',{staticClass:"item"},[_h('div',{staticClass:"item-primary"},[_h('q-checkbox',{attrs:{"value":optModel[index]},on:{"input":function($event){toggleValue(checkbox.value);}}})]),_h('div',{staticClass:"item-content",domProps:{"innerHTML":_s(checkbox.label)}})]):_e()}),_l((options),function(toggle,index){return (type === 'toggle')?_h('label',{staticClass:"item"},[_h('div',{staticClass:"item-content has-secondary",domProps:{"innerHTML":_s(toggle.label)}}),_h('div',{staticClass:"item-secondary"},[_h('q-toggle',{attrs:{"value":optModel[index]},on:{"input":function($event){toggleValue(toggle.value);}}})])]):_e()})])])])}},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(option =>
          typeof option.label === 'undefined' || typeof option.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['radio', 'checkbox', 'toggle'].includes(value)
      }
    },
    label: String,
    placeholder: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    optModel () {
      /* Used by multiple selection only */
      return this.options.map(opt => this.model.includes(opt.value))
    },
    actualValue () {
      if (this.type === 'radio') {
        let option = this.options.find(option => option.value === this.model);
        return option ? option.label : ''
      }

      let options = this.options
        .filter(option => this.model.includes(option.value))
        .map(option => option.label);

      return !options.length ? '' : options.join(', ')
    }
  },
  methods: {
    open (event) {
      if (!this.disable && !this.readonly) {
        this.$refs.popover.open(event);
      }
    },
    close () {
      this.$refs.popover.close();
    },
    toggleValue (value) {
      let index = this.model.indexOf(value);
      if (index >= 0) {
        this.model.splice(index, 1);
      }
      else {
        this.model.push(value);
      }
    }
  }
};

var DialogSelect = {render: function(){with(this){return _h('q-picker-textfield',{attrs:{"disable":disable,"readonly":readonly,"label":label,"placeholder":placeholder,"value":actualValue},nativeOn:{"click":function($event){pick();}}})}},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(option =>
          typeof option.label === 'undefined' || typeof option.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['radio', 'checkbox', 'toggle'].includes(value)
      }
    },
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: String,
    label: String,
    placeholder: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    actualValue () {
      if (this.type === 'radio') {
        let option = this.options.find(option => option.value === this.value);
        return option ? option.label : ''
      }

      let options = this.options
        .filter(option => this.value.includes(option.value))
        .map(option => option.label);

      return !options.length ? '' : options.join(', ')
    }
  },
  methods: {
    pick () {
      if (this.disable || this.readonly) {
        return
      }

      let
        self = this,
        options = this.options.map(option => {
          return {
            value: option.value,
            label: option.label,
            model: this.value.includes(option.value)
          }
        });

      Dialog.create({
        title: self.title,
        message: self.message,
        form: {
          select: {type: self.type, model: self.value, items: options}
        },
        buttons: [
          self.cancelLabel,
          {
            label: self.okLabel,
            handler (data) {
              self.$emit('input', data.select);
            }
          }
        ]
      });
    }
  }
};

var Slider = {render: function(){with(this){return _h('div',{staticClass:"q-slider",class:{fullscreen: inFullscreen}},[_h('div',{staticClass:"q-slider-inner"},[_h('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(__pan),expression:"__pan",modifiers:{"horizontal":true}}],ref:"track",staticClass:"q-slider-track",class:{'with-arrows': arrows, 'with-toolbar': toolbar}},[_t("slide")]),(arrows)?_h('div',{staticClass:"q-slider-left-button row items-center justify-center",class:{hidden: slide === 0}},[_h('i',{on:{"click":function($event){goToSlide(slide - 1);}}},["keyboard_arrow_left"])]):_e(),(arrows)?_h('div',{staticClass:"q-slider-right-button row items-center justify-center",class:{hidden: slide === slidesNumber - 1},on:{"click":function($event){goToSlide(slide + 1);}}},[_h('i',["keyboard_arrow_right"])]):_e(),(toolbar)?_h('div',{staticClass:"q-slider-toolbar row items-center justify-end"},[_h('div',{staticClass:"q-slider-dots auto row items-center justify-center"},[_l((slidesNumber),function(n){return (dots)?_h('i',{domProps:{"textContent":_s((n - 1) !== slide ? 'panorama_fish_eye' : 'lens')},on:{"click":function($event){goToSlide(n - 1);}}}):_e()})]),_h('div',{staticClass:"row items-center"},[_t("action"),(fullscreen)?_h('i',{on:{"click":function($event){toggleFullscreen();}}},[_h('span',{directives:[{name:"show",rawName:"v-show",value:(!inFullscreen),expression:"!inFullscreen"}]},["fullscreen"])," ",_h('span',{directives:[{name:"show",rawName:"v-show",value:(inFullscreen),expression:"inFullscreen"}]},["fullscreen_exit"])]):_e()])]):_e(),_t("default")])])}},staticRenderFns: [],
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    actions: Boolean
  },
  data () {
    return {
      position: 0,
      slide: 0,
      slidesNumber: 0,
      inFullscreen: false
    }
  },
  watch: {
    slide (value) {
      this.$emit('slide', value);
    }
  },
  computed: {
    toolbar () {
      return this.dots || this.fullscreen || this.actions
    }
  },
  methods: {
    __pan (event) {
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position;
        Velocity(this.$refs.track, 'stop');
      }

      let delta = (event.direction === 'left' ? -1 : 1) * event.distance.x;

      if (
        this.slide === 0 && delta > 0 ||
        this.slide === this.slidesNumber - 1 && delta < 0
      ) {
        delta = delta / 10;
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100;
      this.$refs.track.style.transform = 'translateX(' + this.position + '%)';

      if (event.isFinal) {
        if (event.distance.x < 100) {
          this.goToSlide(this.slide);
        }
        else {
          this.goToSlide(event.direction === 'left' ? this.slide + 1 : this.slide - 1);
        }
        delete this.initialPosition;
      }
    },
    goToSlide (slide, noAnimation) {
      this.slide = Math.min(this.slidesNumber - 1, Math.max(0, slide));

      Velocity(this.$refs.track, 'stop');
      Velocity(this.$refs.track, {
        translateX: [-this.slide * 100 + '%', this.position + '%']
      }, noAnimation ? {duration: 0} : undefined);

      this.position = -this.slide * 100;
    },
    toggleFullscreen () {
      if (this.inFullscreen) {
        if (Platform.within.iframe) {
          this.inFullscreen = false;
        }
        else {
          window.history.go(-1);
        }
        return
      }

      this.inFullscreen = true;
      if (!Platform.within.iframe) {
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.__popState);
      }
    },
    __popState () {
      if (this.inFullscreen) {
        this.inFullscreen = false;
      }
      window.removeEventListener('popstate', this.__popState);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.slidesNumber = this.$refs.track.children.length;
    });
  }
};

var SAudio = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 55 80","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"transform":"matrix(1 0 0 -1 0 80)"}},[_h('rect',{attrs:{"width":"10","height":"20","rx":"3"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"4.3s","values":"20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"15","width":"10","height":"80","rx":"3"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"80;55;33;5;75;23;73;33;12;14;60;80","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"30","width":"10","height":"50","rx":"3"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1.4s","values":"50;34;78;23;56;23;34;76;80;54;21;50","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"45","width":"10","height":"30","rx":"3"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"30;45;13;80;56;72;45;76;34;23;67;30","calcMode":"linear","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SBall = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"stroke":color,"width":size,"height":size,"viewBox":"0 0 57 57","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_h('circle',{attrs:{"cx":"5","cy":"50","r":"5"}},[_h('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;5;50;50","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","values":"5;27;49;5","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"27","cy":"5","r":"5"}},[_h('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","from":"5","to":"5","values":"5;50;50;5","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","from":"27","to":"27","values":"27;49;5;27","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"49","cy":"50","r":"5"}},[_h('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;50;5;50","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"cx","from":"49","to":"49","begin":"0s","dur":"2.2s","values":"49;5;27;49","calcMode":"linear","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SBars = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 135 140","xmlns":"http://www.w3.org/2000/svg"}},[_h('rect',{attrs:{"y":"10","width":"15","height":"120","rx":"6"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"30","y":"10","width":"15","height":"120","rx":"6"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"60","width":"15","height":"140","rx":"6"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"y","begin":"0s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"90","y":"10","width":"15","height":"120","rx":"6"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"120","y":"10","width":"15","height":"120","rx":"6"}},[_h('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SCircles = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 135 135","xmlns":"http://www.w3.org/2000/svg"}},[_h('path',{attrs:{"d":"M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"-360 67 67","dur":"2.5s","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"360 67 67","dur":"8s","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SDots = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 120 30","xmlns":"http://www.w3.org/2000/svg"}},[_h('circle',{attrs:{"cx":"15","cy":"15","r":"15"}},[_h('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"60","cy":"15","r":"9","fill-opacity":".3"}},[_h('animate',{attrs:{"attributeName":"r","from":"9","to":"9","begin":"0s","dur":"0.8s","values":"9;15;9","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"fill-opacity","from":".5","to":".5","begin":"0s","dur":"0.8s","values":".5;1;.5","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"105","cy":"15","r":"15"}},[_h('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SFacebook = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","xmlns":"http://www.w3.org/2000/svg","preserveAspectRatio":"xMidYMid"}},[_h('g',{attrs:{"transform":"translate(20 50)"}},[_h('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":color,"opacity":"0.6"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})])]),_h('g',{attrs:{"transform":"translate(50 50)"}},[_h('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":color,"opacity":"0.8"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.1s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})])]),_h('g',{attrs:{"transform":"translate(80 50)"}},[_h('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":color,"opacity":"0.9"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.2s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SGears = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"transform":"translate(-20,-20)"}},[_h('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":color}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"90 50 50","to":"0 50 50","dur":"1s","repeatCount":"indefinite"}})])]),_h('g',{attrs:{"transform":"translate(20,20) rotate(15 50 50)"}},[_h('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":color}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"90 50 50","dur":"1s","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SGrid = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 105 105","xmlns":"http://www.w3.org/2000/svg"}},[_h('circle',{attrs:{"cx":"12.5","cy":"12.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"12.5","cy":"52.5","r":"12.5","fill-opacity":".5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"100ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"52.5","cy":"12.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"300ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"52.5","cy":"52.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"600ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"92.5","cy":"12.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"800ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"92.5","cy":"52.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"400ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"12.5","cy":"92.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"700ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"52.5","cy":"92.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"500ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"92.5","cy":"92.5","r":"12.5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"200ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SHearts = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"fill":color,"width":size,"height":size,"viewBox":"0 0 140 64","xmlns":"http://www.w3.org/2000/svg"}},[_h('path',{attrs:{"d":"M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.716-6.002 11.47-7.65 17.304-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z","fill-opacity":".5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.593-2.32 17.308 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z","fill-opacity":".5"}},[_h('animate',{attrs:{"attributeName":"fill-opacity","begin":"0.7s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"}})])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SHourglass = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',[_h('path',{staticClass:"glass",attrs:{"fill":"none","stroke":color,"stroke-width":"5","stroke-miterlimit":"10","d":"M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"}}),_h('clipPath',{attrs:{"id":"uil-hourglass-clip1"}},[_h('rect',{staticClass:"clip",attrs:{"x":"15","y":"20","width":"70","height":"25"}},[_h('animate',{attrs:{"attributeName":"height","from":"25","to":"0","dur":"1s","repeatCount":"indefinite","vlaues":"25;0;0","keyTimes":"0;0.5;1"}}),_h('animate',{attrs:{"attributeName":"y","from":"20","to":"45","dur":"1s","repeatCount":"indefinite","vlaues":"20;45;45","keyTimes":"0;0.5;1"}})])]),_h('clipPath',{attrs:{"id":"uil-hourglass-clip2"}},[_h('rect',{staticClass:"clip",attrs:{"x":"15","y":"55","width":"70","height":"25"}},[_h('animate',{attrs:{"attributeName":"height","from":"0","to":"25","dur":"1s","repeatCount":"indefinite","vlaues":"0;25;25","keyTimes":"0;0.5;1"}}),_h('animate',{attrs:{"attributeName":"y","from":"80","to":"55","dur":"1s","repeatCount":"indefinite","vlaues":"80;55;55","keyTimes":"0;0.5;1"}})])]),_h('path',{staticClass:"sand",attrs:{"d":"M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z","clip-path":"url(#uil-hourglass-clip1)","fill":color}}),_h('path',{staticClass:"sand",attrs:{"d":"M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z","clip-path":"url(#uil-hourglass-clip2)","fill":color}}),_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"180 50 50","repeatCount":"indefinite","dur":"1s","values":"0 50 50;0 50 50;180 50 50","keyTimes":"0;0.7;1"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SInfinity = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_h('path',{attrs:{"d":"M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z","fill":"none","stroke":color,"stroke-width":"8","stroke-dasharray":"10.691205342610678 10.691205342610678","stroke-dashoffset":"0"}},[_h('animate',{attrs:{"attributeName":"stroke-dashoffset","from":"0","to":"21.382410685221355","begin":"0","dur":"2s","repeatCount":"indefinite","fill":"freeze"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SIos = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(0 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(30 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.08333333333333333s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(60 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.16666666666666666s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(90 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.25s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(120 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.3333333333333333s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(150 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.4166666666666667s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(180 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.5s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(210 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.5833333333333334s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(240 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.6666666666666666s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(270 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.75s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(300 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.8333333333333334s","repeatCount":"indefinite"}})]),_h('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":color,"transform":"rotate(330 50 50) translate(0 -30)"}},[_h('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.9166666666666666s","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SOval = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"stroke":color,"width":size,"height":size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_h('circle',{attrs:{"stroke-opacity":".5","cx":"18","cy":"18","r":"18"}}),_h('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"1s","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SPie = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_h('path',{attrs:{"d":"M0 50A50 50 0 0 1 50 0L50 50L0 50","fill":color,"opacity":"0.5"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"0.8s","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M50 0A50 50 0 0 1 100 50L50 50L50 0","fill":color,"opacity":"0.5"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"1.6s","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M100 50A50 50 0 0 1 50 100L50 50L100 50","fill":color,"opacity":"0.5"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"2.4s","repeatCount":"indefinite"}})]),_h('path',{attrs:{"d":"M50 100A50 50 0 0 1 0 50L50 50L50 100","fill":color,"opacity":"0.5"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"3.2s","repeatCount":"indefinite"}})])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SPuff = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"stroke":color,"width":size,"height":size,"viewBox":"0 0 44 44","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"fill":"none","fill-rule":"evenodd","stroke-width":"2"}},[_h('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_h('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-opacity","begin":"0s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_h('animate',{attrs:{"attributeName":"r","begin":"-0.9s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-opacity","begin":"-0.9s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SRadio = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"transform":"scale(0.55)"}},[_h('circle',{attrs:{"cx":"30","cy":"150","r":"30","fill":color}},[_h('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_h('path',{attrs:{"d":"M90,150h30c0-49.7-40.3-90-90-90v30C63.1,90,90,116.9,90,150z","fill":color}},[_h('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.1","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_h('path',{attrs:{"d":"M150,150h30C180,67.2,112.8,0,30,0v30C96.3,30,150,83.7,150,150z","fill":color}},[_h('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.2","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SRings = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"stroke":color,"width":size,"height":size,"viewBox":"0 0 45 45","xmlns":"http://www.w3.org/2000/svg"}},[_h('g',{attrs:{"fill":"none","fill-rule":"evenodd","transform":"translate(1 1)","stroke-width":"2"}},[_h('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_h('animate',{attrs:{"attributeName":"r","begin":"1.5s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-opacity","begin":"1.5s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-width","begin":"1.5s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_h('animate',{attrs:{"attributeName":"r","begin":"3s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-opacity","begin":"3s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_h('animate',{attrs:{"attributeName":"stroke-width","begin":"3s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"cx":"22","cy":"22","r":"8"}},[_h('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.5s","values":"6;1;2;3;4;5;6","calcMode":"linear","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var STail = {render: function(){with(this){return _h('svg',{staticClass:"q-spinner",attrs:{"width":size,"height":size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_h('defs',[_h('linearGradient',{attrs:{"x1":"8.042%","y1":"0%","x2":"65.682%","y2":"23.865%","id":"a"}},[_h('stop',{attrs:{"stop-color":color,"stop-opacity":"0","offset":"0%"}}),_h('stop',{attrs:{"stop-color":color,"stop-opacity":".631","offset":"63.146%"}}),_h('stop',{attrs:{"stop-color":color,"offset":"100%"}})])]),_h('g',{attrs:{"transform":"translate(1 1)","fill":"none","fill-rule":"evenodd"}},[_h('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18","stroke":"url(#a)","stroke-width":"2"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})]),_h('circle',{attrs:{"fill":color,"cx":"36","cy":"18","r":"1"}},[_h('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})])])])}},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var Spinner = {render: function(){with(this){return _h('s-' + name,{tag:"component",attrs:{"size":size,"color":color}})}},staticRenderFns: [],
  props: {
    name: {
      type: String,
      default: current === 'ios' ? 'ios' : 'tail'
    },
    size: {
      type: Number,
      default: 64
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  components: {
    SAudio,
    SBall,
    SBars,
    SCircles,
    SDots,
    SFacebook,
    SGears,
    SGrid,
    SHearts,
    SHourglass,
    SInfinity,
    SIos,
    SOval,
    SPie,
    SPuff,
    SRadio,
    SRings,
    STail
  }
};

var State = {render: function(){with(this){return _h('span',[(active)?_t("active"):_t("default")])}},staticRenderFns: [],
  props: {
    active: {
      type: Boolean,
      required: true
    }
  }
};

var Stepper = {render: function(){with(this){return _h('div',{staticClass:"q-stepper timeline primary"},[_t("default")])}},staticRenderFns: [],
  data () {
    return {
      config: {
        steps: 0,
        currentStep: 0
      }
    }
  },
  methods: {
    reset () {
      this.config.currentStep = 1;
    },
    nextStep () {
      this.config.currentStep++;
      if (this.config.currentStep > this.config.steps) {
        this.$emit('finish');
      }
    },
    previousStep () {
      this.config.currentStep--;
    },
    finish () {
      this.config.currentStep = this.config.steps + 1;
      this.$emit('finish');
    }
  },
  mounted () {
    let step = 1;
    this.config.currentStep = this.config.currentStep || 1;
    this.config.steps = this.$children.length;
    this.$children.forEach(child => {
      child.step = step;
      step++;
    });
  }
};

var Step = {render: function(){with(this){return _h('div',{staticClass:"timeline-item",class:{incomplete: step > stepper.currentStep}},[_h('div',{staticClass:"timeline-badge"},[_h('i',{directives:[{name:"show",rawName:"v-show",value:(step < stepper.currentStep),expression:"step < stepper.currentStep"}]},["done "]),_h('span',{directives:[{name:"show",rawName:"v-show",value:(step >= stepper.currentStep),expression:"step >= stepper.currentStep"}]},[_s(step)])]),_h('div',{staticClass:"timeline-title text-bold",domProps:{"innerHTML":_s(title)}}),_h('q-transition',{attrs:{"name":"slide"}},[_h('div',{directives:[{name:"show",rawName:"v-show",value:(stepper && step === stepper.currentStep),expression:"stepper && step === stepper.currentStep"}],staticClass:"timeline-content"},[_t("default"),_h('div',{staticClass:"group",staticStyle:{"margin-top":"1rem","margin-left":"-5px"}},[_h('button',{staticClass:"primary",class:{disabled: !ready},on:{"click":function($event){nextStep();}}},[_s(stepper && step === stepper.steps ? 'Finish' : 'Continue')])," ",(step > 1)?_h('button',{staticClass:"primary clear",on:{"click":function($event){previousStep();}}},["Back"]):_e()])])])])}},staticRenderFns: [],
  props: {
    title: {
      type: String,
      required: true
    },
    ready: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      step: -1
    }
  },
  computed: {
    stepper () {
      return this.$parent.config
    }
  },
  methods: {
    nextStep () {
      if (this.ready) {
        this.$parent.nextStep();
      }
    },
    previousStep () {
      this.$parent.previousStep();
    },
    finish () {
      this.$parent.finish();
    }
  }
};

var Tab = {render: function(){with(this){return _h('div',{staticClass:"q-tab items-center justify-center",class:{active: isActive, hidden, disabled: disable, hideIcon: hide === 'icon', hideLabel: hide === 'label'},on:{"click":function($event){activate();}}},[(route)?_h('router-link',{ref:"routerLink",attrs:{"to":route,"replace":replace,"append":append,"exact":exact}}):_e(),(icon)?_h('i',{staticClass:"q-tabs-icon"},[_s(icon)]):_e()," ",_h('span',{staticClass:"q-tab-label"},[_t("default")])])}},staticRenderFns: [],
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: String,
    route: String,
    replace: Boolean,
    exact: Boolean,
    append: Boolean
  },
  computed: {
    uid () {
      return this.name || Utils.uid()
    },
    isActive () {
      return this.$parent.activeTab === this.uid
    },
    targetElement () {
      return this.$parent.refs && this.$parent.refs[this.uid]
    }
  },
  watch: {
    isActive (value) {
      this.$emit('selected', value);
      this.setTargetVisibility(value);
    }
  },
  created () {
    if (this.route) {
      this.$watch('$route', () => {
        this.$nextTick(() => {
          this.__selectTabIfRouteMatches();
        });
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setTargetVisibility(this.isActive);
      if (this.route) {
        this.__selectTabIfRouteMatches();
      }
    });
  },
  methods: {
    activate () {
      if (!this.isActive && !this.disable) {
        if (this.route) {
          this.$refs.routerLink.$el.click();
        }
        else {
          this.$parent.setActiveTab(this.uid);
        }
      }
    },
    deactivate () {
      if (this.isActive && !this.disable) {
        this.$parent.setActiveTab(false);
      }
    },
    setTargetVisibility (visible) {
      if (this.targetElement) {
        this.targetElement.style.display = visible ? '' : 'none';
      }
    },
    __selectTabIfRouteMatches () {
      this.$nextTick(() => {
        if (this.route && this.$refs.routerLink.$el.classList.contains('router-link-active')) {
          this.$parent.setActiveTab(this.uid);
        }
      });
    }
  }
};

const scrollNavigationSpeed = 5;
const debounceDelay = 50; // in ms

var Tabs = {render: function(){with(this){return _h('div',{staticClass:"q-tabs row"},[_h('div',{ref:"leftScroll",staticClass:"row items-center justify-center left-scroll"},[_h('i',["chevron_left"])]),_h('div',{ref:"scroller",staticClass:"q-tabs-scroller row"},[_t("default")]),_h('div',{ref:"rightScroll",staticClass:"row items-center justify-center right-scroll"},[_h('i',["chevron_right"])])])}},staticRenderFns: [],
  props: {
    refs: {
      type: Object
    },
    value: [String, Object],
    defaultTab: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      innerValue: false
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.usingModel ? this.value : this.innerValue
      },
      set (value) {
        if (this.usingModel) {
          this.$emit('input', value);
        }
        else {
          this.innerValue = value;
        }
      }
    },
    usingModel () {
      return typeof this.value !== 'undefined'
    }
  },
  watch: {
    activeTab (value) {
      this.$emit('change', value);
      if (!value) {
        return
      }
      this.__findTabAndScroll(value);
    },
    '$children' () {
      this.redraw();
    }
  },
  created () {
    this.scrollTimer = null;
    this.scrollable = !Platform.is.desktop;

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = Utils.debounce(this.__redraw, debounceDelay);
    this.__updateScrollIndicator = Utils.debounce(this.__updateScrollIndicator, debounceDelay);
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scroller.addEventListener('scroll', this.__updateScrollIndicator);
      window.addEventListener('resize', this.__redraw);

      // let browser drawing stabilize then
      setTimeout(() => { this.__redraw(); }, debounceDelay);

      if (Platform.is.desktop) {
        var scrollEvents = {
          start: [],
          stop: []
        };

        scrollEvents.start.push('mousedown');
        scrollEvents.stop.push('mouseup');

        if (Platform.has.touch) {
          scrollEvents.start.push('touchstart');
          scrollEvents.stop.push('touchend');
        }

        scrollEvents.start.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            this.__animScrollTo(0);
          });
          this.$refs.rightScroll.addEventListener(evt, () => {
            this.__animScrollTo(9999);
          });
        });
        scrollEvents.stop.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer);
          });
          this.$refs.rightScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer);
          });
        });
      }

      if (this.usingModel && this.defaultTab) {
        console.warn('Tabs ignoring default-tab since using v-model.', this.$el);
      }
      if (this.usingModel) {
        this.__findTabAndScroll(this.activeTab);
      }
      else if (this.defaultTab) {
        this.setActiveTab(this.defaultTab);
        this.__findTabAndScroll(this.defaultTab);
      }
      else {
        this.__findTabAndScroll(this.activeTab);
      }
    });
  },
  beforeDestroy () {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer);
    }
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator);
    window.removeEventListener('resize', this.__redraw);
  },
  methods: {
    setActiveTab (name) {
      this.activeTab = name;
    },
    __redraw () {
      if (!Platform.is.desktop) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$el.classList.add('scrollable');
        this.scrollable = true;
        this.__updateScrollIndicator();
      }
      else {
        this.$el.classList.remove('scrollable');
        this.scrollable = false;
      }
    },
    __updateScrollIndicator () {
      if (!Platform.is.desktop || !this.scrollable) {
        return
      }

      let action = this.$refs.scroller.scrollLeft + Utils.dom.width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove';

      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled');
      this.$refs.rightScroll.classList[action]('disabled');
    },
    __findTabAndScroll (value) {
      setTimeout(() => {
        let tabElement = this.$children.find(child => child.uid === value);
        if (tabElement) {
          this.__scrollToSelectedIfNeeded(tabElement.$el);
        }
      }, debounceDelay * 4);
    },
    __scrollToSelectedIfNeeded (tab) {
      if (!tab || !this.scrollable) {
        return
      }

      let
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        tabRect = tab.getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left;

      if (offset < 0) {
        this.__animScrollTo(this.$refs.scroller.scrollLeft + offset);
      }
      else {
        offset += tabWidth - this.$refs.scroller.offsetWidth;
        if (offset > 0) {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset);
        }
      }
    },
    __animScrollTo (value) {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
      }

      this.__scrollTowards(value);
      this.scrollTimer = setInterval(() => {
        if (this.__scrollTowards(value)) {
          clearInterval(this.scrollTimer);
        }
      }, 5);
    },
    __scrollTowards (value) {
      let
        scrollPosition = this.$refs.scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false;

      scrollPosition += direction * scrollNavigationSpeed;

      if (scrollPosition < 0) {
        done = true;
        scrollPosition = 0;
      }
      else if (direction === -1 && scrollPosition <= value || direction === 1 && scrollPosition >= value) {
        done = true;
        scrollPosition = value;
      }

      this.$refs.scroller.scrollLeft = scrollPosition;
      return done
    }
  }
};

var Toggle = {render: function(){with(this){return _h('label',{directives:[{name:"touch-swipe",rawName:"v-touch-swipe.horizontal",value:(__toggle),expression:"__toggle",modifiers:{"horizontal":true}}],staticClass:"q-toggle",class:{disabled: disable}},[_h('input',{directives:[{name:"model",rawName:"v-model",value:(model),expression:"model"}],attrs:{"type":"checkbox","disabled":disable},domProps:{"checked":Array.isArray(model)?_i(model,null)>-1:_q(model,true)},on:{"change":function($event){var $$a=model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_i($$a,$$v);if($$c){$$i<0&&(model=$$a.concat($$v));}else{$$i>-1&&(model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{model=$$c;}}}}),_h('div'),(icon)?_h('i',[_s(icon)]):_e()])}},staticRenderFns: [],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean,
    icon: String
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    __toggle (evt) {
      if (!this.disable) {
        if (this.model && evt.direction === 'left') {
          this.model = false;
        }
        else if (!this.model && evt.direction === 'right') {
          this.model = true;
        }
      }
    }
  }
};

var Tooltip = {render: function(){with(this){return _h('span',{staticClass:"q-tooltip animate-scale",style:(transformCSS)},[_t("default")])}},staticRenderFns: [],
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: Utils.popup.positionValidator
    },
    maxHeight: String,
    disable: Boolean
  },
  data () {
    return {
      opened: false
    }
  },
  computed: {
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    },
    transformCSS () {
      return Utils.popup.getTransformProperties({
        selfOrigin: this.selfOrigin
      })
    }
  },
  methods: {
    open () {
      if (this.disable) {
        return
      }
      this.opened = true;
      document.body.appendChild(this.$el);
      Utils.popup.setPosition({
        el: this.$el,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      });
    },
    close () {
      if (this.opened) {
        this.opened = false;
        document.body.removeChild(this.$el);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode;
      this.anchorEl.removeChild(this.$el);
      this.anchorEl.addEventListener('mouseenter', this.open);
      this.anchorEl.addEventListener('focus', this.open);
      this.anchorEl.addEventListener('mouseleave', this.close);
      this.anchorEl.addEventListener('blur', this.close);
    });
  },
  beforeDestroy () {
    this.anchorEl.removeEventListener('mouseenter', this.open);
    this.anchorEl.removeEventListener('focus', this.open);
    this.anchorEl.removeEventListener('mouseleave', this.close);
    this.anchorEl.removeEventListener('blur', this.close);
    this.close();
  }
};

var QuasarTreeItem = {render: function(){with(this){return _h('li',{staticClass:"q-tree-item"},[_h('div',{class:{'q-tree-expandable-item': isExpandable, 'q-tree-link': model.handler},on:{"click":toggle}},[(model.icon)?_h('i',[_s(model.icon)]):_e()," ",_h('span',{staticClass:"q-tree-label"},[_s(model.title)])," ",(isExpandable)?_h('span',{domProps:{"innerHTML":_s(model.expanded ? contractHtml : expandHtml)}}):_e()]),_h('q-transition',{attrs:{"name":"slide"}},[_h('ul',{directives:[{name:"show",rawName:"v-show",value:(isExpandable && model.expanded),expression:"isExpandable && model.expanded"}]},[_l((model.children),function(item){return _h('q-tree-item',{attrs:{"model":item,"contract-html":contractHtml,"expand-html":expandHtml}})})])])])}},staticRenderFns: [],
  name: 'q-tree-item',
  props: ['model', 'contract-html', 'expand-html'],
  methods: {
    toggle () {
      if (this.isExpandable) {
        this.model.expanded = !this.model.expanded;
        return
      }

      if (typeof this.model.handler === 'function') {
        this.model.handler(this.model);
      }
    }
  },
  computed: {
    isExpandable () {
      return this.model.children && this.model.children.length
    }
  }
};

var Tree = {render: function(){with(this){return _h('div',{staticClass:"q-tree"},[_h('ul',[_l((model),function(item){return _h('q-tree-item',{attrs:{"model":item,"contract-html":contractHtml,"expand-html":expandHtml}})})])])}},staticRenderFns: [],
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i>remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i>add_circle</i>'
    }
  },
  components: {
    QuasarTreeItem
  }
};

var Video = {render: function(){with(this){return _h('div',{staticClass:"video"},[_h('iframe',{attrs:{"src":src,"frameborder":"0","allowfullscreen":""}})])}},staticRenderFns: [],
  props: ['src']
};

function registerDirectives (_Vue) {
  _Vue.directive('go-back', dGoBack);
  _Vue.directive('link', dLink);
  _Vue.directive('scroll-fire', dScrollFire);
  _Vue.directive('scroll', dScroll);
  _Vue.directive('touch-hold', dTouchHold);
  _Vue.directive('touch-pan', dTouchPan);
  _Vue.directive('touch-swipe', dTouchSwipe);
}

function registerComponents (_Vue) {
  _Vue.component('q-checkbox', Checkbox);
  _Vue.component('q-chips', Chips);
  _Vue.component('q-collapsible', Collapsible);
  _Vue.component('q-context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile);
  _Vue.component('q-inline-datetime', current === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial);
  _Vue.component('q-datetime', Datetime);
  _Vue.component('q-drawer', Drawer);
  _Vue.component('q-drawer-link', DrawerLink);
  _Vue.component('q-fab', Fab);
  _Vue.component('q-small-fab', SmallFab);
  _Vue.component('q-gallery', Gallery);
  _Vue.component('q-gallery-slider', GallerySlider);
  _Vue.component('q-infinite-scroll', InfiniteScroll);
  _Vue.component('q-knob', Knob);
  _Vue.component('q-layout', Layout);
  _Vue.component('q-toolbar-title', ToolbarTitle);
  _Vue.component('q-modal', Modal);
  _Vue.component('q-numeric', Numeric);
  _Vue.component('q-pagination', Pagination);
  _Vue.component('q-parallax', Parallax);
  _Vue.component('q-picker-textfield', PickerTextfield);
  _Vue.component('q-popover', Popover);
  _Vue.component('q-progress', Progress);
  _Vue.component('q-progress-button', ProgressButton);
  _Vue.component('q-pull-to-refresh', PullToRefresh);
  _Vue.component('q-radio', Radio);
  _Vue.component('q-range', Range);
  _Vue.component('q-double-range', DoubleRange);
  _Vue.component('q-rating', Rating);
  _Vue.component('q-search', Search);
  _Vue.component('q-select', Select);
  _Vue.component('q-dialog-select', DialogSelect);
  _Vue.component('q-slider', Slider);
  _Vue.component('spinner', Spinner);
  _Vue.component('q-state', State);
  _Vue.component('q-stepper', Stepper);
  _Vue.component('q-step', Step);
  _Vue.component('q-tab', Tab);
  _Vue.component('q-tabs', Tabs);
  _Vue.component('q-toggle', Toggle);
  _Vue.component('q-tooltip', Tooltip);
  _Vue.component('q-tree', Tree);
  _Vue.component('q-video', Video);

  _Vue.component('q-transition', Transition);
}

var Vue;

var install$$1 = function (_Vue) {
  if (this.installed) {
    console.warn('Quasar already installed in Vue.');
    return
  }

  Vue = _Vue;

  install$1(_Vue);
  registerDirectives(_Vue);
  registerComponents(_Vue);
  install$2(_Vue);

  _Vue.prototype.$quasar = {
    platform: Platform,
    theme: current
  };
};

var start = function (callback = function () {}) {
  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (Platform.is.cordova && !Platform.within.iframe) {
    var tag = document.createElement('script');

    document.addEventListener('deviceready', callback, false);

    tag.type = 'text/javascript';
    document.body.appendChild(tag);
    tag.src = 'cordova.js';

    return
  }

  callback();
};

var standaloneInstall = function (Quasar) {
  // auto install in standalone mode
  if (typeof window !== 'undefined' && window.Vue) {
    if (!Quasar.theme.current) {
      Quasar.theme.set('mat');
    }

    window.Quasar = Quasar;
    window.Vue.use(Quasar);
  }
};

function addClass (className) {
  document.body.classList.add(className);
}

Utils.dom.ready(() => {
  addClass(Platform.is.desktop ? 'desktop' : 'mobile');
  addClass(Platform.has.touch ? 'touch' : 'no-touch');

  if (Platform.within.iframe) {
    addClass('within-iframe');
  }

  if (Platform.is.cordova) {
    addClass('cordova');
  }

  if (Platform.is.electron) {
    addClass('electron');
  }
});

/* eslint-disable no-extend-native, one-var, no-self-compare */

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchEl, startFrom) {
    'use strict';

    let O = Object(this);
    let len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false
    }
    let n = parseInt(startFrom, 10) || 0;
    let k;
    if (n >= 0) {
      k = n;
    }
    else {
      k = len + n;
      if (k < 0) { k = 0; }
    }
    let curEl;
    while (k < len) {
      curEl = O[k];
      if (searchEl === curEl ||
         (searchEl !== searchEl && curEl !== curEl)) { // NaN !== NaN
        return true
      }
      k++;
    }
    return false
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str, position) {
    position = position || 0;
    return this.substr(position, str.length) === str
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str, position) {
    let subjectString = this.toString();

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= str.length;

    let lastIndex = subjectString.indexOf(str, position);

    return lastIndex !== -1 && lastIndex === position
  };
}

if (typeof Element.prototype.matches !== 'function') {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches (selector) {
    let
      element = this,
      elements = (element.document || element.ownerDocument).querySelectorAll(selector),
      index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return Boolean(elements[index])
  };
}

if (typeof Element.prototype.closest !== 'function') {
  Element.prototype.closest = function closest (selector) {
    let el = this;
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el
      }
      el = el.parentNode;
    }
    return null
  };
}

/*
 * Capture errors
 */
window.onerror = function (message, source, lineno, colno, error) {
  Events.$emit('app:error', {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  });
};

if (Platform.has.touch) {
  FastClick.attach(document.body);
}

if (Platform.is.mobile && !Platform.is.cordova) {
  Utils.dom.ready(() => {
    // add meta tag for mobile address bar coloring
    let tempDiv = document.createElement('div');
    tempDiv.style.height = '10px';
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-100000px';
    tempDiv.className = 'bg-primary';
    document.body.appendChild(tempDiv);

    let primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color');

    document.body.removeChild(tempDiv);

    let rgb = primaryColor.match(/\d+/g);
    let hex = '#' + Utils.colors.rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));

    // http://stackoverflow.com/a/33193739
    let metaTag = document.createElement('meta');

    if (Platform.is.winphone) {
      // <meta name="msapplication-navbutton-color" content="#4285f4">
      metaTag.setAttribute('name', 'msapplication-navbutton-color');
    }

    // Chrome, Firefox OS, Opera, Vivaldi
    if (Platform.is.webkit || Platform.is.vivaldi) {
      // <meta name="theme-color" content="#4285f4">
      metaTag.setAttribute('name', 'theme-color');
    }

    if (Platform.is.safari) {
      // <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4">
      metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    }
    metaTag.setAttribute('content', hex);

    document.getElementsByTagName('head')[0].appendChild(metaTag);
  });
}

const modalCSS = {
  mat: {
    maxHeight: '80vh',
    height: 'auto'
  },
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    backgroundColor: 'transparent',
    boxShadow: 'none'
  }
};

var ActionSheets = {render: function(){with(this){return _h('q-modal',{ref:"dialog",staticClass:"with-backdrop",attrs:{"position-classes":"items-end justify-center","transition":"q-modal-actions","content-css":css}},[($quasar.theme === 'mat')?_m(0):_e(),($quasar.theme === 'ios')?_m(1):_e()])}},staticRenderFns: [function(){with(this){return _h('div',[(title)?_h('div',{staticClass:"modal-header",domProps:{"innerHTML":_s(title)}}):_e(),_h('div',{staticClass:"modal-scroll"},[(gallery)?_h('div',{staticClass:"q-action-sheet-gallery row wrap items-center justify-center"},[_l((actions),function(button){return _h('div',{staticClass:"cursor-pointer column inline items-center justify-center",class:button.classes,on:{"click":function($event){close(button.handler);}}},[(button.icon)?_h('i',[_s(button.icon)]):_e()," ",(button.avatar)?_h('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_e()," ",_h('span',[_s(button.label)])])})]):_h('div',{staticClass:"list no-border"},[_l((actions),function(button){return _h('div',{staticClass:"item item-link",class:button.classes,on:{"click":function($event){close(button.handler);}}},[(button.icon)?_h('i',{staticClass:"item-primary"},[_s(button.icon)]):_e()," ",(button.avatar)?_h('img',{staticClass:"item-primary",attrs:{"src":button.avatar}}):_e(),_h('div',{staticClass:"item-content inset"},[_s(button.label)])])})])]),(dismiss)?_h('div',{staticClass:"list no-border"},[_h('div',{staticClass:"item item-link",class:dismiss.classes,on:{"click":function($event){close(dismiss.handler);}}},[(dismiss.icon)?_h('i',{staticClass:"item-primary"},[_s(dismiss.icon)]):_e(),_h('div',{staticClass:"item-content inset"},[_s(dismiss.label)])])]):_e()])}},function(){with(this){return _h('div',[_h('div',{staticClass:"q-action-sheet"},[(title)?_h('div',{staticClass:"modal-header",domProps:{"innerHTML":_s(title)}}):_e(),_h('div',{staticClass:"modal-scroll"},[(gallery)?_h('div',{staticClass:"q-action-sheet-gallery row wrap items-center justify-center"},[_l((actions),function(button){return _h('div',{staticClass:"cursor-pointer column inline items-center justify-center",class:button.classes,on:{"click":function($event){close(button.handler);}}},[(button.icon)?_h('i',[_s(button.icon)]):_e()," ",(button.avatar)?_h('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_e()," ",_h('span',[_s(button.label)])])})]):_h('div',{staticClass:"list no-border"},[_l((actions),function(button){return _h('div',{staticClass:"item item-link",class:button.classes,on:{"click":function($event){close(button.handler);}}},[(button.icon)?_h('i',{staticClass:"item-primary"},[_s(button.icon)]):_e()," ",(button.avatar)?_h('img',{staticClass:"item-primary",attrs:{"src":button.avatar}}):_e(),_h('div',{staticClass:"item-content inset"},[_s(button.label)])])})])])]),(dismiss)?_h('div',{staticClass:"q-action-sheet"},[_h('div',{staticClass:"item item-link",class:dismiss.classes,on:{"click":function($event){close(dismiss.handler);}}},[_h('div',{staticClass:"item-content row justify-center"},[_s(dismiss.label)])])]):_e()])}}],
  props: {
    title: String,
    gallery: Boolean,
    actions: {
      type: Array,
      required: true
    },
    dismiss: Object
  },
  data () {
    return {
      css: modalCSS[current]
    }
  },
  computed: {
    opened () {
      return this.$refs.dialog.active
    },
    actionButtons () {
      return this.buttons.slice(0, this.buttons.length - 2)
    },
    dismissButton () {
      return this.buttons[this.buttons.length - 1]
    }
  },
  methods: {
    close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(() => {
        this.$root.$destroy();
        if (typeof fn === 'function') {
          fn();
        }
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.dialog.open();
      this.$root.quasarClose = this.close;
    });
  },
  destroyed () {
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el);
    }
  }
};

var actionSheet = ModalGenerator(ActionSheets);

function isActive$1 () {
  return document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
}

function request (target) {
  target = target || document.documentElement;

  if (isActive$1()) {
    return
  }

  if (target.requestFullscreen) {
    target.requestFullscreen();
  }
  else if (target.msRequestFullscreen) {
    target.msRequestFullscreen();
  }
  else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen();
  }
  else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT); // eslint-disable-line no-undef
  }
}

function exit () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function toggle$1 (target) {
  if (isActive$1()) {
    exit();
  }
  else {
    request(target);
  }
}

var appFullscreen = {
  isActive: isActive$1,
  request,
  exit,
  toggle: toggle$1
};

let hidden$1 = 'hidden';
let appVisibility = 'visible';

function onchange (evt) {
  let
    v = 'visible',
    h = 'hidden',
    state,
    evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };

  evt = evt || window.event;

  if (evt.type in evtMap) {
    state = evtMap[evt.type];
  }
  else {
    state = this[hidden$1] ? h : v;
  }

  appVisibility = state;
  Events.$emit('app:visibility', state);
}

Utils.dom.ready(() => {
  // Standards:
  if (hidden$1 in document) {
    document.addEventListener('visibilitychange', onchange);
  }
  else if ((hidden$1 = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange);
  }
  else if ((hidden$1 = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange);
  }
  else if ((hidden$1 = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange);
  }
  // IE 9 and lower:
  else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
  }
  // All others:
  else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden$1] !== undefined) {
    onchange({type: document[hidden$1] ? 'blur' : 'focus'});
  }
});

var appVisibility$1 = {
  isVisible: () => appVisibility === 'visible'
};

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '));

  try {
    string = JSON.parse(string);
  }
  catch (e) {}

  return string
}

function set$2 (key, value, options = {}) {
  let
    days = options.expires,
    time = options.expires = new Date();

  if (typeof options.expires === 'number') {
    time.setMilliseconds(time.getMilliseconds() + days * 864e+5);
  }

  document.cookie = [
    encode(key), '=', stringifyCookieValue(value),
    options.expires ? ' expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    options.path ? ' path=' + options.path : '',
    options.domain ? ' domain=' + options.domain : '',
    options.secure ? ' secure' : ''
  ].join('');
}

function get$1 (key) {
  let
    result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split(' ') : [],
    i = 0,
    l = cookies.length,
    parts,
    name,
    cookie;

  for (; i < l; i++) {
    parts = cookies[i].split('=');
    name = decode(parts.shift());
    cookie = parts.join('=');

    if (!key) {
      result[name] = cookie;
    }
    else if (key === name) {
      result = read(cookie);
      break
    }
  }

  return result
}

function remove$2 (key, options) {
  set$2(key, '', Utils.extend(true, {}, options, {
    expires: -1
  }));
}

function has (key) {
  return get$1(key) !== undefined
}

var cookies = {
  get: get$1,
  set: set$2,
  has,
  remove: remove$2,
  all: () => get$1()
};

var Loading = {render: function(){with(this){return _h('div',{staticClass:"q-loading animate-fade fullscreen column items-center justify-center z-absolute"},[_h('spinner',{attrs:{"name":spinner,"color":spinnerColor,"size":spinnerSize}}),(message)?_h('div',{style:({color: messageColor})},[_s(message)]):_e()])}},staticRenderFns: [],
  props: {
    message: [String, Boolean],
    spinner: String,
    spinnerSize: {
      type: Number,
      default: 80
    },
    spinnerColor: {
      type: String,
      default: '#fff'
    },
    messageColor: {
      type: String,
      default: 'white'
    }
  }
};

let vm;
let appIsInProgress = false;
let timeout;
let props = {};

function isActive$2 () {
  return appIsInProgress
}

function show ({
  delay = 500,
  spinner = current === 'ios' ? 'ios' : 'tail',
  message = false,
  spinnerSize,
  spinnerColor,
  messageColor
} = {}) {
  props.spinner = spinner;
  props.message = message;
  props.spinnerSize = spinnerSize;
  props.spinnerColor = spinnerColor;
  props.messageColor = messageColor;

  if (appIsInProgress) {
    vm && vm.$forceUpdate();
    return
  }

  timeout = setTimeout(() => {
    timeout = null;

    const node = document.createElement('div');
    document.body.appendChild(node);
    document.body.classList.add('with-loading');

    vm = new Vue({
      el: node,
      render: h => h(Loading, {props})
    });
  }, delay);

  appIsInProgress = true;
  Events.$emit('app:loading', true);
}

function hide$1 () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  else {
    vm.$destroy();
    document.body.classList.remove('with-loading');
    document.body.removeChild(vm.$el);
    vm = null;
  }

  appIsInProgress = false;
  Events.$emit('app:loading', false);
}

var loading = {
  isActive: isActive$2,
  show,
  hide: hide$1
};

function encode$1 (value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return '__q_date|' + value.toUTCString()
  }
  if (Object.prototype.toString.call(value) === '[object RegExp]') {
    return '__q_expr|' + value.source
  }
  if (typeof value === 'number') {
    return '__q_numb|' + value
  }
  if (typeof value === 'boolean') {
    return '__q_bool|' + (value ? '1' : '0')
  }
  if (typeof value === 'string') {
    return '__q_strn|' + value
  }
  if (typeof value === 'function') {
    return '__q_strn|' + value.toString()
  }
  if (value === Object(value)) {
    return '__q_objt|' + JSON.stringify(value)
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value
}

function decode$1 (value) {
  let type, length, source;

  length = value.length;
  if (length < 10) {
    // then it wasn't encoded by us
    return value
  }

  type = value.substr(0, 8);
  source = value.substring(9);

  switch (type) {
    case '__q_date':
      return new Date(source)

    case '__q_expr':
      return new RegExp(source)

    case '__q_numb':
      return Number(source)

    case '__q_bool':
      return Boolean(source === '1')

    case '__q_strn':
      return '' + source

    case '__q_objt':
      return JSON.parse(source)

    default:
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
  }
}

function generateFunctions (fn) {
  return {
    local: fn('local'),
    session: fn('session')
  }
}

let hasStorageItem = generateFunctions(
    (type) => (key) => window[type + 'Storage'].getItem(key) !== null
  );
let getStorageLength = generateFunctions(
    (type) => () => window[type + 'Storage'].length
  );
let getStorageItem = generateFunctions((type) => {
    let
      hasFn = hasStorageItem[type],
      storage = window[type + 'Storage'];

    return (key) => {
      if (hasFn(key)) {
        return decode$1(storage.getItem(key))
      }
      return null
    }
  });
let getStorageAtIndex = generateFunctions((type) => {
    let
      lengthFn = getStorageLength[type],
      getItemFn = getStorageItem[type],
      storage = window[type + 'Storage'];

    return (index) => {
      if (index < lengthFn()) {
        return getItemFn(storage.key(index))
      }
    }
  });
let getAllStorageItems = generateFunctions((type) => {
    let
      lengthFn = getStorageLength[type],
      storage = window[type + 'Storage'],
      getItemFn = getStorageItem[type];

    return () => {
      let
        result = {},
        key,
        length = lengthFn();

      for (let i = 0; i < length; i++) {
        key = storage.key(i);
        result[key] = getItemFn(key);
      }

      return result
    }
  });
let setStorageItem = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return (key, value) => { storage.setItem(key, encode$1(value)); }
  });
let removeStorageItem = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return (key) => { storage.removeItem(key); }
  });
let clearStorage = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return () => { storage.clear(); }
  });
let storageIsEmpty = generateFunctions((type) => {
    let getLengthFn = getStorageLength[type];
    return () => getLengthFn() === 0
  });

var LocalStorage = {
  has: hasStorageItem.local,
  get: {
    length: getStorageLength.local,
    item: getStorageItem.local,
    index: getStorageAtIndex.local,
    all: getAllStorageItems.local
  },
  set: setStorageItem.local,
  remove: removeStorageItem.local,
  clear: clearStorage.local,
  isEmpty: storageIsEmpty.local
};

var SessionStorage = { // eslint-disable-line one-var
  has: hasStorageItem.session,
  get: {
    length: getStorageLength.session,
    item: getStorageItem.session,
    index: getStorageAtIndex.session,
    all: getAllStorageItems.session
  },
  set: setStorageItem.session,
  remove: removeStorageItem.session,
  clear: clearStorage.session,
  isEmpty: storageIsEmpty.session
};

window.Velocity = Velocity$1;

let Quasar = {
  version: '0.9.1',
  install: install$$1,
  start,
  theme
};

standaloneInstall(Quasar);

export { actionSheet as ActionSheet, Dialog, appFullscreen as AppFullscreen, appVisibility$1 as AppVisibility, cookies as Cookies, Platform, Events, loading as Loading, toast$1 as Toast, Utils, LocalStorage, SessionStorage, theme };export default Quasar;
