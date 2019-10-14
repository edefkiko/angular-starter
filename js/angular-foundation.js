!function(e,t){if("function"==typeof define&&define.amd)define(["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.angularFoundationMin=n.exports}}(this,function(e){"use strict";function t(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t,n){"ngInject";var o=this;o.groups=[],o.closeOthers=function(o){var a=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;a&&angular.forEach(this.groups,function(e){e!==o&&(e.isOpen=!1)})},o.addGroup=function(e){this.groups.push(e)},o.removeGroup=function(e){var t=this.groups.indexOf(e);-1!==t&&this.groups.splice(t,1)}}function a(e,t,n,o,a,i,r,l){"ngInject";function s(e){p.active=!1,p.closeOnClick&&g.off("click",u)}function c(e){p.active=!0,d(l),p.closeOnClick&&g.on("click",u)}function u(t){var n=Array.prototype.slice.apply(o[0].querySelectorAll("*"));if(n.length){var a=n.every(function(e){return e!==t.target});a&&(s(),e.$apply())}}function d(e){var t=p.paneOffset||e,n=angular.element(o[0].querySelector("toggle *:first-child")),i=a.position(n);p.css.top=i.top+i.height+t+"px","center"===p.paneAlign?(p.css.left=i.left+i.width/2+"px",p.css.transform="translateX(-50%)"):"right"===p.paneAlign?(p.css.left=i.left+i.width+"px",p.css.transform="translateX(-100%)"):p.css.left=i.left+"px"}var p=this,f=void 0,g=angular.element(document.querySelector("body"));p.css={},r(function(e,t){var n=angular.element(o[0].querySelector("span:nth-child(1)"));n.append(e)},o.parent(),"toggle"),r(function(e,t){t.$close=s;var n=angular.element(o[0].querySelector("div:nth-child(2)"));n.append(e)},o.parent(),"pane"),i(function(){d()}),p.$onDestroy=function(){p.closeOnClick&&g.off("click",u)},p.toggle=function(){p.active?s():c()},p.mouseover=function(){i.cancel(f),p.active=!0,d(l)},p.mouseleave=function(){i.cancel(f),f=i(function(){e.$apply(function(){p.active=!1})},250)}}function i(e,t,n){"ngInject";return{scope:{},restrict:"EA",bindToController:{closeOnClick:"=",paneAlign:"@",toggleOnHover:"=",paneOffset:"="},transclude:{toggle:"toggle",pane:"pane"},templateUrl:"template/dropdownToggle/dropdownToggle.html",controller:a,controllerAs:"$ctrl"}}o.$inject=["$scope","$attrs","accordionConfig"],a.$inject=["$scope","$attrs","mediaQueries","$element","$position","$timeout","$transclude","dropdownPaneOffset"],i.$inject=["$document","$window","$location"],Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};angular.module("mm.foundation.accordion",[]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",o).directive("accordion",function(){"ngInject";return{restrict:"EA",controller:o,controllerAs:"$ctrl",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){"ngInject";return{require:{accordion:"^accordion"},restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{},controllerAs:"$ctrl",bindToController:{heading:"@"},controller:["$scope","$element","$attrs","$parse",function(e,t,n,o){var a=this;a.isOpen=!1,a.setHTMLHeading=function(e){a.HTMLHeading=e},a.$onInit=function(){a.accordion.addGroup(a),e.$on("$destroy",function(e){a.accordion.removeGroup(a)});var i,r;n.isOpen&&(i=o(n.isOpen),r=i.assign,e.$parent.$watch(i,function(e){a.isOpen=!!e})),e.$watch(function(){return a.isOpen},function(n){n&&a.accordion.closeOthers(a),r&&r(e.$parent,n),n?e.$emit("down.af.accordionGroup",t,e):e.$emit("up.af.accordionGroup",t,e)})}}]}}).directive("accordionHeading",function(){"ngInject";return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(e,t,n,o,a){o.setHTMLHeading(a(e,function(){}))}}}).directive("accordionTransclude",function(){"ngInject";return{require:"^accordionGroup",link:function(e,t,n,o){e.$watch(function(){return o.HTMLHeading},function(e){e&&(t.html(""),t.append(e))})}}}),function(){angular.module("mm.foundation.accordion").run(["$templateCache",function(e){e.put("template/accordion/accordion-group.html",'<li class="accordion-item" ng-class="{ \'is-active\': $ctrl.isOpen }">\n  <a ng-click="$ctrl.isOpen = !$ctrl.isOpen" class="accordion-title" accordion-transclude>{{$ctrl.heading}}</a>\n  <div class="accordion-content" style="display: block;" ng-show="$ctrl.isOpen" ng-transclude></div>\n</li>\n'),e.put("template/accordion/accordion.html",'<ul class="accordion" ng-transclude></ul>\n')}])}(),angular.module("mm.foundation.alert",[]).controller("AlertController",["$scope","$attrs",function(e,t){"ngInject";e.closeable="close"in t&&"undefined"!=typeof t.close}]).directive("alert",function(){"ngInject";return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),function(){angular.module("mm.foundation.alert").run(["$templateCache",function(e){e.put("template/alert/alert.html",'<div class="callout" ng-class=\'(type || "")\'>\n  <span ng-transclude></span>\n  <button ng-click="close()" ng-show="closeable" class="close-button" aria-label="Close alert" type="button">\n      <span aria-hidden="true">&times;</span>\n  </button>\n</div>\n')}])}(),angular.module("mm.foundation.bindHtml",[]).directive("bindHtmlUnsafe",function(){"ngInject";return function(e,t,n){t.addClass("ng-binding").data("$binding",n.bindHtmlUnsafe),e.$watch(n.bindHtmlUnsafe,function(e){t.html(e||"")})}}),angular.module("mm.foundation.buttons",[]).constant("buttonConfig",{activeClass:"hollow",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(e){this.activeClass=e.activeClass,this.toggleEvent=e.toggleEvent}]).directive("btnRadio",function(){"ngInject";return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(e,t,n,o){var a=o[0],i=o[1];i.$render=function(){t.toggleClass(a.activeClass,angular.equals(i.$modelValue,e.$eval(n.btnRadio)))},t.bind(a.toggleEvent,function(){t.hasClass(a.activeClass)||e.$apply(function(){i.$setViewValue(e.$eval(n.btnRadio)),i.$render()})})}}}).directive("btnCheckbox",function(){"ngInject";return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(e,t,n,o){function a(){return r(n.btnCheckboxTrue,!0)}function i(){return r(n.btnCheckboxFalse,!1)}function r(t,n){var o=e.$eval(t);return angular.isDefined(o)?o:n}var l=o[0],s=o[1];s.$render=function(){t.toggleClass(l.activeClass,angular.equals(s.$modelValue,a()))},t.bind(l.toggleEvent,function(){e.$apply(function(){s.$setViewValue(t.hasClass(l.activeClass)?i():a()),s.$render()})})}}}),angular.module("mm.foundation.dropdownMenu",[]).directive("dropdownMenu",["$compile",function(e){"ngInject";return{bindToController:{disableHover:"=",disableClickOpen:"=",closingTime:"=",opensLeft:"="},scope:{},restrict:"A",controllerAs:"vm",controller:["$scope","$element",function(e,t){}]}}]).directive("li",["$timeout",function(e){"ngInject";return{require:"?^^dropdownMenu",restrict:"E",link:function(t,n,o,a){if(a){for(var i,r=null,l=n[0].children,s=0;s<l.length;s++){var c=angular.element(l[s]);"UL"===c[0].nodeName&&c.hasClass("menu")&&(r=c)}var u=n.parent()[0].hasAttribute("dropdown-menu");u||n.addClass("is-submenu-item"),r&&(r.addClass("is-dropdown-submenu menu submenu vertical"),n.addClass("is-dropdown-submenu-parent opens-"+(a.opensLeft?"left":"right")),u&&r.addClass("first-sub"),a.disableHover||n.on("mouseenter",function(){e.cancel(i),n.parent().children().children().removeClass("js-dropdown-active"),r.addClass("js-dropdown-active"),n.addClass("is-active")}),n.on("click",function(){r.addClass("js-dropdown-active"),n.addClass("is-active")}),n.on("mouseleave",function(){i=e(function(){r.removeClass("js-dropdown-active"),n.removeClass("is-active")},a.closingTime?a.closingTime:500)}))}}}}]),angular.module("mm.foundation.dropdownToggle",["mm.foundation.position","mm.foundation.mediaQueries"]).directive("dropdownToggle",i).constant("dropdownPaneOffset",1),function(){angular.module("mm.foundation.dropdownToggle").run(["$templateCache",function(e){e.put("template/dropdownToggle/dropdownToggle.html",'<span\n    ng-class="{\'is-open\': $ctrl.active}"\n    ng-click="!$ctrl.toggleOnHover && $ctrl.toggle()"\n    ng-mouseover="$ctrl.toggleOnHover && $ctrl.mouseover()"\n    ng-mouseleave="$ctrl.toggleOnHover && $ctrl.mouseleave($event)"></span>\n<div\n    ng-style="$ctrl.css"\n    ng-class="{\'is-open\': $ctrl.active}"\n    ng-attr-aria-hidden="$ctrl.active"\n    ng-mouseover="$ctrl.toggleOnHover && $ctrl.mouseover()"\n    ng-mouseleave="$ctrl.toggleOnHover && $ctrl.mouseleave($event)"\n    class="dropdown-pane{{$ctrl.paneAlign && \' dropdown-pane-\' + $ctrl.paneAlign}}"></div>\n')}])}(),angular.module("mm.foundation.mediaQueries",[]).factory("matchMedia",["$document","$window",function(e,t){"ngInject";return t.matchMedia||function(e,t){var n=void 0,o=e.documentElement,a=o.firstElementChild||o.firstChild,i=e.createElement("body"),r=e.createElement("div");return r.id="mq-test-1",r.style.cssText="position:absolute;top:-100em",i.style.background="none",i.appendChild(r),function(e){return r.innerHTML='&shy;<style media="'+e+'"> #mq-test-1 { width: 42px; }</style>',o.insertBefore(i,a),n=42===r.offsetWidth,o.removeChild(i),{matches:n,media:e}}}(e[0])}]).factory("mediaQueries",["$document","matchMedia",function(e,t){"ngInject";function n(e){var t={};return"string"!=typeof e?t:(e=e.trim().slice(1,-1))?t=e.split("&").reduce(function(e,t){var n=t.replace(/\+/g," ").split("="),o=n[0],a=n[1];return o=decodeURIComponent(o),a=void 0===a?null:decodeURIComponent(a),e.hasOwnProperty(o)?Array.isArray(e[o])?e[o].push(a):e[o]=[e[o],a]:e[o]=a,e},{}):t}function o(e){for(var t in u){var n=u[t];if(e===n.name)return n.value}return null}function a(e){var t=o(e);return t?window.matchMedia(t).matches:!1}function i(){for(var e=void 0,n=0;n<u.length;n++){var o=u[n];t(o.value).matches&&(e=o)}return"object"===("undefined"==typeof e?"undefined":l(e))?e.name:e}var r=angular.element(e[0].querySelector("head"));r.append('<meta class="foundation-mq" />');var s=getComputedStyle(r[0].querySelector("meta.foundation-mq")).fontFamily,c=n(s),u=[];for(var d in c)u.push({name:d,value:"only screen and (min-width: "+c[d]+")"});var p=function(){return/iP(ad|hone|od).*OS/.test(window.navigator.userAgent)},f=function(){return/Android/.test(window.navigator.userAgent)};return{getCurrentSize:i,atLeast:a,mobileSniff:function(){return p()||f()}}}]);var s=e.StackedMap=function(){function e(){n(this,e),this.stack=[]}return r(e,[{key:"add",value:function(e,t){this.stack.push({key:e,value:t})}},{key:"get",value:function(e){return this.stack.find(function(t){return t.key===e})}},{key:"keys",value:function(){return this.stack.map(function(e){return e.key})}},{key:"top",value:function(){return this.stack[this.stack.length-1]}},{key:"remove",value:function(e){this.stack=this.stack.filter(function(t){return t.key!==e})}},{key:"removeTop",value:function(){return this.stack.splice(this.stack.length-1,1)[0]}},{key:"length",value:function(){return this.stack.length}}]),e}();angular.module("mm.foundation.modal",["mm.foundation.mediaQueries"]).directive("modalBackdrop",["$modalStack",function(e){"ngInject";return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(t){t.close=function(t){var n=e.getTop();n&&n.value.closeOnClick&&n.value.backdrop&&"static"!==n.value.backdrop&&t.target===t.currentTarget&&(t.preventDefault(),t.stopPropagation(),e.dismiss(n.key,"backdrop click"))}}}}]).directive("modalWindow",["$modalStack",function(e){"ngInject";return{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:"template/modal/window.html",link:function(t,n,o){t.windowClass=o.windowClass||"",t.isTop=function(){var n=e.getTop();return n?n.value.modalScope&&n.value.modalScope===t.$parent:!0}}}}]).factory("$modalStack",["$window","$timeout","$document","$compile","$rootScope","$animate","$q","mediaQueries",function(e,n,o,a,i,r,l,c){"ngInject";function u(){for(var e=-1,t=$.keys(),n=0;n<t.length;n++)$.get(t[n]).value.backdrop&&(e=n);return e}function d(){for(var e=$.keys(),t=e.length>0,n=(o.find("body").eq(0),0);n<e.length;n++){var a=y.reposition(e[n]);a&&"fixed"!==a.position&&(t=!1)}}function p(t){var n=$.get(t).value;if($.remove(t),n.backdropDomEl&&r.leave(n.backdropDomEl).then(function(){n.backdropScope.$destroy()}),0===$.length()){var a=o.find("body").eq(0);if(a.removeClass(v),m){var i=o.find("html").eq(0);i.removeClass(v),b&&(a[0].scrollTop=b,b=null)}angular.element(e).unbind("resize",d)}r.leave(n.modalDomEl).then(function(){n.modalScope.$destroy()})}function f(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)}function g(e){var t=e.options;if(t.backdrop)return{left:0,position:"relative"};var n=t.modalDomEl,a=o.find("body").eq(0),i=a.clientWidth||o[0].documentElement.clientWidth,r=a.clientHeight||o[0].documentElement.clientHeight,l=n[0].offsetWidth,s=n[0].offsetHeight,c=parseInt((i-l)/2,10),u=0;r>s&&(u=parseInt((r-s)/4,10));var d=t.modalPos=t.modalPos||{};return d.left=c,d.position="fixed",d}var m=c.mobileSniff(),v="is-reveal-open",h="a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]",b=null,$=new s,y={};return o.on("keydown",function(e){var t=$.top();if(t)if(27===e.which)t.value.keyboard&&i.$apply(function(){y.dismiss(t.key)});else if(9===e.which){var n=y.loadFocusElementList(t),o=!1;e.shiftKey?(y.isFocusInFirstItem(e,n)||y.isModalFocused(e,t))&&(o=y.focusLastFocusableElement(n)):y.isFocusInLastItem(e,n)&&(o=y.focusFirstFocusableElement(n)),o&&(e.preventDefault(),e.stopPropagation())}}),y.loadFocusElementList=function(e){if(!e)return[];var n=e.value.modalDomEl;if(n&&n.length){var o=n[0].querySelectorAll(h);return[].concat(t(o)).filter(function(e){return f(e)})}return[]},y.isModalFocused=function(e,t){if(e&&t){var n=t.value.modalDomEl;if(n&&n.length)return(e.target||e.srcElement)===n[0]}return!1},y.isFocusInLastItem=function(e,t){return t.length>0?(e.target||e.srcElement)===t[t.length-1]:!1},y.focusFirstFocusableElement=function(e){return e.length>0?(e[0].focus(),!0):!1},y.focusLastFocusableElement=function(e){return e.length>0?(e[e.length-1].focus(),!0):!1},y.isFocusInFirstItem=function(e,t){return t.length>0?(e.target||e.srcElement)===t[0]:!1},y.open=function(t,s){t.options={deferred:s.deferred,modalScope:s.scope,backdrop:s.backdrop,keyboard:s.keyboard,closeOnClick:s.closeOnClick,id:s.id},$.add(t,t.options);var c=(u(),void 0);if(s.backdrop){var p=i.$new(!0);c=a("<div modal-backdrop></div>")(p),$.top().value.backdropDomEl=c,$.top().value.backdropScope=p}1===$.length()&&angular.element(e).on("resize",d);var f=[];s.windowClass&&f.push(s.windowClass),s.size&&f.push(s.size),s.backdrop||f.push("without-overlay");var h=angular.element("<div modal-window></div>").attr({style:"\n                visibility: visible;\n                z-index: -1;\n                display: block;\n            ","window-class":f.join(" "),index:$.length()-1});return h.html(s.content),a(h)(s.scope),$.top().value.modalDomEl=h,n(function(){s.scope.$apply();var n=o.find("body").eq(0);n.prepend(h);var a=g(t,!0);h.detach(),h.attr({style:"\n                    visibility: visible;\n                    left: "+a.left+"px;\n                    display: block;\n                    position: "+a.position+";\n                "});var i=[];c&&i.push(r.enter(c,n,n[0].lastChild));var u=c||n;if(i.push(r.enter(h,u,u[0].lastChild)),m){b=e.pageYOffset;var p=o.find("html").eq(0);p.addClass(v)}return n.addClass(v),s.backdrop||s.scope.$watch(function(){return Math.floor(h[0].offsetHeight/10)},d),l.all(i).then(function(){var e=h[0].querySelector("[autofocus]")||h[0],t=u[0].scrollTop;e.focus(),u[0].scrollTop=t})})},y.reposition=function(e){var t=$.get(e).value;if(t){var n=t.modalDomEl,o=g(e);return n.css("left",o.left+"px"),n.css("position",o.position),o}return{}},y.close=function(e,t){var n=$.get(e);return n?(n.value.deferred.resolve(t),e.opened.then(function(){p(e)})):l.resolve()},y.dismiss=function(e,t){var n=$.get(e);return n?(n.value.deferred.reject(t),e.opened.then(function(){p(e)})):l.resolve()},y.dismissAll=function(e){var t=arguments.length<=1||void 0===arguments[1]?[]:arguments[1];return l.all($.keys().filter(function(e){return-1===t.indexOf($.get(e).value.id)}).map(function(t){return y.dismiss(t,e)}))},y.getTop=function(){return $.top()},y.isOpen=function(e){return $.keys().some(function(e){return-1!==skipIds.indexOf($.get().value.id)})},y}]).provider("$modal",function(){"ngInject";var e=this;this.options={backdrop:!0,keyboard:!0,closeOnClick:!0,id:0},this.$get=["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(t,n,o,a,i,r,l){function s(e){return e.template?o.resolve(e.template):a.get(e.templateUrl,{cache:i}).then(function(e){return e.data})}function c(e){var n=[];return angular.forEach(e,function(e){(angular.isFunction(e)||angular.isArray(e))&&n.push(o.when(t.invoke(e)))}),n}var u={};return u.open=function(t){var a=o.defer(),i=o.defer(),u={result:a.promise,opened:i.promise,close:function(e){l.close(u,e)},dismiss:function(e){l.dismiss(u,e)},reposition:function(){l.reposition(u)}},d=angular.extend({},e.options,t);if(d.resolve=d.resolve||{},!d.template&&!d.templateUrl)throw new Error("One of template or templateUrl options is required.");var p=o.all([s(d)].concat(c(d.resolve))),f=p.then(function(e){var t=(d.scope||n).$new();t.$close=u.close,t.$dismiss=u.dismiss;var o=void 0,i={},s=1;return d.controller&&(i.$scope=t,i.$modalInstance=u,angular.forEach(d.resolve,function(t,n){i[n]=e[s++]}),o=r(d.controller,i),d.controllerAs&&(t[d.controllerAs]=o)),l.open(u,{scope:t,deferred:a,content:e[0],backdrop:d.backdrop,keyboard:d.keyboard,windowClass:d.windowClass,size:d.size,closeOnClick:d.closeOnClick,id:d.id})},function(e){return a.reject(e),o.reject(e)});return f.then(function(){i.resolve()},function(){i.reject()}),u},u}]}),function(){angular.module("mm.foundation.modal").run(["$templateCache",function(e){e.put("template/modal/backdrop.html",'<div ng-animate-children="true"\n    class="reveal-overlay ng-animate"\n    ng-click="close($event)"\n    style="display: block;"></div>\n'),e.put("template/modal/window.html",'<div tabindex="-1" class="reveal {{ windowClass }}" style="display: block; visibility: visible;">\n  <div ng-transclude></div>\n</div>\n')}])}(),angular.module("mm.foundation.offcanvas",[]).directive("offCanvasWrapper",["$window",function(e){"ngInject";return{scope:{},bindToController:{disableAutoClose:"="},controllerAs:"vm",restrict:"C",controller:["$scope","$element",function(t,n){var o=this,a=angular.element(n[0].querySelector(".position-left")),i=angular.element(n[0].querySelector(".position-right")),r=angular.element(n[0].querySelector(".off-canvas-wrapper-inner")),l=angular.element('<div class="js-off-canvas-exit"></div>');r.append(l),l.on("click",function(){o.hide()}),o.leftToggle=function(){r&&r.toggleClass("is-off-canvas-open"),r&&r.toggleClass("is-open-left"),a&&a.toggleClass("is-open"),l.addClass("is-visible")},o.rightToggle=function(){r&&r.toggleClass("is-off-canvas-open"),r&&r.toggleClass("is-open-right"),i&&i.toggleClass("is-open"),l.addClass("is-visible")},o.hide=function(){r&&r.removeClass("is-open-left"),r&&r.removeClass("is-open-right"),a&&a.removeClass("is-open"),i&&i.removeClass("is-open"),r&&r.removeClass("is-off-canvas-open"),l.removeClass("is-visible")};var s=angular.element(e);s.bind("resize.body",o.hide),t.$on("$destroy",function(){s.unbind("resize.body",o.hide)})}]}}]).directive("leftOffCanvasToggle",function(){"ngInject";return{require:"^^offCanvasWrapper",restrict:"C",link:function(e,t,n,o){t.on("click",function(){o.leftToggle()})}}}).directive("rightOffCanvasToggle",function(){"ngInject";return{require:"^^offCanvasWrapper",restrict:"C",link:function(e,t,n,o){t.on("click",function(){o.rightToggle()})}}}).directive("offCanvas",function(){"ngInject";return{require:{offCanvasWrapper:"^^offCanvasWrapper"},restrict:"C",bindToController:{},scope:{},controllerAs:"vm",controller:function(){}}}).directive("li",function(){"ngInject";return{require:"?^^offCanvas",restrict:"E",link:function(e,t,n,o){o&&!o.offCanvasWrapper.disableAutoClose&&t.on("click",function(){o.offCanvasWrapper.hide()})}}}),angular.module("mm.foundation.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse","$interpolate",function(e,t,n,o){var a=this,i=t.numPages?n(t.numPages).assign:angular.noop;this.init=function(o){t.itemsPerPage?e.$parent.$watch(n(t.itemsPerPage),function(t){a.itemsPerPage=parseInt(t,10),e.totalPages=a.calculateTotalPages()}):this.itemsPerPage=o},this.noPrevious=function(){return 1===this.page},this.noNext=function(){return this.page===e.totalPages},this.isActive=function(e){return this.page===e},this.calculateTotalPages=function(){var t=this.itemsPerPage<1?1:Math.ceil(e.totalItems/this.itemsPerPage);return Math.max(t||0,1)},this.getAttributeValue=function(t,n,a){return angular.isDefined(t)?a?o(t)(e.$parent):e.$parent.$eval(t):n},this.render=function(){this.page=parseInt(e.page,10)||1,this.page>0&&this.page<=e.totalPages&&(e.pages=this.getPages(this.page,e.totalPages))},e.selectPage=function(t){!a.isActive(t)&&t>0&&t<=e.totalPages&&(e.page=t,e.onSelectPage({page:t}))},e.$watch("page",function(){a.render()}),e.$watch("totalItems",function(){e.totalPages=a.calculateTotalPages()}),e.$watch("totalPages",function(t){i(e.$parent,t),a.page>t?e.selectPage(t):a.render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(e,t){"ngInject";return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(n,o,a,i){function r(e,t,n,o){return{number:e,text:t,active:n,disabled:o}}var l,s=i.getAttributeValue(a.boundaryLinks,t.boundaryLinks),c=i.getAttributeValue(a.directionLinks,t.directionLinks),u=i.getAttributeValue(a.firstText,t.firstText,!0),d=i.getAttributeValue(a.previousText,t.previousText,!0),p=i.getAttributeValue(a.nextText,t.nextText,!0),f=i.getAttributeValue(a.lastText,t.lastText,!0),g=i.getAttributeValue(a.rotate,t.rotate);i.init(t.itemsPerPage),a.maxSize&&n.$parent.$watch(e(a.maxSize),function(e){l=parseInt(e,10),i.render()}),i.getPages=function(e,t){var n=[],o=1,a=t,m=angular.isDefined(l)&&t>l;m&&(g?(o=Math.max(e-Math.floor(l/2),1),a=o+l-1,a>t&&(a=t,o=a-l+1)):(o=(Math.ceil(e/l)-1)*l+1,a=Math.min(o+l-1,t)));for(var v=o;a>=v;v++){var h=r(v,v,i.isActive(v),!1);n.push(h)}if(m&&!g){if(o>1){var b=r(o-1,"...",!1,!1);n.unshift(b)}if(t>a){var $=r(a+1,"...",!1,!1);n.push($)}}if(c){var y=r(e-1,d,!1,i.noPrevious());n.unshift(y);var C=r(e+1,p,!1,i.noNext());n.push(C)}if(s){var k=r(1,u,!1,i.noPrevious());n.unshift(k);var w=r(t,f,!1,i.noNext());n.push(w)}return n}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(e){"ngInject";return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(t,n,o,a){function i(e,t,n,o,a){return{number:e,text:t,disabled:n,previous:s&&o,next:s&&a}}var r=a.getAttributeValue(o.previousText,e.previousText,!0),l=a.getAttributeValue(o.nextText,e.nextText,!0),s=a.getAttributeValue(o.align,e.align);a.init(e.itemsPerPage),a.getPages=function(e){return[i(e-1,r,a.noPrevious(),!0,!1),i(e+1,l,a.noNext(),!1,!0)]}}}}]),function(){angular.module("mm.foundation.pagination").run(["$templateCache",function(e){e.put("template/pagination/pager.html",'<ul class="pagination">\n  <li ng-repeat="page in pages" class="arrow" ng-class="{unavailable: page.disabled, left: page.previous, right: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>\n'),e.put("template/pagination/pagination.html",'<ul class="pagination" role="navigation" aria-label="Pagination">\n  <li ng-repeat="page in pages"\n    ng-class="{\n        \'pagination-previous\': $first,\n        \'pagination-next\': $last,\n        current: page.active,\n        unavailable: page.disabled\n        }">\n    <a ng-if="!page.active" ng-click="selectPage(page.number)">{{page.text}}</a>\n    <span ng-if="page.active">{{page.text}}</span>\n  </li>\n</ul>\n')}])}(),angular.module("mm.foundation.position",[]).factory("$position",["$document","$window",function(e,t){"ngInject";function n(e,n){return e.currentStyle?e.currentStyle[n]:t.getComputedStyle?t.getComputedStyle(e)[n]:e.style[n]}function o(e){return"static"===(n(e,"position")||"static")}var a=function(t){for(var n=e[0],a=t.offsetParent||n;a&&a!==n&&o(a);)a=a.offsetParent;return a||n};return{position:function(t){var n=this.offset(t),o={top:0,left:0},i=a(t[0]);i!=e[0]&&(o=this.offset(angular.element(i)),o.top+=i.clientTop-i.scrollTop,o.left+=i.clientLeft-i.scrollLeft);var r=t[0].getBoundingClientRect();return{width:r.width||t.prop("offsetWidth"),height:r.height||t.prop("offsetHeight"),top:n.top-o.top,left:n.left-o.left}},offset:function(n){var o=n[0].getBoundingClientRect();return{width:o.width||n.prop("offsetWidth"),height:o.height||n.prop("offsetHeight"),top:o.top+(t.pageYOffset||e[0].body.scrollTop||e[0].documentElement.scrollTop),left:o.left+(t.pageXOffset||e[0].body.scrollLeft||e[0].documentElement.scrollLeft)}}}}]),angular.module("mm.foundation.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig","$animate",function(e,t,n,o){"ngInject";var a=this,i=[],r=angular.isDefined(t.max)?e.$parent.$eval(t.max):n.max,l=angular.isDefined(t.animate)?e.$parent.$eval(t.animate):n.animate;this.addBar=function(e,t){var n=0,o=e.$parent.$index;angular.isDefined(o)&&i[o]&&(n=i[o].value),i.push(e),this.update(t,e.value,n),e.$watch("value",function(e,n){e!==n&&a.update(t,e,n)}),e.$on("$destroy",function(){a.removeBar(e)})},this.update=function(e,t,n){var a=this.getPercentage(t);l?(e.css("width",this.getPercentage(n)+"%"),o.animate(e,{width:this.getPercentage(n)+"%"},{width:a+"%"})):e.css({transition:"none",width:a+"%"})},this.removeBar=function(e){i.splice(i.indexOf(e),1)},this.getPercentage=function(e){return Math.round(100*e/r)}}]).directive("progress",function(){"ngInject";return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},template:'<div class="progress" ng-transclude></div>'}}).directive("bar",function(){"ngInject";return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(e,t,n,o){o.addBar(e,t)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(e,t,n,o){o.addBar(e,angular.element(t.children()[0]))}}}),function(){angular.module("mm.foundation.progressbar").run(["$templateCache",function(e){e.put("template/progressbar/bar.html",'<span class="meter" ng-transclude></span>\n'),e.put("template/progressbar/progress.html",'<div class="progress" ng-class="type" ng-transclude></div>\n'),e.put("template/progressbar/progressbar.html",'<div class="progress" role="progressbar" ng-class="type">\n  <span class="progress-meter"><p class="progress-meter-text" ng-transclude></p></span>\n</div>\n')}])}(),angular.module("mm.foundation.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","$parse","ratingConfig",function(e,t,n,o){this.maxRange=angular.isDefined(t.max)?e.$parent.$eval(t.max):o.max,this.stateOn=angular.isDefined(t.stateOn)?e.$parent.$eval(t.stateOn):o.stateOn,this.stateOff=angular.isDefined(t.stateOff)?e.$parent.$eval(t.stateOff):o.stateOff,this.createRateObjects=function(e){for(var t={stateOn:this.stateOn,stateOff:this.stateOff},n=0,o=e.length;o>n;n++)e[n]=angular.extend({index:n},t,e[n]);return e},e.range=angular.isDefined(t.ratingStates)?this.createRateObjects(angular.copy(e.$parent.$eval(t.ratingStates))):this.createRateObjects(new Array(this.maxRange)),e.rate=function(t){e.value===t||e.readonly||(e.value=t)},e.enter=function(t){e.readonly||(e.val=t),e.onHover({value:t})},e.reset=function(){e.val=angular.copy(e.value),e.onLeave()},e.$watch("value",function(t){e.val=t}),e.readonly=!1,t.readonly&&e.$parent.$watch(n(t.readonly),function(t){e.readonly=!!t})}]).directive("rating",function(){return{restrict:"EA",scope:{value:"=",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0}}),function(){angular.module("mm.foundation.rating").run(["$templateCache",function(e){e.put("template/rating/rating.html",'<span ng-mouseleave="reset()">\n  <i ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="fa"\n    ng-class="$index < val && (r.stateOn || \'fa-star\') || (r.stateOff || \'fa-star-o\')"></i>\n</span>\n')}])}(),angular.module("mm.foundation.tabs",[]).controller("TabsetController",["$scope",function(e){"ngInject";var t=this,n=t.tabs=e.tabs=[];angular.isUndefined(e.openOnLoad)&&(e.openOnLoad=!0),t.select=function(e){angular.forEach(n,function(e){e.active=!1}),e.active=!0},t.addTab=function(o){n.push(o),e.openOnLoad&&(1===n.length||o.active)&&t.select(o)},t.removeTab=function(e){var o=n.indexOf(e);if(e.active&&n.length>1){var a=o==n.length-1?o-1:o+1;t.select(n[a])}n.splice(o,1)}}]).directive("tabset",function(){"ngInject";return{restrict:"EA",transclude:!0,replace:!0,scope:{openOnLoad:"=?"},controller:"TabsetController",templateUrl:function(e,t){var n="true"==t.vertical?"vertical":"horizontal";return"template/tabs/tabset-"+n+".html"},link:function(e,t,n){e.vertical=angular.isDefined(n.vertical)?e.$parent.$eval(n.vertical):!1,e.justified=angular.isDefined(n.justified)?e.$parent.$eval(n.justified):!1,e.type=angular.isDefined(n.type)?e.$parent.$eval(n.type):"tabs"}}}).directive("tab",["$parse",function(e){"ngInject";return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(t,n,o){return function(t,n,a,i){var r,l;a.active?(r=e(a.active),l=r.assign,t.$parent.$watch(r,function(e,n){e!==n&&(t.active=!!e)}),t.active=r(t.$parent)):l=r=angular.noop,t.$watch("active",function(e){angular.isFunction(l)&&(l(t.$parent,e),e?(i.select(t),t.onSelect(),t.$emit("change.af.tabs",n)):t.onDeselect())}),t.disabled=!1,a.disabled&&t.$parent.$watch(e(a.disabled),function(e){t.disabled=!!e}),t.select=function(){t.disabled||(t.active=!0)},i.addTab(t),t.$on("$destroy",function(){i.removeTab(t)}),t.$transcludeFn=o}}}}]).directive("tabHeadingTransclude",function(){"ngInject";return{restrict:"A",require:"^tab",link:function(e,t,n,o){e.$watch("headingElement",function(e){e&&(t.html(""),t.append(e))})}}}).directive("tabContentTransclude",function(){"ngInject";function e(e){return e.tagName&&(e.hasAttribute("tab-heading")||e.hasAttribute("data-tab-heading")||"tab-heading"===e.tagName.toLowerCase()||"data-tab-heading"===e.tagName.toLowerCase());
}return{restrict:"A",require:"^tabset",link:function(t,n,o){var a=t.$eval(o.tabContentTransclude);a.$transcludeFn(a.$parent,function(t){angular.forEach(t,function(t){e(t)?a.headingElement=t:n.append(t)})})}}}),function(){angular.module("mm.foundation.tabs").run(["$templateCache",function(e){e.put("template/tabs/tab.html",'<li class="tabs-title" ng-class="{\'is-active\': active}">\n  <a ng-click="select()" ng-attr-aria-selected="{{active}}" tab-heading-transclude>{{heading}}</a>\n</li>\n'),e.put("template/tabs/tabset-horizontal.html",'<div class="tabbable">\n  <ul class="tabs" ng-transclude></ul>\n  <div class="tabs-content">\n    <div class="tabs-panel"\n      ng-repeat="tab in tabs"\n      ng-class="{\'is-active\': tab.active}">\n      <div tab-content-transclude="tab"></div>\n    </div>\n  </div>\n</div>\n'),e.put("template/tabs/tabset-vertical.html",'<div class="tabbable row collapse">\n  <div class="medium-3 columns">\n    <ul class="tabs vertical" ng-transclude></ul>\n  </div>\n  <div class="medium-9 columns">\n    <div class="tabs-content vertical">\n      <div class="tabs-panel"\n        ng-repeat="tab in tabs"\n        ng-class="{\'is-active\': tab.active}">\n        <div tab-content-transclude="tab"></div>\n      </div>\n    </div>\n  </div>\n</div>\n')}])}(),angular.module("mm.foundation.tooltip",["mm.foundation.position","mm.foundation.bindHtml"]).provider("$tooltip",function(){"ngInject";function e(e){var t=/[A-Z]/g,n="-";return e.replace(t,function(e,t){return(t?n:"")+e.toLowerCase()})}var t={placement:"top",popupDelay:0},n={mouseover:"mouseout",click:"click",focus:"blur"},o={};this.options=function(e){angular.extend(o,e)},this.setTriggers=function(e){angular.extend(n,e)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate","$animate",function(a,i,r,l,s,c,u,d){return function(a,p,f){function g(e){var t=(e||m.trigger||f).split(" "),o=t.map(function(e){return n[e]||e});return{show:t,hide:o}}var m=angular.extend({},t,o),v=e(a),h=u.startSymbol(),b=u.endSymbol(),$="<div "+v+'-popup title="'+h+"tt_title"+b+'" content="'+h+"tt_content"+b+'" placement="'+h+"tt_placement"+b+'" is-open="tt_isOpen"></div>';return{restrict:"EA",scope:!0,compile:function(e){var t=i($);return function(e,n,o){function i(){e.tt_isOpen?f():u()}function u(){x&&!e.$eval(o[p+"Enable"])||(e.tt_popupDelay?(C=r(v,e.tt_popupDelay,!1),C.then(function(e){e()},angular.noop)):v()())}function f(){e.$apply(function(){h()})}function v(){return e.tt_content?(b(),y.css({top:0,left:0}),k?d.enter(y,s.find("body")):d.enter(y,n.parent(),n),O(),e.tt_isOpen=!0,e.$digest(),O):angular.noop}function h(){e.tt_isOpen=!1,r.cancel(C),$()}function b(){y&&$(),y=t(e,function(){}),e.$digest()}function $(){y&&(d.leave(y),y=null)}var y,C,k=angular.isDefined(m.appendToBody)?m.appendToBody:!1,w=g(void 0),x=angular.isDefined(o[p+"Enable"]),O=function(){var t,o,a,i;switch(t=k?c.offset(n):c.position(n),o=y.prop("offsetWidth"),a=y.prop("offsetHeight"),e.tt_placement){case"right":i={top:t.top+t.height/2-a/2,left:t.left+t.width+10};break;case"bottom":i={top:t.top+t.height+10,left:t.left-o/2+t.width/2};break;case"left":i={top:t.top+t.height/2-a/2,left:t.left-o-10};break;default:i={top:t.top-a-10,left:t.left-o/2+t.width/2}}i.top+="px",i.left+="px",y.css(i)};e.tt_isOpen=!1,o.$observe(a,function(t){e.tt_content=t,!t&&e.tt_isOpen&&h()}),o.$observe(p+"Title",function(t){e.tt_title=t}),o[p+"Placement"]=o[p+"Placement"]||null,o.$observe(p+"Placement",function(t){e.tt_placement=angular.isDefined(t)&&t?t:m.placement}),o[p+"PopupDelay"]=o[p+"PopupDelay"]||null,o.$observe(p+"PopupDelay",function(t){var n=parseInt(t,10);e.tt_popupDelay=isNaN(n)?m.popupDelay:n});var T=function(){w.show.forEach(function(e,t){var o=w.hide[t];e===o?n.off(e,i):(n.off(e,u),n.off(o,f))})};o[p+"Trigger"]=o[p+"Trigger"]||null,o.$observe(p+"Trigger",function(e){T(),w=g(e),w.show.forEach(function(e,t){var o=w.hide[t];e===o?n.bind(e,i):(n.bind(e,u),n.bind(o,f))}),n.on("keydown",function(e){27===e.which&&f()})}),o.$observe(p+"AppendToBody",function(t){k=angular.isDefined(t)?l(t)(e):k}),k&&e.$on("$locationChangeSuccess",function(){e.tt_isOpen&&h()}),e.$on("$destroy",function(){r.cancel(C),T(),$()})}}}}}]}).directive("tooltipPopup",function(){"ngInject";return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(e){"ngInject";return e("tooltip","tooltip","mouseover")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(e){"ngInject";return e("tooltipHtmlUnsafe","tooltip","mouseover")}]),function(){angular.module("mm.foundation.tooltip").run(["$templateCache",function(e){e.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" style="width: auto;">\n  <span bind-html-unsafe="content"></span>\n</div>\n'),e.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" style="width: auto;">\n  <span ng-bind="content"></span>\n</div>\n')}])}(),angular.module("mm.foundation",["mm.foundation.accordion","mm.foundation.alert","mm.foundation.bindHtml","mm.foundation.buttons","mm.foundation.dropdownMenu","mm.foundation.dropdownToggle","mm.foundation.mediaQueries","mm.foundation.modal","mm.foundation.offcanvas","mm.foundation.pagination","mm.foundation.position","mm.foundation.progressbar","mm.foundation.rating","mm.foundation.tabs","mm.foundation.tooltip"])});