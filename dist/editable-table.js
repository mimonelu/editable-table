parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"IsZn":[function(require,module,exports) {
function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function i(t,e,i){return e&&s(t.prototype,e),i&&s(t,i),t}var o={None:0,Table:1,Listbox:2},r=function(){function s(t){e(this,s),this.params=t,this.params.headers=this.params.headers||[],this.params.bodies=this.params.bodies||[],this.params.forceConversion=!!this.params.forceConversion,this.focus=this.params.focus?o.Table:o.None,this.regulations=[],this.containerNode=null,this.tableNode=null,this.theadNode=null,this.tbodyNode=null,this.cursor={x:0,y:0},this.isInputting=!1,this.listboxNode=null,this.listboxSelectedIndex=0,this.appendTable(),this.setupLlistbox()}return i(s,[{key:"appendTable",value:function(){this.containerNode=document.createElement("div"),this.tableNode=document.createElement("table"),this.theadNode=document.createElement("thead"),this.tbodyNode=document.createElement("tbody"),this.containerNode.setAttribute("class","editable-table__container"),this.updateHeaders(),this.updateBodies(),this.tableNode.appendChild(this.theadNode),this.tableNode.appendChild(this.tbodyNode),this.containerNode.appendChild(this.tableNode),this.params.containerNode.appendChild(this.containerNode),this.setFocus(this.focus),window.addEventListener("click",this.onClick.bind(this),!1),window.addEventListener("dblclick",this.onDoubleClick.bind(this),!1),window.addEventListener("keydown",this.onKeyDown.bind(this),!1)}},{key:"updateHeaders",value:function(){if(this.params.headers.length>0){var t=document.createElement("tr");this.appendHeader(t,"");for(var e=0;e<this.params.headers.length;e++)this.appendHeader(t,this.params.headers[e]);this.theadNode.appendChild(t)}}},{key:"appendHeader",value:function(t,e){var s=document.createElement("th"),i=document.createTextNode(e);s.appendChild(i),t.appendChild(s)}},{key:"updateBodies",value:function(){for(var t=this.getHeight(),e=0;e<t;e++){var s=document.createElement("tr");this.appendBodyHeader(s,e);for(var i=0;i<this.params.bodies[e].length;i++){var o=document.createElement("td");this.updateCell(i,e,o),o.setAttribute("data-x",i),o.setAttribute("data-y",e),s.appendChild(o)}this.tbodyNode.appendChild(s)}this.setCursor(0,0)}},{key:"appendBodyHeader",value:function(t,e){var s=document.createElement("th"),i=document.createTextNode(e+1);s.setAttribute("data-y",e),s.appendChild(i),t.appendChild(s)}},{key:"updateCell",value:function(e,s,i){var o=this;if(i||(i=this.tableNode.querySelector('[data-x="'.concat(e,'"][data-y="').concat(s,'"]'))),i){var r=t(this.params.bodies[s][e]),a=this.regulations[s][e];if(i.setAttribute("data-type",r),i.setAttribute("data-cursor",e===this.cursor.x&&s===this.cursor.y),i.setAttribute("data-regulation",a.type||""),i.innerHTML="","button"===a.type){var n=document.createElement("div"),l=document.createTextNode(this.params.bodies[s][e]);n.setAttribute("class","editable-table__button"),n.addEventListener("click",function(){o.setCursor(e,s,!1),a.callback(e,s)},!1),n.appendChild(l),i.appendChild(n)}else if("boolean"===r)i.setAttribute("data-checked",this.params.bodies[s][e].toString());else{var u=document.createTextNode(this.params.bodies[s][e]);i.appendChild(u)}}}},{key:"setCell",value:function(t,e,s){var i=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]')),o=i.getAttribute("data-type");if(this.params.forceConversion){var r="boolean"===o?Boolean(s):"number"===o?Number(s):s;this.params.bodies[e][t]=r}else this.params.bodies[e][t]=s;this.updateCell(t,e,i)}},{key:"setSampleData",value:function(t,e){var s=["January","February","March","April","May","June","July","August","September","October","November","December"];this.params.headers.splice(0);for(var i=0;i<e;i++){var o=String.fromCharCode(65+i);this.params.headers.push(o)}this.params.bodies.splice(0);for(var r=0;r<t;r++){this.params.bodies[r]=[];for(var a=0;a<e;a++){var n=a%5==0?Math.random()>=.5:a%5==1?Math.floor(201*Math.random())-100:a%5==2?String.fromCharCode(65+a)+r:a%5==3?s[Math.floor(Math.random()*s.length)]:"Button";this.params.bodies[r].push(n)}}this.resetRegulations();for(var l=0;l<t;l++)for(var u=0;u<e;u++)u%5==3?this.setCellRegulation(u,l,{type:"select",options:s}):u%5==4&&this.setCellRegulation(u,l,{type:"button",callback:function(t,e){alert("[ ".concat(t+1,", ").concat(e+1," ] clicked!"))}});this.updateHeaders(),this.updateBodies()}},{key:"resetRegulations",value:function(){this.regulations.splice(0);for(var t=this.getWidth(),e=this.getHeight(),s=0;s<e;s++){this.regulations[s]=[];for(var i=0;i<t;i++)this.regulations[s][i]=[]}}},{key:"setupLlistbox",value:function(){this.listboxNode=document.createElement("ol"),this.listboxNode.setAttribute("class","editable-table__listbox"),this.listboxNode.style.display="none",this.params.containerNode.appendChild(this.listboxNode)}},{key:"openListbox",value:function(t,e){var s=this,i=null;this.setFocus(o.Listbox),this.listboxNode.innerHTML="";for(var r=function(t){var o=document.createElement("li"),r=document.createTextNode(e[t]);t===s.listboxSelectedIndex&&(i=o),o.setAttribute("data-selected",t===s.listboxSelectedIndex),o.addEventListener("click",function(e){s.onClickListboxItem(t)},!1),o.appendChild(r),s.listboxNode.appendChild(o)},a=0;a<e.length;a++)r(a);this.listboxNode.style["max-height"]="",this.listboxNode.style.opacity="0",this.listboxNode.style.display="";var n=t.getBoundingClientRect(),l=n.left-1,u=0,c=-1;this.listboxNode.clientHeight<document.documentElement.clientHeight?u=this.listboxNode.clientHeight+(t.offsetTop-this.containerNode.scrollTop)<document.documentElement.clientHeight?n.top-1:document.documentElement.clientHeight-this.listboxNode.clientHeight-16:(u=16,c=document.documentElement.clientHeight-32),this.listboxNode.style.left="".concat(l,"px"),this.listboxNode.style.top="".concat(u,"px"),-1!==c&&(this.listboxNode.style["max-height"]="".concat(c,"px")),this.listboxNode.style.opacity="",i.scrollIntoView({block:"center",inline:"center"})}},{key:"onClickListboxItem",value:function(t){this.listboxSelectedIndex=t,this.updateListboxToCell(this.cursor.x,this.cursor.y)}},{key:"closeListbox",value:function(){this.listboxNode.style.display="none",this.setFocus(o.Table)}},{key:"addListboxSelectedIndex",value:function(t,e){this.listboxNode.children[this.listboxSelectedIndex].setAttribute("data-selected","false"),this.listboxSelectedIndex+=t,this.listboxSelectedIndex=Math.max(0,Math.min(e.length-1,this.listboxSelectedIndex)),this.listboxNode.children[this.listboxSelectedIndex].setAttribute("data-selected","true"),this.listboxNode.children[this.listboxSelectedIndex].scrollIntoView({block:"center",inline:"center"})}},{key:"updateListboxToCell",value:function(t,e){var s=this.regulations[e][t].options[this.listboxSelectedIndex];this.params.bodies[e][t]=s,this.updateCell(t,e)}},{key:"setCellRegulation",value:function(t,e,s){this.regulations[e][t].type=s.type,null!=s.callback&&(this.regulations[e][t].callback=s.callback),null!=s.options&&(this.regulations[e][t].options=s.options)}},{key:"setFocus",value:function(t){this.focus=t,this.containerNode.setAttribute("data-focus",this.focus===o.Table)}},{key:"setInputting",value:function(t){this.isInputting=t,this.containerNode.setAttribute("data-inputting",this.isInputting)}},{key:"edit",value:function(t,e,s){var i=this;if(!this.isInputting){var r=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]'));if(r){var a=r.getAttribute("data-type"),n=this.regulations[e][t];if("button"===n.type)n.callback(t,e);else if("select"===n.type){this.listboxSelectedIndex=0;for(var l=0;l<n.options.length;l++)if(n.options[l]===this.params.bodies[e][t]){this.listboxSelectedIndex=l;break}this.openListbox(r,n.options)}else if("boolean"===a)this.params.bodies[e][t]=!this.params.bodies[e][t],this.updateCell(t,e);else{this.setInputting(!0),this.setFocus(o.None),r.innerHTML="";var u=null;if("number"===a?((u=document.createElement("input")).setAttribute("size","1"),u.setAttribute("spellcheck","false"),u.setAttribute("type","text"),u.setAttribute("value",this.params.bodies[e][t]),r.appendChild(u)):((u=document.createElement("textarea")).setAttribute("cols","1"),u.setAttribute("rows","1"),u.setAttribute("spellcheck","false"),u.setAttribute("wrap","off"),u.value=this.params.bodies[e][t],r.appendChild(u),u.addEventListener("keyup",function(t){"Enter"===t.code&&(u.value=u.value.replace(/(?:\r\n|\r|\n)$/,""))},{once:!0})),this.resizeNodeToFitContent(u),u.addEventListener("keydown",function(){setTimeout(function(){i.resizeNodeToFitContent(u)},0)},!1),u.addEventListener("keydown",function(s){if(!s.isComposing)if("Enter"===s.code&&s.metaKey&&"string"===a){var r=u.selectionStart,n=u.value.substr(0,r),l=u.value.substr(r,u.value.length);u.value=n+"\n"+l,u.setSelectionRange(r+1,r+1)}else"Enter"===s.code||"Tab"===s.code?(s.preventDefault(),s.stopPropagation(),i.setFocus(o.Table),i.setInputting(!1),i.setCell(t,e,u.value),"Enter"===s.code?i.setCursorToDown():"Tab"===s.code&&(s.shiftKey?i.setCursorToLeft():i.setCursorToRight())):"Escape"===s.code&&(s.stopPropagation(),i.setFocus(o.Table),i.setInputting(!1),i.updateCell(t,e))},!1),u.addEventListener("blur",function(s){i.setFocus(o.Table),i.setInputting(!1),i.updateCell(t,e)},!1),s)u.addEventListener("focus",u.select,!1);else{var c=String(this.params.bodies[e][t]).length;u.setSelectionRange(c,c)}u.focus()}}}}},{key:"resizeNodeToFitContent",value:function(t){t.parentNode&&(t.style.width="auto",t.style.width="".concat(Math.max(t.scrollWidth,t.parentNode.clientWidth)+32,"px"),t.style.height="auto",t.style.height="".concat(Math.max(t.scrollHeight,t.parentNode.clientHeight),"px"))}},{key:"setCursor",value:function(t,e){var s=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(this.isCursorValid(t,e)){var i=this.tableNode.querySelector('[data-cursor="true"]');i&&i.setAttribute("data-cursor","false");var o=this.tableNode.querySelector('[data-x="'.concat(t,'"][data-y="').concat(e,'"]'));o&&(o.setAttribute("data-cursor","true"),s&&o.scrollIntoView({block:"center",inline:"center"}),this.cursor.x=t,this.cursor.y=e)}}},{key:"setCursorToLeft",value:function(){this.setCursor(this.cursor.x-1,this.cursor.y)}},{key:"setCursorToRight",value:function(){this.setCursor(this.cursor.x+1,this.cursor.y)}},{key:"setCursorToUp",value:function(){this.setCursor(this.cursor.x,this.cursor.y-1)}},{key:"setCursorToDown",value:function(){this.setCursor(this.cursor.x,this.cursor.y+1)}},{key:"setCursorToLeftEnd",value:function(){this.setCursor(0,this.cursor.y)}},{key:"setCursorToRightEnd",value:function(){this.setCursor(this.getWidth()-1,this.cursor.y)}},{key:"setCursorToTop",value:function(){this.setCursor(this.cursor.x,0)}},{key:"setCursorToBottom",value:function(){this.setCursor(this.cursor.x,this.getHeight()-1)}},{key:"setCursorToNext",value:function(){var t=this.cursor,e=t.x,s=t.y;this.isCursorValid(e-1,s)?this.setCursor(e-1,s):this.isCursorValid(this.getWidth()-1,s-1)?this.setCursor(this.getWidth()-1,s-1):this.setCursor(this.getWidth()-1,this.getHeight()-1)}},{key:"setCursorToPrevious",value:function(){var t=this.cursor,e=t.x,s=t.y;this.isCursorValid(e+1,s)?this.setCursor(e+1,s):this.isCursorValid(0,s+1)?this.setCursor(0,s+1):this.setCursor(0,0)}},{key:"isCursorValid",value:function(t,e){return t>=0&&e>=0&&t<this.getWidth()&&e<this.getHeight()}},{key:"getWidth",value:function(){return this.params.bodies.length>0?this.params.bodies[0].length:0}},{key:"getHeight",value:function(){return this.params.bodies.length}},{key:"onClick",value:function(t){if(t.target.closest(".editable-table__container")||t.target.closest(".editable-table__listbox")){if(this.setFocus(o.Table),this.closeListbox(),t.target.closest("td")){var e=parseInt(t.target.getAttribute("data-x"),10),s=parseInt(t.target.getAttribute("data-y"),10);this.setCursor(e,s,!1)}}else this.setFocus(o.None)}},{key:"onDoubleClick",value:function(t){this.focus===o.Table&&this.edit(this.cursor.x,this.cursor.y,!1)}},{key:"onKeyDown",value:function(e){if(this.focus===o.Table){var s=t(this.params.bodies[this.cursor.y][this.cursor.x]),i=this.regulations[this.cursor.y][this.cursor.x];switch(e.code){case"ArrowLeft":e.preventDefault(),e.metaKey?this.setCursorToLeftEnd():this.setCursorToLeft();break;case"ArrowRight":e.preventDefault(),e.metaKey?this.setCursorToRightEnd():this.setCursorToRight();break;case"ArrowUp":e.preventDefault(),e.metaKey?this.setCursorToTop():this.setCursorToUp();break;case"ArrowDown":e.preventDefault(),e.metaKey?this.setCursorToBottom():this.setCursorToDown();break;case"Tab":e.preventDefault(),e.shiftKey?this.setCursorToNext():this.setCursorToPrevious();break;case"Enter":this.edit(this.cursor.x,this.cursor.y,!1);break;case"Space":"boolean"===s?(e.preventDefault(),this.edit(this.cursor.x,this.cursor.y,!1)):("boolean"!==s&&"button"!==i.type&&"select"!==i.type||e.preventDefault(),this.onEtceteraKeyDown(e));break;case"Backspace":e.preventDefault(),"boolean"!==s&&"number"!==s&&"string"!==s||"button"===i.type||"select"===i.type||this.setCell(this.cursor.x,this.cursor.y,"");break;case"Escape":e.preventDefault(),this.setFocus(o.None);break;default:"boolean"!==s&&"button"!==i.type&&"select"!==i.type&&this.onEtceteraKeyDown(e)}}else if(this.focus===o.Listbox){var r=this.regulations[this.cursor.y][this.cursor.x];switch(e.code){case"ArrowUp":e.preventDefault(),this.addListboxSelectedIndex(-1,r.options);break;case"ArrowDown":e.preventDefault(),this.addListboxSelectedIndex(1,r.options);break;case"Tab":e.preventDefault(),this.closeListbox(),e.shiftKey?this.setCursorToNext():this.setCursorToPrevious();break;case"Enter":this.updateListboxToCell(this.cursor.x,this.cursor.y),this.closeListbox(),this.setCursorToDown();break;case"Space":e.preventDefault(),this.updateListboxToCell(this.cursor.x,this.cursor.y),this.closeListbox();break;case"Escape":this.closeListbox()}}}},{key:"onEtceteraKeyDown",value:function(t){if(1===t.key.length){var e=t.key.charCodeAt(0);if(e>=32&&e<=126)return void this.edit(this.cursor.x,this.cursor.y,!0)}}}]),s}();module.exports=r;
},{}]},{},["IsZn"], "EditableTable")