// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/button-regulation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  type: 'button',
  onEdit: function onEdit(instance, regulation, x, y, tdNode) {
    if (regulation.callback != null) {
      regulation.callback(x, y);
    }

    return false;
  },
  onUpdateCell: function onUpdateCell(instance, regulation, x, y, tdNode) {
    var buttonNode = document.createElement('div');
    var textNode = document.createTextNode(instance.params.bodies[y][x]);
    buttonNode.addEventListener('click', function () {
      instance.setCursor(x, y, false);

      if (regulation.callback != null) {
        regulation.callback(x, y);
      }
    }, false);
    buttonNode.appendChild(textNode);
    tdNode.appendChild(buttonNode);
    return false;
  }
};
exports.default = _default;
},{}],"src/link-regulation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  type: 'link',
  onEdit: function onEdit(instance, regulation, x, y, tdNode) {
    tdNode.firstChild.click();
    return false;
  },
  onUpdateCell: function onUpdateCell(instance, regulation, x, y, tdNode) {
    var linkNode = document.createElement('a');
    linkNode.setAttribute('href', instance.params.bodies[y][x]);
    linkNode.setAttribute('target', '_blank');
    linkNode.setAttribute('rel', 'noreferrer');
    var textNode = document.createTextNode(instance.params.bodies[y][x]);
    linkNode.appendChild(textNode);
    tdNode.appendChild(linkNode);
    return false;
  }
};
exports.default = _default;
},{}],"src/select-regulation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  type: 'select',
  onSetup: function onSetup(instance) {
    this.listboxNode = null;
    this.listboxSelectedIndex = 0;
    this.setupLlistbox(instance);
  },
  onClick: function onClick(instance, regulation, targetNode) {
    if (!targetNode.closest('.editable-table__listbox')) {
      this.closeListbox(instance);
    }
  },
  onEdit: function onEdit(instance, regulation, x, y, tdNode) {
    this.listboxSelectedIndex = 0;

    for (var i = 0; i < regulation.options.length; i++) {
      if (regulation.options[i] === instance.params.bodies[y][x]) {
        this.listboxSelectedIndex = i;
        break;
      }
    }

    if (regulation.options.length > 0) {
      this.openListbox(instance, tdNode, regulation.options);
    }

    return false;
  },
  onKeyDown: function onKeyDown(instance, regulation, keyCode) {
    if (instance.focusType === 'Listbox') {
      var _regulation = instance.cellRegulations[instance.cursor.y][instance.cursor.x] || instance.columnRegulations[instance.cursor.x] || {};

      switch (keyCode) {
        case 'ArrowUp':
          {
            event.preventDefault();
            this.addListboxSelectedIndex(instance, -1, _regulation.options);
            break;
          }

        case 'ArrowDown':
          {
            event.preventDefault();
            this.addListboxSelectedIndex(instance, 1, _regulation.options);
            break;
          }

        case 'Tab':
          {
            event.preventDefault();
            this.closeListbox(instance);

            if (event.shiftKey) {
              instance.setCursorToLeft();
            } else {
              instance.setCursorToRight();
            }

            break;
          }

        case ' ':
        case 'Space':
          {
            event.preventDefault();
            this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y);
            this.closeListbox(instance);
            break;
          }

        case 'Escape':
          {
            this.closeListbox(instance);
            break;
          }
      }
    }
  },
  onKeyUp: function onKeyUp(instance, regulation, keyCode) {
    if (instance.focusType === 'Listbox') {
      switch (keyCode) {
        case 'Enter':
          {
            this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y);
            this.closeListbox(instance);
            instance.setCursorToDown();
            break;
          }
      }
    }
  },
  onPasteCell: function onPasteCell(instance, regulation, x, y) {
    return regulation.options.indexOf(instance.clipboard.value) !== -1;
  },
  setupLlistbox: function setupLlistbox(instance) {
    this.listboxNode = document.createElement('ol');
    this.listboxNode.setAttribute('class', 'editable-table__listbox');
    this.listboxNode.style['display'] = 'none';
    instance.containerNode.appendChild(this.listboxNode);
  },
  openListbox: function openListbox(instance, targetNode, options) {
    var selectedItemNode = this.updateListboxChildren(instance, options);
    this.adjustListboxIntoView(instance, targetNode);
    instance.scrollIntoView(this.listboxNode, selectedItemNode, 0, 0);
    instance.setFocus('Listbox');
  },
  updateListboxChildren: function updateListboxChildren(instance, options) {
    var _this = this;

    var selectedItemNode = null;
    this.listboxNode.innerHTML = '';

    var _loop = function _loop(i) {
      var itemNode = document.createElement('li');
      var textNode = document.createTextNode(options[i]);

      if (i === _this.listboxSelectedIndex) {
        selectedItemNode = itemNode;
      }

      itemNode.setAttribute('data-selected', i === _this.listboxSelectedIndex);
      itemNode.addEventListener('click', function (event) {
        _this.listboxSelectedIndex = i;

        _this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y);

        _this.closeListbox(instance);
      }, false);
      itemNode.appendChild(textNode);

      _this.listboxNode.appendChild(itemNode);
    };

    for (var i = 0; i < options.length; i++) {
      _loop(i);
    }

    return selectedItemNode;
  },
  closeListbox: function closeListbox(instance) {
    this.listboxNode.style['display'] = 'none';
    instance.setFocus('Table');
  },
  addListboxSelectedIndex: function addListboxSelectedIndex(instance, adding, options) {
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'false');
    this.listboxSelectedIndex += adding;
    this.listboxSelectedIndex = Math.max(0, Math.min(options.length - 1, this.listboxSelectedIndex));
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'true');
    instance.scrollIntoView(this.listboxNode, this.listboxNode.children[this.listboxSelectedIndex], 0, 0);
  },
  updateListboxToCell: function updateListboxToCell(instance, x, y) {
    var regulation = instance.cellRegulations[y][x] || instance.columnRegulations[x] || {};
    var value = regulation.options[this.listboxSelectedIndex];
    instance.params.bodies[y][x] = value;
    instance.updateCell(x, y);
  },
  adjustListboxIntoView: function adjustListboxIntoView(instance, targetNode) {
    this.listboxNode.style['opacity'] = '0';
    this.listboxNode.style['display'] = '';
    this.listboxNode.style['max-height'] = '';

    var _targetNode$getBoundi = targetNode.getBoundingClientRect(),
        left = _targetNode$getBoundi.left,
        top = _targetNode$getBoundi.top;

    var maxHeight = Math.min(this.listboxNode.clientHeight, document.documentElement.clientHeight) - (instance.params.listboxMargin || 0) * 2;
    top -= Math.abs(Math.min(document.documentElement.clientHeight - (top + maxHeight + (instance.params.listboxMargin || 0)), 0));
    this.listboxNode.style['left'] = "".concat(left, "px");
    this.listboxNode.style['top'] = "".concat(top, "px");
    this.listboxNode.style['max-height'] = "".concat(maxHeight, "px");
    this.listboxNode.style['opacity'] = '';
  }
};
exports.default = _default;
},{}],"editable-table.js":[function(require,module,exports) {
"use strict";

var _buttonRegulation = _interopRequireDefault(require("./src/button-regulation.js"));

var _linkRegulation = _interopRequireDefault(require("./src/link-regulation.js"));

var _selectRegulation = _interopRequireDefault(require("./src/select-regulation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BuiltinRegulations = [_buttonRegulation.default, _linkRegulation.default, _selectRegulation.default];

var EditableTable = /*#__PURE__*/function () {
  function EditableTable(params) {
    _classCallCheck(this, EditableTable);

    this.params = params;
    this.setupProperties();
    this.addRegulations(BuiltinRegulations);
    this.addRegulations(this.params.regulations);
    this.setColumnFilters(this.params.columnFilters);
    this.setCellFilters();
    this.setColumnRegulations(this.params.columnRegulations);
    this.setCellRegulations();
    this.setupTable();
    this.setupListeners();
    this.callRegulation('all', 'onSetup');
  }

  _createClass(EditableTable, [{
    key: "setupProperties",
    value: function setupProperties() {
      this.focusType = !!this.params.autofocus ? 'Table' : 'None';
      this.regulations = [];
      this.columnFilters = [];
      this.cellFilters = [];
      this.columnRegulations = [];
      this.cellRegulations = [];
      this.containerNode = null;
      this.scrollerNode = null;
      this.tableNode = null;
      this.theadNode = null;
      this.tbodyNode = null;
      this.cursor = {
        x: 0,
        y: 0
      };
      this.isInputting = false;
      this.clipboard = {
        type: null,
        regulation: null,
        value: null
      };
    }
  }, {
    key: "setupTable",
    value: function setupTable() {
      this.containerNode = document.createElement('div');
      this.containerNode.setAttribute('class', 'editable-table');
      this.scrollerNode = document.createElement('div');
      this.scrollerNode.setAttribute('class', 'editable-table__scroller');
      this.tableNode = document.createElement('table');
      this.theadNode = document.createElement('thead');
      this.tbodyNode = document.createElement('tbody');
      this.setHeaders(this.params.headers);
      this.setHeaderSpans(this.params.headerSpans);
      this.setBodies(this.params.bodies);
      this.tableNode.appendChild(this.theadNode);
      this.tableNode.appendChild(this.tbodyNode);
      this.scrollerNode.appendChild(this.tableNode);
      this.containerNode.appendChild(this.scrollerNode);
      this.params.containerNode.appendChild(this.containerNode);
      this.updateHeaderPositions();
      this.setFocus(this.focusType);
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.params.bodies == null ? 0 : this.params.bodies.length > 0 ? this.params.bodies[0].length : 0;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.params.bodies == null ? 0 : this.params.bodies.length;
    }
  }, {
    key: "setColumnFilters",
    value: function setColumnFilters(filters) {
      this.columnFilters.splice(0);

      if (filters != null) {
        for (var i = 0; i < filters.length; i++) {
          this.columnFilters[i] = filters[i];
        }
      }

      var xLength = this.getWidth();

      for (var x = 0; x < xLength; x++) {
        this.columnFilters[x] = this.columnFilters[x] || null;
      }
    }
  }, {
    key: "setCellFilters",
    value: function setCellFilters() {
      this.cellFilters.splice(0);
      var xLength = this.getWidth();
      var yLength = this.getHeight();

      for (var y = 0; y < yLength; y++) {
        this.cellFilters[y] = [];

        for (var x = 0; x < xLength; x++) {
          this.cellFilters[y][x] = null;
        }
      }
    }
  }, {
    key: "addRegulations",
    value: function addRegulations(regulations) {
      if (regulations != null) {
        for (var i = 0; i < regulations.length; i++) {
          this.addRegulation(regulations[i]);
        }
      }
    }
  }, {
    key: "addRegulation",
    value: function addRegulation(regulation) {
      this.regulations.push(regulation);
    }
  }, {
    key: "setColumnRegulations",
    value: function setColumnRegulations(regulations) {
      this.columnRegulations.splice(0);

      if (regulations != null) {
        for (var i = 0; i < regulations.length; i++) {
          this.columnRegulations[i] = regulations[i];
        }
      }

      var xLength = this.getWidth();

      for (var x = 0; x < xLength; x++) {
        this.columnRegulations[x] = this.columnRegulations[x] || null;
      }
    }
  }, {
    key: "setCellRegulations",
    value: function setCellRegulations() {
      this.cellRegulations.splice(0);
      var xLength = this.getWidth();
      var yLength = this.getHeight();

      for (var y = 0; y < yLength; y++) {
        this.cellRegulations[y] = [];

        for (var x = 0; x < xLength; x++) {
          this.cellRegulations[y][x] = null;
        }
      }
    }
  }, {
    key: "setCellRegulation",
    value: function setCellRegulation(x, y, regulation) {
      if (regulation != null) {
        this.cellRegulations[y][x] = {};

        for (var key in regulation) {
          this.cellRegulations[y][x][key] = regulation[key];
        }
      } else {
        this.cellRegulations[y][x] = null;
      }
    }
  }, {
    key: "setHeaders",
    value: function setHeaders(headers) {
      this.theadNode.innerHTML = '';

      if (headers != null && headers.length > 0) {
        var leftTopNode = null;

        for (var y = 0; y < headers.length; y++) {
          var trNode = document.createElement('tr');

          if (y === 0 && this.params.bodyHeaderType !== 'none') {
            leftTopNode = this.appendHeader(trNode, '');
          }

          for (var x = 0; x < headers[y].length; x++) {
            this.appendHeader(trNode, headers[y][x]);
          }

          this.theadNode.appendChild(trNode);
        }

        if (leftTopNode !== null) {
          leftTopNode.setAttribute('rowspan', '2');
        }
      }
    }
  }, {
    key: "appendHeader",
    value: function appendHeader(trNode, text) {
      var thNode = document.createElement('th');
      var textNode = document.createTextNode(text);
      thNode.appendChild(textNode);
      trNode.appendChild(thNode);
      return thNode;
    }
  }, {
    key: "setHeaderSpans",
    value: function setHeaderSpans(spans) {
      if (spans != null && this.params.headers != null) {
        for (var y = 0; y < this.params.headers.length; y++) {
          for (var x = 0; x < this.params.headers[y].length; x++) {
            if (spans[y] != null && spans[y][x] != null) {
              if (spans[y][x].x != null) {
                this.setHeaderAttribute(x, y, 'colspan', spans[y][x].x);
              }

              if (spans[y][x].y != null) {
                this.setHeaderAttribute(x, y, 'rowspan', spans[y][x].y);
              }
            }
          }
        }
      }
    }
  }, {
    key: "setHeaderAttribute",
    value: function setHeaderAttribute(x, y, name, value) {
      this.theadNode.children[y].children[x + (this.params.bodyHeaderType !== 'none' ? 1 : 0)].setAttribute(name, value);
    }
  }, {
    key: "updateHeaderPositions",
    value: function updateHeaderPositions() {
      var top = 0;
      var trNodes = this.theadNode.children;

      for (var y = 0; y < trNodes.length; y++) {
        var thNodes = trNodes[y].children;

        for (var x = 0; x < thNodes.length; x++) {
          thNodes[x].style['top'] = "".concat(top, "px");
        }

        if (y < trNodes.length - 1) {
          top += trNodes[y].clientHeight;
        }
      }
    }
  }, {
    key: "setBodies",
    value: function setBodies(bodies) {
      var height = this.getHeight();
      this.tbodyNode.innerHTML = '';

      for (var y = 0; y < height; y++) {
        var trNode = document.createElement('tr');

        if (this.params.bodyHeaderType !== 'none') {
          var value = this.params.bodyHeaderType === 'value' ? bodies[y][0] : y + 1;
          this.appendBodyHeader(trNode, y, value);
        }

        var offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0;

        for (var x = offsetX; x < bodies[y].length; x++) {
          var tdNode = document.createElement('td');
          this.updateCell(x, y, tdNode);
          tdNode.setAttribute('data-x', x);
          tdNode.setAttribute('data-y', y);
          trNode.appendChild(tdNode);
        }

        this.tbodyNode.appendChild(trNode);
      }

      this.setCursor(0, 0);
    }
  }, {
    key: "appendBodyHeader",
    value: function appendBodyHeader(trNode, y, value) {
      var thNode = document.createElement('th');
      var textNode = document.createTextNode(value);
      thNode.setAttribute('data-y', y);
      thNode.appendChild(textNode);
      trNode.appendChild(thNode);
    }
  }, {
    key: "updateCell",
    value: function updateCell(x, y, tdNode) {
      if (!tdNode) {
        tdNode = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      }

      if (tdNode) {
        var value = this.params.bodies[y][x];
        var type = value == null ? 'number' : _typeof(value);
        var regulation = this.cellRegulations[y][x] || this.columnRegulations[x] || {};
        tdNode.setAttribute('data-type', type);
        tdNode.setAttribute('data-cursor', x === this.cursor.x && y === this.cursor.y);
        tdNode.setAttribute('data-regulation', regulation.type || '');
        tdNode.innerHTML = '';

        if (!this.callRegulation(regulation, 'onUpdateCell', x, y, tdNode)) {
          if (type === 'boolean') {
            tdNode.setAttribute('data-checked', value.toString());
          } else if (value != null) {
            var filterName = this.cellFilters[y][x] || this.columnFilters[x] || '';
            var filterCallback = this.params.filters[filterName];
            var pseudoValue = filterCallback != null ? filterCallback(value) : value;
            var textNode = document.createTextNode(pseudoValue);
            tdNode.appendChild(textNode);
          }
        }
      }
    }
  }, {
    key: "setCellValue",
    value: function setCellValue(x, y, value) {
      var node = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      var type = node.getAttribute('data-type');
      var v = type === 'boolean' ? Boolean(value) : type === 'number' ? value === '' ? null : Number(value) : value;
      this.params.bodies[y][x] = v;
      this.updateCell(x, y, node);
    }
  }, {
    key: "setFocus",
    value: function setFocus(value) {
      this.focusType = value;
      this.containerNode.setAttribute('data-focus', this.focusType === 'Table');
    }
  }, {
    key: "setInputting",
    value: function setInputting(value) {
      this.isInputting = value;
      this.containerNode.setAttribute('data-inputting', this.isInputting);
    }
  }, {
    key: "setupListeners",
    value: function setupListeners() {
      window.addEventListener('click', this.onClick.bind(this), false);
      window.addEventListener('dblclick', this.onDoubleClick.bind(this), false);
      window.addEventListener('keydown', this.onKeyDown.bind(this), false);
      window.addEventListener('keyup', this.onKeyUp.bind(this), false);
      window.addEventListener('resize', this.onResize.bind(this), false);
    }
  }, {
    key: "edit",
    value: function edit(x, y, selected) {
      var _this = this;

      if (this.isInputting) {
        return;
      }

      var tdNode = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));

      if (!tdNode) {
        return;
      }

      var type = tdNode.getAttribute('data-type');
      var regulation = this.cellRegulations[y][x] || this.columnRegulations[x] || {};

      if (!this.callRegulation(regulation, 'onEdit', x, y, tdNode)) {
        if (type === 'boolean') {
          this.params.bodies[y][x] = !this.params.bodies[y][x];
          this.updateCell(x, y);
        } else {
          this.setInputting(true);
          this.setFocus('None');
          tdNode.innerHTML = '';
          var inputNode = null;

          if (type === 'number') {
            inputNode = document.createElement('input');
            inputNode.setAttribute('size', '1');
            inputNode.setAttribute('spellcheck', 'false');
            inputNode.setAttribute('type', 'text');
            inputNode.setAttribute('value', this.params.bodies[y][x] == null ? '' : this.params.bodies[y][x]);
            tdNode.appendChild(inputNode);
          } else {
            inputNode = document.createElement('textarea');
            inputNode.setAttribute('cols', '1');
            inputNode.setAttribute('rows', '1');
            inputNode.setAttribute('spellcheck', 'false');
            inputNode.setAttribute('wrap', 'off');
            inputNode.value = this.params.bodies[y][x];
            tdNode.appendChild(inputNode);
          } // テキストエリアのサイズを内容に合わせる


          this.resizeNodeToFitContent(inputNode);
          inputNode.addEventListener('keydown', function () {
            setTimeout(function () {
              _this.resizeNodeToFitContent(inputNode);
            }, 0);
          }, false);
          var isComposed = false;
          inputNode.addEventListener('keydown', function (event) {
            var keyCode = event.code || event.key; // TODO: Safari で常に false の疑い

            if (event.isComposing) {
              if (keyCode === 'Enter') {
                isComposed = true;
              }
            } else {
              switch (keyCode) {
                case 'Enter':
                  {
                    if (type === 'string') {
                      // 文章内改行
                      // NOTICE: Chrome では onKeyDown で ⌘ ＋ Enter をキャッチできない模様
                      event.preventDefault();

                      if (event.ctrlKey || event.metaKey) {
                        var pos = inputNode.selectionStart;
                        var before = inputNode.value.substr(0, pos);
                        var word = '\n';
                        var after = inputNode.value.substr(pos, inputNode.value.length);
                        inputNode.value = before + word + after;
                        inputNode.setSelectionRange(pos + 1, pos + 1);
                      }
                    }

                    break;
                  }

                case 'Tab':
                  {
                    event.preventDefault();
                    event.stopPropagation();

                    _this.setFocus('Table');

                    _this.setInputting(false);

                    _this.setCellValue(x, y, inputNode.value);

                    if (event.shiftKey) {
                      _this.setCursorToLeft();
                    } else {
                      _this.setCursorToRight();
                    }

                    break;
                  }

                case 'Escape':
                  {
                    event.stopPropagation();

                    _this.setFocus('Table');

                    _this.setInputting(false);

                    _this.updateCell(x, y);

                    break;
                  }
              }
            }
          }, false);
          inputNode.addEventListener('keyup', function (event) {
            var keyCode = event.code || event.key;

            switch (keyCode) {
              case 'Enter':
                {
                  // 編集完了
                  if (!isComposed && !event.ctrlKey && !event.metaKey) {
                    event.preventDefault();
                    event.stopPropagation();

                    _this.setFocus('Table');

                    _this.setInputting(false);

                    _this.setCellValue(x, y, inputNode.value);

                    _this.setCursorToDown();
                  }

                  if (isComposed) {
                    isComposed = false;
                  }

                  break;
                }
            }
          }, false);
          inputNode.addEventListener('blur', function (event) {
            _this.setFocus('Table');

            _this.setInputting(false);

            _this.updateCell(x, y);
          }, false); // NOTICE: DOM ツリー追加後であること

          if (selected) {
            inputNode.addEventListener('focus', inputNode.select, false);
          } else {
            var length = String(this.params.bodies[y][x]).length;
            inputNode.setSelectionRange(length, length);
          }

          inputNode.focus();
        }
      }
    }
  }, {
    key: "resizeNodeToFitContent",
    value: function resizeNodeToFitContent(node) {
      if (node.parentNode) {
        node.style['width'] = 'auto';
        node.style['width'] = "".concat(Math.max(node.scrollWidth, node.parentNode.clientWidth) + 32, "px");
        node.style['height'] = 'auto';
        node.style['height'] = "".concat(Math.max(node.scrollHeight, node.parentNode.clientHeight), "px");
      }
    }
  }, {
    key: "setCursor",
    value: function setCursor(x, y) {
      var enableScroll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (this.isCursorValid(x, y)) {
        var cellOnCursor = this.tableNode.querySelector('[data-cursor="true"]');

        if (cellOnCursor) {
          cellOnCursor.setAttribute('data-cursor', 'false');
        }

        var cell = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));

        if (cell) {
          cell.setAttribute('data-cursor', 'true');

          if (enableScroll) {
            var bodyHeaderNode = this.tbodyNode.querySelector('tr th');
            var offsetLeft = bodyHeaderNode !== null ? bodyHeaderNode.clientWidth : 0;
            var offsetTop = this.theadNode.clientHeight;
            this.scrollIntoView(this.scrollerNode, cell, offsetLeft, offsetTop);
          }

          this.cursor.x = x;
          this.cursor.y = y;
        }
      }
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(scrollNode, targetNode) {
      var offsetLeft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var offsetTop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (scrollNode != null && targetNode != null) {
        var scrollLeft = scrollNode.scrollLeft;
        var scrollWidth = scrollNode.clientWidth;
        var targetLeft = targetNode.offsetLeft;
        var targetWidth = targetNode.clientWidth;
        var scrollTop = scrollNode.scrollTop;
        var scrollHeight = scrollNode.clientHeight;
        var targetTop = targetNode.offsetTop;
        var targetHeight = targetNode.clientHeight;

        if (scrollLeft > targetLeft - offsetLeft) {
          scrollNode.scrollLeft = targetLeft - offsetLeft;
        } else if (scrollLeft + scrollWidth < targetLeft + targetWidth) {
          scrollNode.scrollLeft = targetLeft + targetWidth - scrollWidth;
        }

        if (scrollTop > targetTop - offsetTop) {
          scrollNode.scrollTop = targetTop - offsetTop;
        } else if (scrollTop + scrollHeight < targetTop + targetHeight) {
          scrollNode.scrollTop = targetTop + targetHeight - scrollHeight;
        }
      }
    }
  }, {
    key: "setCursorToLeft",
    value: function setCursorToLeft() {
      this.setCursor(this.cursor.x - 1, this.cursor.y);
    }
  }, {
    key: "setCursorToRight",
    value: function setCursorToRight() {
      this.setCursor(this.cursor.x + 1, this.cursor.y);
    }
  }, {
    key: "setCursorToUp",
    value: function setCursorToUp() {
      this.setCursor(this.cursor.x, this.cursor.y - 1);
    }
  }, {
    key: "setCursorToDown",
    value: function setCursorToDown() {
      this.setCursor(this.cursor.x, this.cursor.y + 1);
    }
  }, {
    key: "setCursorToLeftEnd",
    value: function setCursorToLeftEnd() {
      var offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0;
      this.setCursor(offsetX, this.cursor.y);
    }
  }, {
    key: "setCursorToRightEnd",
    value: function setCursorToRightEnd() {
      this.setCursor(this.getWidth() - 1, this.cursor.y);
    }
  }, {
    key: "setCursorToTop",
    value: function setCursorToTop() {
      this.setCursor(this.cursor.x, 0);
    }
  }, {
    key: "setCursorToBottom",
    value: function setCursorToBottom() {
      this.setCursor(this.cursor.x, this.getHeight() - 1);
    }
  }, {
    key: "isCursorValid",
    value: function isCursorValid(x, y) {
      var offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0;
      return x >= offsetX && y >= 0 && x < this.getWidth() && y < this.getHeight();
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      this.callRegulation('all', 'onClick', event.target);

      if (event.target.closest('.editable-table')) {
        this.setFocus('Table');

        if (event.target.closest('td')) {
          var x = parseInt(event.target.getAttribute('data-x'), 10);
          var y = parseInt(event.target.getAttribute('data-y'), 10);
          this.setCursor(x, y, false);
        }
      } else {
        this.setFocus('None');
      }
    }
  }, {
    key: "onDoubleClick",
    value: function onDoubleClick(event) {
      if (this.focusType === 'Table' && event.target.closest('td')) {
        this.edit(this.cursor.x, this.cursor.y, false);
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      var keyCode = event.code || event.key;

      if (this.focusType === 'Table') {
        if (this.isCursorValid(this.cursor.x, this.cursor.y)) {
          var type = _typeof(this.params.bodies[this.cursor.y][this.cursor.x]);

          var regulation = this.cellRegulations[this.cursor.y][this.cursor.x] || this.columnRegulations[this.cursor.x] || {};

          switch (keyCode) {
            case 'ArrowLeft':
              {
                event.preventDefault(); // TODO: `ctrlKey` + `ArrowLeft` を機能させる

                if (event.ctrlKey || event.metaKey) {
                  this.setCursorToLeftEnd();
                } else {
                  this.setCursorToLeft();
                }

                break;
              }

            case 'ArrowRight':
              {
                event.preventDefault(); // TODO: `ctrlKey` + `ArrowRight` を機能させる

                if (event.ctrlKey || event.metaKey) {
                  this.setCursorToRightEnd();
                } else {
                  this.setCursorToRight();
                }

                break;
              }

            case 'ArrowUp':
              {
                event.preventDefault();

                if (event.ctrlKey || event.metaKey) {
                  this.setCursorToTop();
                } else {
                  this.setCursorToUp();
                }

                break;
              }

            case 'ArrowDown':
              {
                event.preventDefault();

                if (event.ctrlKey || event.metaKey) {
                  this.setCursorToBottom();
                } else {
                  this.setCursorToDown();
                }

                break;
              }

            case 'Tab':
              {
                event.preventDefault();

                if (event.shiftKey) {
                  this.setCursorToLeft();
                } else {
                  this.setCursorToRight();
                }

                break;
              }

            case ' ':
            case 'Space':
              {
                event.preventDefault();
                this.edit(this.cursor.x, this.cursor.y, type !== 'boolean');
                break;
              }

            case 'Backspace':
              {
                event.preventDefault();

                if (regulation.type == null) {
                  this.setCellValue(this.cursor.x, this.cursor.y, '');
                }

                break;
              }

            case 'Escape':
              {
                event.preventDefault();
                this.setFocus('None');
                break;
              }

            case 'KeyC':
              {
                if (event.ctrlKey || event.metaKey) {
                  event.preventDefault();
                  this.copyCell(this.cursor.x, this.cursor.y, type, regulation);
                } else {
                  this.onEtceteraKeyDown(type, regulation, event);
                }

                break;
              }

            case 'KeyV':
              {
                if (event.ctrlKey || event.metaKey) {
                  event.preventDefault();
                  this.pasteCell(this.cursor.x, this.cursor.y, type, regulation);
                } else {
                  this.onEtceteraKeyDown(type, regulation, event);
                }

                break;
              }

            default:
              {
                this.onEtceteraKeyDown(type, regulation, event);
                break;
              }
          }
        } else {
          switch (keyCode) {
            case 'Escape':
              {
                event.preventDefault();
                this.setFocus('None');
                break;
              }
          }
        }
      } else {
        this.callRegulation('all', 'onKeyDown', keyCode);
      }
    }
  }, {
    key: "onEtceteraKeyDown",
    value: function onEtceteraKeyDown(type, regulation, event) {
      if (type !== 'boolean' && regulation.type == null) {
        if (event.key.length === 1) {
          var charCode = event.key.charCodeAt(0);

          if (charCode >= 32 && charCode <= 126) {
            this.edit(this.cursor.x, this.cursor.y, true);
            return;
          }
        }
      }
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(event) {
      var keyCode = event.code || event.key;

      if (this.focusType === 'Table') {
        switch (keyCode) {
          case 'Enter':
            {
              this.edit(this.cursor.x, this.cursor.y, false);
              break;
            }
        }
      } else {
        this.callRegulation('all', 'onKeyUp', keyCode);
      }
    }
  }, {
    key: "copyCell",
    value: function copyCell(x, y, type, regulation) {
      if (!this.callRegulation(regulation, 'onCopyCell', x, y)) {
        this.clipboard.type = type;
        this.clipboard.regulation = regulation;
        this.clipboard.value = this.params.bodies[y][x];
      }
    }
  }, {
    key: "pasteCell",
    value: function pasteCell(x, y, type, regulation) {
      if (this.clipboard.type === type && this.clipboard.regulation.type === regulation.type) {
        if (!this.callRegulation(regulation, 'onPasteCell', x, y)) {
          this.params.bodies[y][x] = this.clipboard.value;
          this.updateCell(x, y);
        }
      }
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.updateHeaderPositions();
    }
  }, {
    key: "callRegulation",
    value: function callRegulation(regulation, eventName) {
      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
      }

      for (var i = 0; i < this.regulations.length; i++) {
        if ((regulation === 'all' || this.regulations[i].type === regulation.type) && this.regulations[i][eventName] != null) {
          var _this$regulations$i;

          if (!(_this$regulations$i = this.regulations[i])[eventName].apply(_this$regulations$i, [this, regulation].concat(params))) {
            return true;
          }
        }
      }

      return false;
    }
  }]);

  return EditableTable;
}();

module.exports = EditableTable;
},{"./src/button-regulation.js":"src/button-regulation.js","./src/link-regulation.js":"src/link-regulation.js","./src/select-regulation.js":"src/select-regulation.js"}]},{},["editable-table.js"], "EditableTable")