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
})({"editable-table.scss":[function(require,module,exports) {

},{}],"editable-table.js":[function(require,module,exports) {
"use strict";

require("./editable-table.scss");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FocusType = {
  None: 0,
  Table: 1,
  Listbox: 2
};

var EditableTable = /*#__PURE__*/function () {
  function EditableTable(params) {
    _classCallCheck(this, EditableTable);

    this.params = params;
    this.params.headers = this.params.headers || [];
    this.params.bodies = this.params.bodies || [];
    this.params.forceConversion = !!this.params.forceConversion;
    this.focus = !!this.params.focus ? FocusType.Table : FocusType.None;
    this.regulations = [];
    this.containerNode = null;
    this.tableNode = null;
    this.theadNode = null;
    this.tbodyNode = null;
    this.cursor = {
      x: 0,
      y: 0
    };
    this.isInputting = false;
    this.listboxNode = null;
    this.listboxSelectedIndex = 0;
    this.appendTable();
    this.setupLlistbox();
  }

  _createClass(EditableTable, [{
    key: "appendTable",
    value: function appendTable() {
      this.containerNode = document.createElement('div');
      this.tableNode = document.createElement('table');
      this.theadNode = document.createElement('thead');
      this.tbodyNode = document.createElement('tbody');
      this.containerNode.setAttribute('class', 'editable-table');
      this.updateHeaders();
      this.updateBodies();
      this.tableNode.appendChild(this.theadNode);
      this.tableNode.appendChild(this.tbodyNode);
      this.containerNode.appendChild(this.tableNode);
      this.params.containerNode.appendChild(this.containerNode);
      this.setFocus(this.focus);
      window.addEventListener('click', this.onClick.bind(this), false);
      window.addEventListener('dblclick', this.onDoubleClick.bind(this), false);
      window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }
  }, {
    key: "updateHeaders",
    value: function updateHeaders() {
      if (this.params.headers.length > 0) {
        var trNode = document.createElement('tr');
        this.appendHeader(trNode, '');

        for (var i = 0; i < this.params.headers.length; i++) {
          this.appendHeader(trNode, this.params.headers[i]);
        }

        this.theadNode.appendChild(trNode);
      }
    }
  }, {
    key: "appendHeader",
    value: function appendHeader(trNode, text) {
      var thNode = document.createElement('th');
      var textNode = document.createTextNode(text);
      thNode.appendChild(textNode);
      trNode.appendChild(thNode);
    }
  }, {
    key: "updateBodies",
    value: function updateBodies() {
      var height = this.getHeight();

      for (var y = 0; y < height; y++) {
        var trNode = document.createElement('tr');
        this.appendBodyHeader(trNode, y);

        for (var x = 0; x < this.params.bodies[y].length; x++) {
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
    value: function appendBodyHeader(trNode, y) {
      var thNode = document.createElement('th');
      var textNode = document.createTextNode(y + 1);
      thNode.setAttribute('data-y', y);
      thNode.appendChild(textNode);
      trNode.appendChild(thNode);
    }
  }, {
    key: "updateCell",
    value: function updateCell(x, y, tdNode) {
      var _this = this;

      if (!tdNode) {
        tdNode = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));
      }

      if (tdNode) {
        var type = _typeof(this.params.bodies[y][x]);

        var regulation = this.regulations[y][x];
        tdNode.setAttribute('data-type', type);
        tdNode.setAttribute('data-cursor', x === this.cursor.x && y === this.cursor.y);
        tdNode.setAttribute('data-regulation', regulation.type || '');
        tdNode.innerHTML = '';

        if (regulation.type === 'button') {
          var buttonNode = document.createElement('div');
          var textNode = document.createTextNode(this.params.bodies[y][x]);
          buttonNode.setAttribute('class', 'editable-table__button');
          buttonNode.addEventListener('click', function () {
            _this.setCursor(x, y, false);

            regulation.callback(x, y);
          }, false);
          buttonNode.appendChild(textNode);
          tdNode.appendChild(buttonNode);
        } else if (type === 'boolean') {
          tdNode.setAttribute('data-checked', this.params.bodies[y][x].toString());
        } else {
          var _textNode = document.createTextNode(this.params.bodies[y][x]);

          tdNode.appendChild(_textNode);
        }
      }
    }
  }, {
    key: "setSampleData",
    value: function setSampleData(rowNumber, columnNumber) {
      var options = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.params.headers.splice(0);

      for (var i = 0; i < columnNumber; i++) {
        var value = String.fromCharCode(65 + i);
        this.params.headers.push(value);
      }

      this.params.bodies.splice(0);

      for (var y = 0; y < rowNumber; y++) {
        this.params.bodies[y] = [];

        for (var x = 0; x < columnNumber; x++) {
          var _value = x % 5 === 0 ? Math.random() >= 0.5 : x % 5 === 1 ? Math.floor(Math.random() * 201) - 100 : x % 5 === 2 ? String.fromCharCode(65 + x) + y : x % 5 === 3 ? options[Math.floor(Math.random() * options.length)] : 'Button';

          this.params.bodies[y].push(_value);
        }
      }

      this.resetRegulations();

      for (var _y = 0; _y < rowNumber; _y++) {
        for (var _x = 0; _x < columnNumber; _x++) {
          if (_x % 5 === 3) {
            this.setCellRegulation(_x, _y, {
              type: 'select',
              options: options
            });
          } else if (_x % 5 === 4) {
            this.setCellRegulation(_x, _y, {
              type: 'button',
              callback: function callback(x, y) {
                alert("[ ".concat(x + 1, ", ").concat(y + 1, " ] clicked!"));
              }
            });
          }
        }
      }

      this.updateHeaders();
      this.updateBodies();
    }
  }, {
    key: "resetRegulations",
    value: function resetRegulations() {
      this.regulations.splice(0);
      var xLength = this.getWidth();
      var yLength = this.getHeight();

      for (var y = 0; y < yLength; y++) {
        this.regulations[y] = [];

        for (var x = 0; x < xLength; x++) {
          this.regulations[y][x] = [];
        }
      }
    }
  }, {
    key: "setupLlistbox",
    value: function setupLlistbox() {
      this.listboxNode = document.createElement('ol');
      this.listboxNode.setAttribute('class', 'editable-table__listbox');
      this.listboxNode.style['display'] = 'none';
      this.containerNode.appendChild(this.listboxNode);
    }
  }, {
    key: "openListbox",
    value: function openListbox(targetNode, options) {
      var _this2 = this;

      var selectedItemNode = null;
      this.setFocus(FocusType.Listbox);
      this.listboxNode.innerHTML = '';

      var _loop = function _loop(i) {
        var itemNode = document.createElement('li');
        var textNode = document.createTextNode(options[i]);

        if (i === _this2.listboxSelectedIndex) {
          selectedItemNode = itemNode;
        }

        itemNode.setAttribute('data-selected', i === _this2.listboxSelectedIndex);
        itemNode.addEventListener('click', function (event) {
          _this2.onClickListboxItem(i);
        }, false);
        itemNode.appendChild(textNode);

        _this2.listboxNode.appendChild(itemNode);
      };

      for (var i = 0; i < options.length; i++) {
        _loop(i);
      }

      this.listboxNode.style['max-height'] = '';
      this.listboxNode.style['opacity'] = '0';
      this.listboxNode.style['display'] = ''; // TODO: ポジショニングを改善する

      var box = targetNode.getBoundingClientRect();
      var margin = 16;
      var left = box.left - 1;
      var top = 0;
      var maxHeight = -1;

      if (this.listboxNode.clientHeight < document.documentElement.clientHeight) {
        if (this.listboxNode.clientHeight + (targetNode.offsetTop - this.containerNode.scrollTop) < document.documentElement.clientHeight) {
          top = box.top - 1;
        } else {
          top = document.documentElement.clientHeight - this.listboxNode.clientHeight - margin;
        }
      } else {
        top = margin;
        maxHeight = document.documentElement.clientHeight - margin * 2;
      }

      this.listboxNode.style['left'] = "".concat(left, "px");
      this.listboxNode.style['top'] = "".concat(top, "px");

      if (maxHeight !== -1) {
        this.listboxNode.style['max-height'] = "".concat(maxHeight, "px");
      }

      this.listboxNode.style['opacity'] = '';
      selectedItemNode.scrollIntoView({
        block: 'center',
        inline: 'center'
      });
    }
  }, {
    key: "onClickListboxItem",
    value: function onClickListboxItem(index) {
      this.listboxSelectedIndex = index;
      this.updateListboxToCell(this.cursor.x, this.cursor.y);
    }
  }, {
    key: "closeListbox",
    value: function closeListbox() {
      this.listboxNode.style['display'] = 'none';
      this.setFocus(FocusType.Table);
    }
  }, {
    key: "addListboxSelectedIndex",
    value: function addListboxSelectedIndex(adding, options) {
      this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'false');
      this.listboxSelectedIndex += adding;
      this.listboxSelectedIndex = Math.max(0, Math.min(options.length - 1, this.listboxSelectedIndex));
      this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'true');
      this.listboxNode.children[this.listboxSelectedIndex].scrollIntoView({
        block: 'center',
        inline: 'center'
      });
    }
  }, {
    key: "updateListboxToCell",
    value: function updateListboxToCell(x, y) {
      var regulation = this.regulations[y][x];
      var value = regulation.options[this.listboxSelectedIndex];
      this.params.bodies[y][x] = value;
      this.updateCell(x, y);
    }
  }, {
    key: "setCellRegulation",
    value: function setCellRegulation(x, y, params) {
      this.regulations[y][x].type = params.type;

      if (params.callback != null) {
        this.regulations[y][x].callback = params.callback;
      }

      if (params.options != null) {
        this.regulations[y][x].options = params.options;
      }
    }
  }, {
    key: "setFocus",
    value: function setFocus(value) {
      this.focus = value;
      this.containerNode.setAttribute('data-focus', this.focus === FocusType.Table);
    }
  }, {
    key: "setInputting",
    value: function setInputting(value) {
      this.isInputting = value;
      this.containerNode.setAttribute('data-inputting', this.isInputting);
    }
  }, {
    key: "edit",
    value: function edit(x, y, selected) {
      var _this3 = this;

      if (this.isInputting) {
        return;
      }

      var node = this.tableNode.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"));

      if (!node) {
        return;
      }

      var type = node.getAttribute('data-type');
      var regulation = this.regulations[y][x];

      if (regulation.type === 'button') {
        regulation.callback(x, y);
      } else if (regulation.type === 'select') {
        this.listboxSelectedIndex = 0;

        for (var i = 0; i < regulation.options.length; i++) {
          if (regulation.options[i] === this.params.bodies[y][x]) {
            this.listboxSelectedIndex = i;
            break;
          }
        }

        this.openListbox(node, regulation.options);
      } else if (type === 'boolean') {
        this.params.bodies[y][x] = !this.params.bodies[y][x];
        this.updateCell(x, y);
      } else {
        this.setInputting(true);
        this.setFocus(FocusType.None);
        node.innerHTML = '';
        var inputNode = document.createElement('input');
        inputNode.setAttribute('type', 'text');
        inputNode.setAttribute('value', this.params.bodies[y][x]);
        inputNode.addEventListener('keydown', function (event) {
          // TODO: Safari で常に false の疑い
          if (!event.isComposing) {
            if (event.code === 'Enter' || event.code === 'Tab') {
              event.preventDefault();
              event.stopPropagation();

              _this3.setFocus(FocusType.Table);

              _this3.setInputting(false);

              if (_this3.params.forceConversion) {
                var value = type === 'boolean' ? Boolean(inputNode.value) : type === 'number' ? Number(inputNode.value) : inputNode.value;
                _this3.params.bodies[y][x] = value;
              } else {
                _this3.params.bodies[y][x] = inputNode.value;
              }

              _this3.updateCell(x, y);

              if (event.code === 'Enter') {
                _this3.setCursorToDown();
              } else if (event.code === 'Tab') {
                if (event.shiftKey) {
                  _this3.setCursorToLeft();
                } else {
                  _this3.setCursorToRight();
                }
              }
            } else if (event.code === 'Escape') {
              event.stopPropagation();

              _this3.setFocus(FocusType.Table);

              _this3.setInputting(false);

              _this3.updateCell(x, y);
            }
          }
        });
        inputNode.addEventListener('blur', function (event) {
          _this3.setFocus(FocusType.Table);

          _this3.setInputting(false);

          _this3.updateCell(x, y);
        }, false);
        node.appendChild(inputNode); // NOTICE: DOM ツリー追加後であること

        if (selected) {
          inputNode.addEventListener('focus', inputNode.select, false);
        } else {
          var length = String(this.params.bodies[y][x]).length;
          inputNode.setSelectionRange(length, length);
        }

        inputNode.focus();
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
            cell.scrollIntoView({
              block: 'center',
              inline: 'center'
            });
          }

          this.cursor.x = x;
          this.cursor.y = y;
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
      this.setCursor(0, this.cursor.y);
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
    key: "setCursorToNext",
    value: function setCursorToNext() {
      var _this$cursor = this.cursor,
          x = _this$cursor.x,
          y = _this$cursor.y;

      if (this.isCursorValid(x - 1, y)) {
        this.setCursor(x - 1, y);
      } else if (this.isCursorValid(this.getWidth() - 1, y - 1)) {
        this.setCursor(this.getWidth() - 1, y - 1);
      } else {
        this.setCursor(this.getWidth() - 1, this.getHeight() - 1);
      }
    }
  }, {
    key: "setCursorToPrevious",
    value: function setCursorToPrevious() {
      var _this$cursor2 = this.cursor,
          x = _this$cursor2.x,
          y = _this$cursor2.y;

      if (this.isCursorValid(x + 1, y)) {
        this.setCursor(x + 1, y);
      } else if (this.isCursorValid(0, y + 1)) {
        this.setCursor(0, y + 1);
      } else {
        this.setCursor(0, 0);
      }
    }
  }, {
    key: "isCursorValid",
    value: function isCursorValid(x, y) {
      return x >= 0 && y >= 0 && x < this.getWidth() && y < this.getHeight();
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.params.bodies.length > 0 ? this.params.bodies[0].length : 0;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.params.bodies.length;
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      if (event.target.closest('.editable-table')) {
        this.setFocus(FocusType.Table);
        this.closeListbox();

        if (event.target.closest('td')) {
          var x = parseInt(event.target.getAttribute('data-x'), 10);
          var y = parseInt(event.target.getAttribute('data-y'), 10);
          this.setCursor(x, y, false);
        }
      } else {
        this.setFocus(FocusType.None);
      }
    }
  }, {
    key: "onDoubleClick",
    value: function onDoubleClick(event) {
      if (this.focus === FocusType.Table) {
        this.edit(this.cursor.x, this.cursor.y, false);
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      if (this.focus === FocusType.Table) {
        var type = _typeof(this.params.bodies[this.cursor.y][this.cursor.x]);

        var regulation = this.regulations[this.cursor.y][this.cursor.x];

        switch (event.code) {
          case 'ArrowLeft':
            {
              event.preventDefault();

              if (event.metaKey) {
                this.setCursorToLeftEnd();
              } else {
                this.setCursorToLeft();
              }

              break;
            }

          case 'ArrowRight':
            {
              event.preventDefault();

              if (event.metaKey) {
                this.setCursorToRightEnd();
              } else {
                this.setCursorToRight();
              }

              break;
            }

          case 'ArrowUp':
            {
              event.preventDefault();

              if (event.metaKey) {
                this.setCursorToTop();
              } else {
                this.setCursorToUp();
              }

              break;
            }

          case 'ArrowDown':
            {
              event.preventDefault();

              if (event.metaKey) {
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
                this.setCursorToNext();
              } else {
                this.setCursorToPrevious();
              }

              break;
            }

          case 'Enter':
            {
              this.edit(this.cursor.x, this.cursor.y, false);
              break;
            }

          case 'Space':
            {
              if (type === 'boolean') {
                event.preventDefault();
                this.edit(this.cursor.x, this.cursor.y, false);
              } else {
                if (type === 'boolean' || regulation.type === 'button' || regulation.type === 'select') {
                  event.preventDefault();
                }

                this.onEtceteraKeyDown(event);
              }

              break;
            }

          case 'Escape':
            {
              this.setFocus(FocusType.None);
              break;
            }

          default:
            {
              if (type !== 'boolean' && regulation.type !== 'button' && regulation.type !== 'select') {
                this.onEtceteraKeyDown(event);
              }

              break;
            }
        }
      } else if (this.focus === FocusType.Listbox) {
        var _regulation = this.regulations[this.cursor.y][this.cursor.x];

        switch (event.code) {
          case 'ArrowUp':
            {
              event.preventDefault();
              this.addListboxSelectedIndex(-1, _regulation.options);
              break;
            }

          case 'ArrowDown':
            {
              event.preventDefault();
              this.addListboxSelectedIndex(1, _regulation.options);
              break;
            }

          case 'Tab':
            {
              event.preventDefault();
              this.closeListbox();

              if (event.shiftKey) {
                this.setCursorToNext();
              } else {
                this.setCursorToPrevious();
              }

              break;
            }

          case 'Enter':
            {
              this.updateListboxToCell(this.cursor.x, this.cursor.y);
              this.closeListbox();
              this.setCursorToDown();
              break;
            }

          case 'Space':
            {
              event.preventDefault();
              this.updateListboxToCell(this.cursor.x, this.cursor.y);
              this.closeListbox();
              break;
            }

          case 'Escape':
            {
              this.closeListbox();
              break;
            }
        }
      }
    }
  }, {
    key: "onEtceteraKeyDown",
    value: function onEtceteraKeyDown(event) {
      if (event.key.length === 1) {
        var charCode = event.key.charCodeAt(0);

        if (charCode >= 32 && charCode <= 126) {
          this.edit(this.cursor.x, this.cursor.y, true);
          return;
        }
      }
    }
  }]);

  return EditableTable;
}();

module.exports = EditableTable;
},{"./editable-table.scss":"editable-table.scss"}]},{},["editable-table.js"], "EditableTable")