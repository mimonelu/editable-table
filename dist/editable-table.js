parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"IsZn":[function(require,module,exports) {
function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function i(t,e,i){return e&&s(t.prototype,e),i&&s(t,i),t}var o={None:0,Table:1,Listbox:2},a=function(){function s(t){e(this,s),this.params=t,this.focus=this.params.autofocus?o.Table:o.None,this.columnRegulations=[],this.cellRegulations=[],this.containerNode=null,this.tableNode=null,this.theadNode=null,this.tbodyNode=null,this.cursor={x:0,y:0},this.isInputting=!1,this.clipboard={type:null,regulation:null,value:null},this.listboxNode=null,this.listboxSelectedIndex=0,this.setupTable(),this.setupLlistbox()}return i(s,[{key:"setupTable",value:function(){this.containerNode=document.createElement("div"),this.tableNode=document.createElement("table"),this.theadNode=document.createElement("thead"),this.tbodyNode=document.createElement("tbody"),this.containerNode.setAttribute("class","editable-table__container"),this.setColumnRegulations(this.params.columnRegulations),this.resetCellRegulations(),this.updateHeaders(),this.setHeaderSpans(this.params.headerSpans),this.updateBodies(),this.tableNode.appendChild(this.theadNode),this.tableNode.appendChild(this.tbodyNode),this.containerNode.appendChild(this.tableNode),this.params.containerNode.appendChild(this.containerNode),this.updateHeaderPositions(),this.setFocus(this.focus),window.addEventListener("click",this.onClick.bind(this),!1),window.addEventListener("dblclick",this.onDoubleClick.bind(this),!1),window.addEventListener("keydown",this.onKeyDown.bind(this),!1),window.addEventListener("keyup",this.onKeyUp.bind(this),!1),window.addEventListener("resize",this.onResize.bind(this),!1)}},{key:"updateHeaders",value:function(){if(this.theadNode.innerHTML="",null!=this.params.headers&&this.params.headers.length>0){for(var t=null,e=0;e<this.params.headers.length;e++){var s=document.createElement("tr");0===e&&"none"!==this.params.bodyHeaderType&&(t=this.appendHeader(s,""));for(var i=0;i<this.params.headers[e].length;i++)this.appendHeader(s,this.params.headers[e][i]);this.theadNode.appendChild(s)}null!==t&&t.setAttribute("rowspan","2")}}},{key:"appendHeader",value:function(t,e){var s=document.createElement("th"),i=document.createTextNode(e);return s.appendChild(i),t.appendChild(s),s}},{key:"updateHeaderPositions",value:function(){for(var t=0,e=this.theadNode.children,s=0;s<e.length;s++){for(var i=e[s].children,o=0;o<i.length;o++)i[o].style.top="".concat(t,"px");s<e.length-1&&(t+=e[s].clientHeight)}}},{key:"setHeaderSpans",value:function(t){if(null!=t&&null!=this.params.headers)for(var e=0;e<this.params.headers.length;e++)for(var s=0;s<this.params.headers[e].length;s++)null!=t[e]&&null!=t[e][s]&&(null!=t[e][s].x&&this.setHeaderAttribute(s,e,"colspan",t[e][s].x),null!=t[e][s].y&&this.setHeaderAttribute(s,e,"rowspan",t[e][s].y))}},{key:"setHeaderAttribute",value:function(t,e,s,i){this.theadNode.children[e].children[t+("none"!==this.params.bodyHeaderType?1:0)].setAttribute(s,i)}},{key:"updateBodies",value:function(){var t=this.getHeight();this.tbodyNode.innerHTML="";for(var e=0;e<t;e++){var s=document.createElement("tr");if("none"!==this.params.bodyHeaderType){var i="value"===this.params.bodyHeaderType?this.params.bodies[e][0]:e+1;this.appendBodyHeader(s,e,i)}for(var o="value"===this.params.bodyHeaderType?1:0;o<this.params.bodies[e].length;o++){var a=document.createElement("td");this.updateCell(o,e,a),a.setAttribute("data-x",o),a.setAttribute("data-y",e),s.appendChild(a)}this.tbodyNode.appendChild(s)}this.setCursor(0,0)}},{key:"appendBodyHeader",value:function(t,e,s){var i=document.createElement("th"),o=document.createTextNode(s);i.setAttribute("data-y",e),i.appendChild(o),t.appendChild(i)}},{key:"updateCell",value:function(e,s,i){var o=this;if(i||(i=this.tableNode.querySelector('[data-x="'.concat(e,'"][data-y="').concat(s,'"]'))),i){var a=null==this.params.bodies[s][e]?"number":t(this.params.bodies[s][e]),r=this.cellRegulations[s][e]||this.columnRegulations[e]||{};if(i.setAttribute("data-type",a),i.setAttribute("data-cursor",e===this.cursor.x&&s===this.cursor.y),i.setAttribute("data-regulation",r.type||""),i.innerHTML="","button"===r.type){var n=document.createElement("div"),l=document.createTextNode(this.params.bodies[s][e]);n.addEventListener("click",function(){o.setCursor(e,s,!1),r.callback(e,s)},!1),n.appendChild(l),i.appendChild(n)}else if("boolean"===a)i.setAttribute("data-checked",this.params.bodies[s][e].toString());else if(null!=this.params.bodies[s][e]){var u=document.createTextNode(this.params.bodies[s][e]);i.appendChild(u)}}}},{key:"setCell",value:function(t,e,s){var i=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]')),o=i.getAttribute("data-type"),a="boolean"===o?Boolean(s):"number"===o?""===s?null:Number(s):s;this.params.bodies[e][t]=a,this.updateCell(t,e,i)}},{key:"traverse",value:function(t){for(var e=this.getWidth(),s=this.getHeight(),i=0;i<s;i++)for(var o=0;o<e;o++)t(o,i)}},{key:"resetCellRegulations",value:function(){this.cellRegulations.splice(0);for(var t=this.getWidth(),e=this.getHeight(),s=0;s<e;s++){this.cellRegulations[s]=[];for(var i=0;i<t;i++)this.cellRegulations[s][i]=null}}},{key:"setupLlistbox",value:function(){this.listboxNode=document.createElement("ol"),this.listboxNode.setAttribute("class","editable-table__listbox"),this.listboxNode.style.display="none",this.params.containerNode.appendChild(this.listboxNode)}},{key:"openListbox",value:function(t,e){var s=this.updateListboxChildren(e);this.adjustListboxIntoView(t),this.scrollIntoView(this.listboxNode,s,0,0),this.setFocus(o.Listbox)}},{key:"updateListboxChildren",value:function(t){var e=this,s=null;this.listboxNode.innerHTML="";for(var i=function(i){var o=document.createElement("li"),a=document.createTextNode(t[i]);i===e.listboxSelectedIndex&&(s=o),o.setAttribute("data-selected",i===e.listboxSelectedIndex),o.addEventListener("click",function(t){e.onClickListboxItem(i)},!1),o.appendChild(a),e.listboxNode.appendChild(o)},o=0;o<t.length;o++)i(o);return s}},{key:"onClickListboxItem",value:function(t){this.listboxSelectedIndex=t,this.updateListboxToCell(this.cursor.x,this.cursor.y)}},{key:"closeListbox",value:function(){this.listboxNode.style.display="none",this.setFocus(o.Table)}},{key:"addListboxSelectedIndex",value:function(t,e){this.listboxNode.children[this.listboxSelectedIndex].setAttribute("data-selected","false"),this.listboxSelectedIndex+=t,this.listboxSelectedIndex=Math.max(0,Math.min(e.length-1,this.listboxSelectedIndex)),this.listboxNode.children[this.listboxSelectedIndex].setAttribute("data-selected","true"),this.scrollIntoView(this.listboxNode,this.listboxNode.children[this.listboxSelectedIndex],0,0)}},{key:"updateListboxToCell",value:function(t,e){var s=(this.cellRegulations[e][t]||this.columnRegulations[t]||{}).options[this.listboxSelectedIndex];this.params.bodies[e][t]=s,this.updateCell(t,e)}},{key:"adjustListboxIntoView",value:function(t){this.listboxNode.style.opacity="0",this.listboxNode.style.display="",this.listboxNode.style["max-height"]="";var e=t.getBoundingClientRect(),s=e.left,i=e.top,o=Math.min(this.listboxNode.clientHeight,document.documentElement.clientHeight)-2*(this.params.listboxMargin||0);i-=Math.abs(Math.min(document.documentElement.clientHeight-(i+o+(this.params.listboxMargin||0)),0)),this.listboxNode.style.left="".concat(s,"px"),this.listboxNode.style.top="".concat(i,"px"),this.listboxNode.style["max-height"]="".concat(o,"px"),this.listboxNode.style.opacity=""}},{key:"setColumnRegulations",value:function(t){this.columnRegulations=[];for(var e=0;e<t.length;e++)this.columnRegulations[e]=t[e]}},{key:"setCellRegulation",value:function(t,e,s){for(var i in this.cellRegulations[e][t]={},s)this.cellRegulations[e][t][i]=s[i]}},{key:"setFocus",value:function(t){this.focus=t,this.containerNode.setAttribute("data-focus",this.focus===o.Table)}},{key:"setInputting",value:function(t){this.isInputting=t,this.containerNode.setAttribute("data-inputting",this.isInputting)}},{key:"edit",value:function(t,e,s){var i=this;if(!this.isInputting){var a=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]'));if(a){var r=a.getAttribute("data-type"),n=this.cellRegulations[e][t]||this.columnRegulations[t]||{};if("button"===n.type)n.callback(t,e);else if("select"===n.type){this.listboxSelectedIndex=0;for(var l=0;l<n.options.length;l++)if(n.options[l]===this.params.bodies[e][t]){this.listboxSelectedIndex=l;break}n.options.length>0&&this.openListbox(a,n.options)}else if("boolean"===r)this.params.bodies[e][t]=!this.params.bodies[e][t],this.updateCell(t,e);else{this.setInputting(!0),this.setFocus(o.None),a.innerHTML="";var u=null;"number"===r?((u=document.createElement("input")).setAttribute("size","1"),u.setAttribute("spellcheck","false"),u.setAttribute("type","text"),u.setAttribute("value",null==this.params.bodies[e][t]?"":this.params.bodies[e][t]),a.appendChild(u)):((u=document.createElement("textarea")).setAttribute("cols","1"),u.setAttribute("rows","1"),u.setAttribute("spellcheck","false"),u.setAttribute("wrap","off"),u.value=this.params.bodies[e][t],a.appendChild(u)),this.resizeNodeToFitContent(u),u.addEventListener("keydown",function(){setTimeout(function(){i.resizeNodeToFitContent(u)},0)},!1);var h=!1;if(u.addEventListener("keydown",function(s){var a=s.code||s.key;if(s.isComposing)"Enter"===a&&(h=!0);else switch(a){case"Enter":if("string"===r&&(s.preventDefault(),s.ctrlKey||s.metaKey)){var n=u.selectionStart,l=u.value.substr(0,n),c=u.value.substr(n,u.value.length);u.value=l+"\n"+c,u.setSelectionRange(n+1,n+1)}break;case"Tab":s.preventDefault(),s.stopPropagation(),i.setFocus(o.Table),i.setInputting(!1),i.setCell(t,e,u.value),s.shiftKey?i.setCursorToLeft():i.setCursorToRight();break;case"Escape":s.stopPropagation(),i.setFocus(o.Table),i.setInputting(!1),i.updateCell(t,e)}},!1),u.addEventListener("keyup",function(s){switch(s.code||s.key){case"Enter":h||s.ctrlKey||s.metaKey||(s.preventDefault(),s.stopPropagation(),i.setFocus(o.Table),i.setInputting(!1),i.setCell(t,e,u.value),i.setCursorToDown()),h&&(h=!1)}},!1),u.addEventListener("blur",function(s){i.setFocus(o.Table),i.setInputting(!1),i.updateCell(t,e)},!1),s)u.addEventListener("focus",u.select,!1);else{var c=String(this.params.bodies[e][t]).length;u.setSelectionRange(c,c)}u.focus()}}}}},{key:"resizeNodeToFitContent",value:function(t){t.parentNode&&(t.style.width="auto",t.style.width="".concat(Math.max(t.scrollWidth,t.parentNode.clientWidth)+32,"px"),t.style.height="auto",t.style.height="".concat(Math.max(t.scrollHeight,t.parentNode.clientHeight),"px"))}},{key:"setCursor",value:function(t,e){var s=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(this.isCursorValid(t,e)){var i=this.tableNode.querySelector('[data-cursor="true"]');i&&i.setAttribute("data-cursor","false");var o=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]'));if(o){if(o.setAttribute("data-cursor","true"),s){var a=this.tbodyNode.querySelector("tr th"),r=null!==a?a.clientWidth:0,n=this.theadNode.clientHeight;this.scrollIntoView(this.containerNode,o,r,n)}this.cursor.x=t,this.cursor.y=e}}}},{key:"scrollIntoView",value:function(t,e){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if(null!=t&&null!=e){var o=t.scrollLeft,a=t.clientWidth,r=e.offsetLeft,n=e.clientWidth,l=t.scrollTop,u=t.clientHeight,h=e.offsetTop,c=e.clientHeight;o>r-s?t.scrollLeft=r-s:o+a<r+n&&(t.scrollLeft=r+n-a),l>h-i?t.scrollTop=h-i:l+u<h+c&&(t.scrollTop=h+c-u)}}},{key:"setCursorToLeft",value:function(){this.setCursor(this.cursor.x-1,this.cursor.y)}},{key:"setCursorToRight",value:function(){this.setCursor(this.cursor.x+1,this.cursor.y)}},{key:"setCursorToUp",value:function(){this.setCursor(this.cursor.x,this.cursor.y-1)}},{key:"setCursorToDown",value:function(){this.setCursor(this.cursor.x,this.cursor.y+1)}},{key:"setCursorToLeftEnd",value:function(){var t="value"===this.params.bodyHeaderType?1:0;this.setCursor(t,this.cursor.y)}},{key:"setCursorToRightEnd",value:function(){this.setCursor(this.getWidth()-1,this.cursor.y)}},{key:"setCursorToTop",value:function(){this.setCursor(this.cursor.x,0)}},{key:"setCursorToBottom",value:function(){this.setCursor(this.cursor.x,this.getHeight()-1)}},{key:"isCursorValid",value:function(t,e){return t>=("value"===this.params.bodyHeaderType?1:0)&&e>=0&&t<this.getWidth()&&e<this.getHeight()}},{key:"getWidth",value:function(){return null==this.params.bodies?0:this.params.bodies.length>0?this.params.bodies[0].length:0}},{key:"getHeight",value:function(){return null==this.params.bodies?0:this.params.bodies.length}},{key:"onClick",value:function(t){if(t.target.closest(".editable-table__container")||t.target.closest(".editable-table__listbox")){if(this.setFocus(o.Table),this.closeListbox(),t.target.closest("td")){var e=parseInt(t.target.getAttribute("data-x"),10),s=parseInt(t.target.getAttribute("data-y"),10);this.setCursor(e,s,!1)}}else this.setFocus(o.None)}},{key:"onDoubleClick",value:function(t){this.focus===o.Table&&t.target.closest("td")&&this.edit(this.cursor.x,this.cursor.y,!1)}},{key:"onKeyDown",value:function(e){var s=e.code||e.key;if(this.focus===o.Table)if(this.isCursorValid(this.cursor.x,this.cursor.y)){var i=t(this.params.bodies[this.cursor.y][this.cursor.x]),a=this.cellRegulations[this.cursor.y][this.cursor.x]||this.columnRegulations[this.cursor.x]||{};switch(s){case"ArrowLeft":e.preventDefault(),e.ctrlKey||e.metaKey?this.setCursorToLeftEnd():this.setCursorToLeft();break;case"ArrowRight":e.preventDefault(),e.ctrlKey||e.metaKey?this.setCursorToRightEnd():this.setCursorToRight();break;case"ArrowUp":e.preventDefault(),e.ctrlKey||e.metaKey?this.setCursorToTop():this.setCursorToUp();break;case"ArrowDown":e.preventDefault(),e.ctrlKey||e.metaKey?this.setCursorToBottom():this.setCursorToDown();break;case"Tab":e.preventDefault(),e.shiftKey?this.setCursorToLeft():this.setCursorToRight();break;case" ":case"Space":e.preventDefault(),this.edit(this.cursor.x,this.cursor.y,"boolean"!==i);break;case"Backspace":e.preventDefault(),"boolean"!==i&&"number"!==i&&"string"!==i||"button"===a.type||"select"===a.type||this.setCell(this.cursor.x,this.cursor.y,"");break;case"Escape":e.preventDefault(),this.setFocus(o.None);break;case"KeyC":e.ctrlKey||e.metaKey?(e.preventDefault(),this.copyCell(this.cursor.x,this.cursor.y,i,a)):this.onEtceteraKeyDown(i,a,e);break;case"KeyV":e.ctrlKey||e.metaKey?(e.preventDefault(),this.pasteCell(this.cursor.x,this.cursor.y,i,a)):this.onEtceteraKeyDown(i,a,e);break;default:this.onEtceteraKeyDown(i,a,e)}}else switch(s){case"Escape":e.preventDefault(),this.setFocus(o.None)}else if(this.focus===o.Listbox){var r=this.cellRegulations[this.cursor.y][this.cursor.x]||this.columnRegulations[this.cursor.x]||{};switch(s){case"ArrowUp":e.preventDefault(),this.addListboxSelectedIndex(-1,r.options);break;case"ArrowDown":e.preventDefault(),this.addListboxSelectedIndex(1,r.options);break;case"Tab":e.preventDefault(),this.closeListbox(),e.shiftKey?this.setCursorToLeft():this.setCursorToRight();break;case" ":case"Space":e.preventDefault(),this.updateListboxToCell(this.cursor.x,this.cursor.y),this.closeListbox();break;case"Escape":this.closeListbox()}}}},{key:"onEtceteraKeyDown",value:function(t,e,s){if("boolean"!==t&&"button"!==e.type&&"select"!==e.type&&1===s.key.length){var i=s.key.charCodeAt(0);if(i>=32&&i<=126)return void this.edit(this.cursor.x,this.cursor.y,!0)}}},{key:"onKeyUp",value:function(t){var e=t.code||t.key;if(this.focus===o.Table)switch(e){case"Enter":this.edit(this.cursor.x,this.cursor.y,!1)}else if(this.focus===o.Listbox)switch(e){case"Enter":this.updateListboxToCell(this.cursor.x,this.cursor.y),this.closeListbox(),this.setCursorToDown()}}},{key:"copyCell",value:function(t,e,s,i){"button"!==i.type&&(this.clipboard.type=s,this.clipboard.regulation=i,this.clipboard.value=this.params.bodies[e][t])}},{key:"pasteCell",value:function(t,e,s,i){if(this.clipboard.type===s&&this.clipboard.regulation.type===i.type){if("select"===i.type&&-1===i.options.indexOf(this.clipboard.value))return;this.params.bodies[e][t]=this.clipboard.value,this.updateCell(t,e)}}},{key:"onResize",value:function(){this.updateHeaderPositions()}}]),s}();module.exports=a;
},{}]},{},["IsZn"], "EditableTable")