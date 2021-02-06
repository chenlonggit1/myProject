
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/game_writer/writerDemo');
require('./assets/game_writer/writer/writer');

                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game_writer/writerDemo.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4e4a5ivpPJGqbfnAqdVazQx', 'writerDemo');
// game_writer/writerDemo.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("./writer/writer");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Demo = /** @class */ (function (_super) {
    __extends(Demo, _super);
    function Demo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.writerNode = null;
        return _this;
    }
    Demo.prototype.start = function () {
        this.writerNode = this.node.getChildByName('writer');
    };
    Demo.prototype.onChangeShowStatusClick = function (el) {
        if (el.currentTarget.children[0].getComponentInChildren(cc.Label).string == '隐藏') {
            this.writerNode.active = false;
            el.currentTarget.children[0].getComponentInChildren(cc.Label).string = '显示';
        }
        else if (el.currentTarget.children[0].getComponentInChildren(cc.Label).string == '显示') {
            this.writerNode.active = true;
            el.currentTarget.children[0].getComponentInChildren(cc.Label).string = '隐藏';
        }
    };
    Demo.prototype.onChangeLabelClick = function () {
        this.writerNode.active = true;
        var str = '秦时明月汉时关万里长征人未还但使龙城飞将在不教胡马渡阴山';
        var labelText = str[Math.floor(Math.random() * str.length)];
        this.writerNode.getComponent(cc.Label).string = labelText;
        this.writerNode.getComponent(writer_1.default).changeLabel();
    };
    Demo.prototype.onAnimateClick = function () {
        this.writerNode.getComponent(writer_1.default).animateCharacter();
    };
    Demo = __decorate([
        ccclass
    ], Demo);
    return Demo;
}(cc.Component));
exports.default = Demo;

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcZ2FtZV93cml0ZXJcXHdyaXRlckRlbW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXFDO0FBRS9CLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQWtDLHdCQUFZO0lBQTlDO1FBQUEscUVBMEJDO1FBekJRLGdCQUFVLEdBQVksSUFBSSxDQUFDOztJQXlCcEMsQ0FBQztJQXhCQSxvQkFBSyxHQUFMO1FBQ0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0Qsc0NBQXVCLEdBQXZCLFVBQXdCLEVBQUU7UUFDekIsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUN4RSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDeEMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDNUU7YUFBTSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQy9FLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN2QyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUM1RTtJQUNGLENBQUM7SUFFRCxpQ0FBa0IsR0FBbEI7UUFDQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDOUIsSUFBTSxHQUFHLEdBQUcsOEJBQThCLENBQUM7UUFDM0MsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsNkJBQWMsR0FBZDtRQUNDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUF6Qm1CLElBQUk7UUFEeEIsT0FBTztPQUNhLElBQUksQ0EwQnhCO0lBQUQsV0FBQztDQTFCRCxBQTBCQyxDQTFCaUMsRUFBRSxDQUFDLFNBQVMsR0EwQjdDO2tCQTFCb0IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXcml0ZXIgZnJvbSAnLi93cml0ZXIvd3JpdGVyJztcblxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcblxuQGNjY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbW8gZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXHRwcml2YXRlIHdyaXRlck5vZGU6IGNjLk5vZGUgPSBudWxsO1xuXHRzdGFydCgpIHtcblx0XHR0aGlzLndyaXRlck5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ3dyaXRlcicpO1xuXHR9XG5cdG9uQ2hhbmdlU2hvd1N0YXR1c0NsaWNrKGVsKSB7XG5cdFx0aWYgKGVsLmN1cnJlbnRUYXJnZXQuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjYy5MYWJlbCkuc3RyaW5nID09ICfpmpDol48nKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlck5vZGUuYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRlbC5jdXJyZW50VGFyZ2V0LmNoaWxkcmVuWzBdLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpLnN0cmluZyA9ICfmmL7npLonO1xuXHRcdH0gZWxzZSBpZiAoZWwuY3VycmVudFRhcmdldC5jaGlsZHJlblswXS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkxhYmVsKS5zdHJpbmcgPT0gJ+aYvuekuicpIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVyTm9kZS5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0ZWwuY3VycmVudFRhcmdldC5jaGlsZHJlblswXS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLkxhYmVsKS5zdHJpbmcgPSAn6ZqQ6JePJztcblx0XHR9XG5cdH1cblxuXHRvbkNoYW5nZUxhYmVsQ2xpY2soKSB7XG5cdFx0dGhpcy53cml0ZXJOb2RlLmFjdGl2ZSA9IHRydWU7XG5cdFx0Y29uc3Qgc3RyID0gJ+enpuaXtuaYjuaciOaxieaXtuWFs+S4h+mHjOmVv+W+geS6uuacqui/mOS9huS9v+m+meWfjumjnuWwhuWcqOS4jeaVmeiDoemprOa4oemYtOWxsSc7XG5cdFx0Y29uc3QgbGFiZWxUZXh0ID0gc3RyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN0ci5sZW5ndGgpXTtcblx0XHR0aGlzLndyaXRlck5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBsYWJlbFRleHQ7XG5cdFx0dGhpcy53cml0ZXJOb2RlLmdldENvbXBvbmVudChXcml0ZXIpLmNoYW5nZUxhYmVsKCk7XG5cdH1cblxuXHRvbkFuaW1hdGVDbGljaygpIHtcblx0XHR0aGlzLndyaXRlck5vZGUuZ2V0Q29tcG9uZW50KFdyaXRlcikuYW5pbWF0ZUNoYXJhY3RlcigpO1xuXHR9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/game_writer/writer/writer.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2609dFBnkVIi5jozWtHkI9O', 'writer');
// game_writer/writer/writer.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var _vec3 = cc.v3();
var _domCount = 0;
var LEFT_PADDING = -5;
var BOTTOM_PADDING = -20;
var Writer = /** @class */ (function (_super) {
    __extends(Writer, _super);
    function Writer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.writer = null;
        _this._label = '';
        _this._showOutline = false;
        _this.outlineColor = cc.color(221, 221, 221);
        _this.strokeColor = cc.color(239, 42, 42);
        _this.highlightColor = cc.color(22, 143, 22);
        _this.drawingColor = cc.color(32, 215, 102);
        _this.radicalColor = cc.color(32, 215, 197);
        _this.strokeAnimationSpeed = 1;
        _this.strokeHighlightSpeed = 2;
        _this.delayBetweenStrokes = 1000;
        _this.delayBetweenLoops = 2000;
        _this.showHintAfterMisses = 1;
        _this.drawingWidth = 20;
        _this.highlightOnComplete = true;
        _this.onComplete = new cc.Component.EventHandler();
        _this.onCorrectStroke = new cc.Component.EventHandler();
        _this.onMistake = new cc.Component.EventHandler();
        _this._writerActive = false;
        _this._padding = 20; // 绘画区域的外扩面积
        _this._worldMat = null;
        _this._m00 = 0;
        _this._m01 = 0;
        _this._m04 = 0;
        _this._m05 = 0;
        _this._m12 = 0;
        _this._m13 = 0;
        _this._w = 0;
        _this._h = 0;
        _this._scaleX = 1;
        _this._scaleY = 0;
        _this._labelWidth = 0;
        _this._labelHeight = 0;
        _this._cacheViewportRect = null;
        _this._elem = null;
        _this._domId = '';
        _this._hasInit = false;
        _this._eventListeners = {};
        _this._cameraMat = null;
        return _this;
    }
    Object.defineProperty(Writer.prototype, "writerActive", {
        get: function () {
            return this._writerActive;
        },
        set: function (newVal) {
            if (this._writerActive == newVal)
                return;
            this._writerActive = newVal;
            this._updateActive();
        },
        enumerable: false,
        configurable: true
    });
    Writer.prototype._init = function () {
        this._label = this.node.getComponent(cc.Label).string;
        this._labelWidth = this.node.width;
        this._labelHeight = this.node.height;
        this._domId = "WriteBox" + ++_domCount;
        this._elem = null;
        this._worldMat = new cc.Mat4();
        this._cameraMat = new cc.Mat4();
        this._m00 = 0;
        this._m01 = 0;
        this._m04 = 0;
        this._m05 = 0;
        this._m12 = 0;
        this._m13 = 0;
        this._w = 0;
        this._h = 0;
        this._cacheViewportRect = cc.rect(0, 0, 0, 0);
        this.initHanzi();
        this.node.getComponent(cc.Label).enabled = false;
        this._hasInit = true;
    };
    Writer.prototype._createDom = function () {
        this._elem = document.createElement('div');
    };
    Writer.prototype._initStyleSheet = function () {
        var elem = this._elem;
        // elem.style.display = 'none';
        elem.style.border = '0';
        elem.style.background = 'transparent';
        elem.style.width = '100%';
        elem.style.height = '100%';
        elem.style.padding = '0';
        elem.style.position = 'absolute';
        elem.style.bottom = BOTTOM_PADDING + 'px';
        elem.style.left = LEFT_PADDING + 'px';
        elem.id = this._domId;
    };
    Writer.prototype._addDomToGameContainer = function () {
        cc.game.container.appendChild(this._elem);
    };
    Writer.prototype._updateMatrix = function () {
        var node = this.node;
        cc.log(this._worldMat);
        node.getWorldMatrix(this._worldMat);
        var worldMat = this._worldMat;
        var worldMatm = worldMat.m;
        var localView = cc.view;
        // 检测是否需要挪动位置
        if (this._m00 === worldMatm[0] &&
            this._m01 === worldMatm[1] &&
            this._m04 === worldMatm[4] &&
            this._m05 === worldMatm[5] &&
            this._m12 === worldMatm[12] &&
            this._m13 === worldMatm[13] &&
            this._w === node.getContentSize().width &&
            this._h === node.getContentSize().height &&
            this._cacheViewportRect.equals(localView.getViewportRect())) {
            return;
        }
        // 更新矩阵缓存
        this._m00 = worldMatm[0];
        this._m01 = worldMatm[1];
        this._m04 = worldMatm[4];
        this._m05 = worldMatm[5];
        this._m12 = worldMatm[12];
        this._m13 = worldMatm[13];
        this._w = node.getContentSize().width;
        this._h = node.getContentSize().height;
        // 更新视图缓存 需要判断缩放和锚点
        this._cacheViewportRect.set(localView.getViewportRect());
        // @ts-ignore
        var scaleX = localView._scaleX;
        // @ts-ignore
        var scaleY = localView._scaleY;
        // @ts-ignore
        var viewport = localView._viewportRect;
        // @ts-ignore
        var dpr = localView._devicePixelRatio;
        // @ts-ignore
        _vec3.x = -node._anchorPoint.x * this._w;
        // @ts-ignore
        _vec3.y = -node._anchorPoint.y * this._h;
        cc.Mat4.transform(worldMat, worldMat, _vec3);
        var cameraMat;
        var camera = cc.Camera.findCamera(node);
        camera.getWorldToScreenMatrix2D(this._cameraMat);
        cameraMat = this._cameraMat;
        // @ts-ignore
        cc.Mat4.mul(cameraMat, cameraMat, worldMat);
        scaleX /= dpr;
        scaleY /= dpr;
        var container = cc.game.container;
        var cameraMatm = cameraMat.m;
        var a = cameraMatm[0] * scaleX, b = cameraMatm[1], c = cameraMatm[4], d = cameraMatm[5] * scaleY;
        this._scaleX = a;
        this._scaleY = d;
        var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
        offsetX += viewport.x / dpr;
        var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        offsetY += viewport.y / dpr;
        var tx = cameraMatm[12] * scaleX + offsetX, ty = cameraMatm[13] * scaleY + offsetY;
        var elem = this._elem;
        var matrix = 'matrix(' + 1 + ',' + -b + ',' + -c + ',' + 1 + ',' + tx + ',' + -ty + ')';
        elem.style['transform'] = matrix;
        elem.style['-webkit-transform'] = matrix;
        elem.style['transform-origin'] = '0px 100% 0px';
        elem.style['-webkit-transform-origin'] = '0px 100% 0px';
    };
    Writer.prototype._updateHanzi = function () {
        this._labelWidth = this.node.width;
        this._labelHeight = this.node.height;
        this.destroySelf();
        this.initHanzi();
    };
    Writer.prototype._updateActive = function () {
        if (this._writerActive) {
            if (!this._hasInit) {
                this._init();
            }
            else {
                this._showDom();
            }
        }
        else {
            this._hideDom();
        }
    };
    Writer.prototype._showDom = function () {
        this._updateMatrix();
        this._elem.style.display = '';
    };
    Writer.prototype._hideDom = function () {
        this._elem.style.display = 'none';
    };
    Writer.prototype._clear = function () {
        if (document.getElementById(this._domId)) {
            document.getElementById(this._domId).remove();
        }
    };
    Writer.prototype._registerEventListeners = function () {
        var impl = this;
        var cbs = this._eventListeners;
        cbs.onResize = function () {
            impl._updateMatrix();
        };
        cbs.POSITION_CHANGED = function () {
            impl._updateMatrix();
        };
        cbs.SIZE_CHANGED = function () {
            impl._updateHanzi();
        };
        cbs.ANCHOR_CHANGED = function () {
            impl._updateMatrix();
        };
        window.addEventListener('resize', cbs.onResize);
        window.addEventListener('orientationchange', cbs.onResize);
        this.node.on(cc.Node.EventType.POSITION_CHANGED, cbs.POSITION_CHANGED, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, cbs.SIZE_CHANGED, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, cbs.ANCHOR_CHANGED, this);
    };
    Writer.prototype._removeEventListeners = function () {
        var cbs = this._eventListeners;
        window.removeEventListener('resize', cbs.onResize);
        window.removeEventListener('orientationchange', cbs.onResize);
        this.node.off(cc.Node.EventType.POSITION_CHANGED, cbs.POSITION_CHANGED, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, cbs.SIZE_CHANGED, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, cbs.ANCHOR_CHANGED, this);
    };
    Writer.prototype.initHanzi = function () {
        this._createDom();
        this._initStyleSheet();
        this._updateMatrix();
        this.setSize();
        this._addDomToGameContainer();
        this._registerEventListeners();
        // @ts-ignore
        this.writer = HanziWriter.create(this._domId, this._label, {
            width: (this._labelWidth + this._padding * 2) * this._scaleX,
            height: (this._labelHeight + this._padding * 2) * this._scaleY,
            padding: this._padding * this._scaleX,
            showHintAfterMisses: this.showHintAfterMisses,
            strokeColor: '#' + this.strokeColor.toHEX('#rrggbb'),
            highlightColor: '#' + this.highlightColor.toHEX('#rrggbb'),
            radicalColor: '#' + this.radicalColor.toHEX('#rrggbb'),
            outlineColor: '#' + this.outlineColor.toHEX('#rrggbb'),
            drawingColor: '#' + this.drawingColor.toHEX('#rrggbb'),
            drawingWidth: this.drawingWidth,
            strokeAnimationSpeed: this.strokeAnimationSpeed,
            delayBetweenStrokes: this.delayBetweenStrokes,
            highlightOnComplete: this.highlightOnComplete,
            strokeHighlightSpeed: this.strokeHighlightSpeed,
            delayBetweenLoops: this.delayBetweenLoops
        });
        var component = this;
        this.writer.quiz({
            onComplete: function (summaryData) {
                cc.log('complete');
                cc.Component.EventHandler.emitEvents([component.onComplete], summaryData, component);
            },
            onCorrectStroke: function (strokeData) {
                cc.log('当前的笔画编号:' + strokeData.strokeNum);
                cc.Component.EventHandler.emitEvents([component.onCorrectStroke], strokeData, component);
            },
            onMistake: function (strokeData) {
                cc.log('error');
                cc.Component.EventHandler.emitEvents([component.onMistake], strokeData, component);
            }
        });
    };
    Writer.prototype.show = function () {
        this._showDom();
    };
    Writer.prototype.hide = function () {
        this._hideDom();
    };
    Writer.prototype.destroySelf = function () {
        this._elem = null;
        this._removeEventListeners();
        this._clear();
    };
    // 改变cocos内的label之后调用这个方法
    Writer.prototype.changeLabel = function () {
        this._clear();
        this._init();
    };
    Writer.prototype.animateCharacter = function () {
        this.writer.animateCharacter();
    };
    Writer.prototype.setSize = function () {
        var elem = this._elem;
        elem.style.width = (this._labelWidth + this._padding * 2) * this._scaleX + 'px';
        elem.style.height = (this._labelHeight + this._padding * 2) * this._scaleY + 'px';
    };
    Writer.prototype.onEnable = function () {
        this._init();
    };
    Writer.prototype.onDisable = function () {
        this.destroySelf();
    };
    __decorate([
        property()
    ], Writer.prototype, "_showOutline", void 0);
    __decorate([
        property({
            tooltip: '初始的颜色,即轮廓的颜色'
        })
    ], Writer.prototype, "outlineColor", void 0);
    __decorate([
        property({
            tooltip: '填充的颜色'
        })
    ], Writer.prototype, "strokeColor", void 0);
    __decorate([
        property({
            tooltip: '提示下一笔时，高亮的颜色'
        })
    ], Writer.prototype, "highlightColor", void 0);
    __decorate([
        property({
            tooltip: '画图时笔迹的颜色'
        })
    ], Writer.prototype, "drawingColor", void 0);
    __decorate([
        property({
            tooltip: '显示部首时，高亮的颜色'
        })
    ], Writer.prototype, "radicalColor", void 0);
    __decorate([
        property({
            tooltip: '在自动填充时，增大此数字可以更快地绘制笔划，减小此速度可以更慢地绘制笔划'
        })
    ], Writer.prototype, "strokeAnimationSpeed", void 0);
    __decorate([
        property({
            tooltip: '在自动填充时，增大此数字可以更快地突出显示，降低该速度可以突出显示较慢'
        })
    ], Writer.prototype, "strokeHighlightSpeed", void 0);
    __decorate([
        property({
            tooltip: '设置动画时每个笔画之间的时间（以毫秒为单位）'
        })
    ], Writer.prototype, "delayBetweenStrokes", void 0);
    __decorate([
        property({
            tooltip: '每个动画循环之间的时间（以毫秒为单位）'
        })
    ], Writer.prototype, "delayBetweenLoops", void 0);
    __decorate([
        property({
            tooltip: '错误几次自动提示下一笔'
        })
    ], Writer.prototype, "showHintAfterMisses", void 0);
    __decorate([
        property({
            tooltip: '画图时笔迹的粗细'
        })
    ], Writer.prototype, "drawingWidth", void 0);
    __decorate([
        property({
            tooltip: '控制当用户完成绘制整个汉字时测验是否短暂高亮显示汉字'
        })
    ], Writer.prototype, "highlightOnComplete", void 0);
    __decorate([
        property({
            type: cc.Component.EventHandler,
            displayName: 'onComplete',
            tooltip: '完成一个字时触发'
        })
    ], Writer.prototype, "onComplete", void 0);
    __decorate([
        property({
            type: cc.Component.EventHandler,
            displayName: 'onCorrectStroke',
            tooltip: '画对一笔时触发'
        })
    ], Writer.prototype, "onCorrectStroke", void 0);
    __decorate([
        property({
            type: cc.Component.EventHandler,
            displayName: 'onMistake',
            tooltip: '当画错时触发'
        })
    ], Writer.prototype, "onMistake", void 0);
    Writer = __decorate([
        ccclass
    ], Writer);
    return Writer;
}(cc.Component));
exports.default = Writer;

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcZ2FtZV93cml0ZXJcXHdyaXRlclxcd3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFNLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRTVDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNwQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFhM0I7SUFBb0MsMEJBQVk7SUFBaEQ7UUFBQSxxRUFrWUM7UUFqWU8sWUFBTSxHQUFHLElBQUksQ0FBQztRQUNiLFlBQU0sR0FBVyxFQUFFLENBQUM7UUFHNUIsa0JBQVksR0FBWSxLQUFLLENBQUM7UUFLOUIsa0JBQVksR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFLakQsaUJBQVcsR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFLOUMsb0JBQWMsR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFJakQsa0JBQVksR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFJaEQsa0JBQVksR0FBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFLaEQsMEJBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBSXpCLDBCQUFvQixHQUFHLENBQUMsQ0FBQztRQUt6Qix5QkFBbUIsR0FBRyxJQUFJLENBQUM7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QUFTO1NBQ2xCLENBQUM7bURBQ2dEO0lBT2xEO1FBTEMsUUFBUSxDQUFDO1lBQ1QsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWTtZQUMvQixXQUFXLEVBQUUsV0FBVztZQUN4QixPQUFPLEVBQUUsUUFBUTtTQUNqQixDQUFDOzZDQUMwQztJQW5GeEIsTUFBTTtRQUQxQixPQUFPO09BQ2EsTUFBTSxDQWtZMUI7SUFBRCxhQUFDO0NBbFlELEFBa1lDLENBbFltQyxFQUFFLENBQUMsU0FBUyxHQWtZL0M7a0JBbFlvQixNQUFNIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcblxubGV0IF92ZWMzID0gY2MudjMoKTtcbmxldCBfZG9tQ291bnQgPSAwO1xuY29uc3QgTEVGVF9QQURESU5HID0gLTU7XG5jb25zdCBCT1RUT01fUEFERElORyA9IC0yMDtcbmludGVyZmFjZSBNSVNUQUtFX1NUUk9LRURBVEEge1xuXHRzdHJva2VOdW06IG51bWJlcjsgLy8g6L+Z5piv5rGJ5a2X5Lit55qE56ys5Yeg56yUXG5cdG1pc3Rha2VzT25TdHJva2U6IG51bWJlcjsgLy8g6L+Z5LiA56yU55S76ZSZ5LqG5aSa5bCR5qyhXG5cdHRvdGFsTWlzdGFrZXM6IG51bWJlcjsgLy8g5YmN6Z2i5Yeg56yU5LiA5YWx55S76ZSZ5LqG5aSa5bCR5qyhXG5cdHN0cm9rZXNSZW1haW5pbmc6IG51bWJlcjsgLy8g5q2k5a2X56ym5Lit5Ymp5L2Z55qE56yU5YiS5pWwXG5cdGRyYXduUGF0aDogb2JqZWN0OyAvLyDljIXlkKtwYXRoU3RyaW5n55So5oi357uY5Yi255qE5a+56LGh5Lul5Y+KcG9pbnRz55So5LqO6K+E5YiG55qE5a+56LGhXG59XG5pbnRlcmZhY2UgQ09NUExFVEVfU1RST0tFREFUQSB7XG5cdGNoYXJhY3Rlcjogc3RyaW5nOyAvLyDnlLvlr7nnmoTlrZfnrKbmmK/ku4DkuYhcblx0dG90YWxNaXN0YWtlczogbnVtYmVyOyAvLyDkuIDlhbHnlLvplJnkuoblpJrlsJHnrJRcbn1cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcml0ZXIgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXHRwdWJsaWMgd3JpdGVyID0gbnVsbDtcblx0cHJpdmF0ZSBfbGFiZWw6IHN0cmluZyA9ICcnO1xuXG5cdEBwcm9wZXJ0eSgpXG5cdF9zaG93T3V0bGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdEBwcm9wZXJ0eSh7XG5cdFx0dG9vbHRpcDogJ+WIneWni+eahOminOiJsizljbPova7lu5PnmoTpopzoibInXG5cdH0pXG5cdG91dGxpbmVDb2xvcjogY2MuQ29sb3IgPSBjYy5jb2xvcigyMjEsIDIyMSwgMjIxKTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHRvb2x0aXA6ICfloavlhYXnmoTpopzoibInXG5cdH0pXG5cdHN0cm9rZUNvbG9yOiBjYy5Db2xvciA9IGNjLmNvbG9yKDIzOSwgNDIsIDQyKTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHRvb2x0aXA6ICfmj5DnpLrkuIvkuIDnrJTml7bvvIzpq5jkuq7nmoTpopzoibInXG5cdH0pXG5cdGhpZ2hsaWdodENvbG9yOiBjYy5Db2xvciA9IGNjLmNvbG9yKDIyLCAxNDMsIDIyKTtcblx0QHByb3BlcnR5KHtcblx0XHR0b29sdGlwOiAn55S75Zu+5pe256yU6L+555qE6aKc6ImyJ1xuXHR9KVxuXHRkcmF3aW5nQ29sb3I6IGNjLkNvbG9yID0gY2MuY29sb3IoMzIsIDIxNSwgMTAyKTtcblx0QHByb3BlcnR5KHtcblx0XHR0b29sdGlwOiAn5pi+56S66YOo6aaW5pe277yM6auY5Lqu55qE6aKc6ImyJ1xuXHR9KVxuXHRyYWRpY2FsQ29sb3I6IGNjLkNvbG9yID0gY2MuY29sb3IoMzIsIDIxNSwgMTk3KTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHRvb2x0aXA6ICflnKjoh6rliqjloavlhYXml7bvvIzlop7lpKfmraTmlbDlrZflj6/ku6Xmm7Tlv6vlnLDnu5jliLbnrJTliJLvvIzlh4/lsI/mraTpgJ/luqblj6/ku6Xmm7TmhaLlnLDnu5jliLbnrJTliJInXG5cdH0pXG5cdHN0cm9rZUFuaW1hdGlvblNwZWVkID0gMTtcblx0QHByb3BlcnR5KHtcblx0XHR0b29sdGlwOiAn5Zyo6Ieq5Yqo5aGr5YWF5pe277yM5aKe5aSn5q2k5pWw5a2X5Y+v5Lul5pu05b+r5Zyw56qB5Ye65pi+56S677yM6ZmN5L2O6K+l6YCf5bqm5Y+v5Lul56qB5Ye65pi+56S66L6D5oWiJ1xuXHR9KVxuXHRzdHJva2VIaWdobGlnaHRTcGVlZCA9IDI7XG5cblx0QHByb3BlcnR5KHtcblx0XHR0b29sdGlwOiAn6K6+572u5Yqo55S75pe25q+P5Liq56yU55S75LmL6Ze055qE5pe26Ze077yI5Lul5q+r56eS5Li65Y2V5L2N77yJJ1xuXHR9KVxuXHRkZWxheUJldHdlZW5TdHJva2VzID0gMTAwMDtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHRvb2x0aXA6ICfmr4/kuKrliqjnlLvlvqrnjq/kuYvpl7TnmoTml7bpl7TvvIjku6Xmr6vnp5LkuLrljZXkvY3vvIknXG5cdH0pXG5cdGRlbGF5QmV0d2Vlbkxvb3BzID0gMjAwMDtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHRvb2x0aXA6ICfplJnor6/lh6DmrKHoh6rliqjmj5DnpLrkuIvkuIDnrJQnXG5cdH0pXG5cdHNob3dIaW50QWZ0ZXJNaXNzZXMgPSAxO1xuXG5cdEBwcm9wZXJ0eSh7XG5cdFx0dG9vbHRpcDogJ+eUu+WbvuaXtueslOi/ueeahOeyl+e7hidcblx0fSlcblx0ZHJhd2luZ1dpZHRoID0gMjA7XG5cblx0QHByb3BlcnR5KHtcblx0XHR0b29sdGlwOiAn5o6n5Yi25b2T55So5oi35a6M5oiQ57uY5Yi25pW05Liq5rGJ5a2X5pe25rWL6aqM5piv5ZCm55+t5pqC6auY5Lqu5pi+56S65rGJ5a2XJ1xuXHR9KVxuXHRoaWdobGlnaHRPbkNvbXBsZXRlID0gdHJ1ZTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG5cdFx0ZGlzcGxheU5hbWU6ICdvbkNvbXBsZXRlJyxcblx0XHR0b29sdGlwOiAn5a6M5oiQ5LiA5Liq5a2X5pe26Kem5Y+RJ1xuXHR9KVxuXHRvbkNvbXBsZXRlID0gbmV3IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIoKTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG5cdFx0ZGlzcGxheU5hbWU6ICdvbkNvcnJlY3RTdHJva2UnLFxuXHRcdHRvb2x0aXA6ICfnlLvlr7nkuIDnrJTml7bop6blj5EnXG5cdH0pXG5cdG9uQ29ycmVjdFN0cm9rZSA9IG5ldyBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XG5cblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuXHRcdGRpc3BsYXlOYW1lOiAnb25NaXN0YWtlJyxcblx0XHR0b29sdGlwOiAn5b2T55S76ZSZ5pe26Kem5Y+RJ1xuXHR9KVxuXHRvbk1pc3Rha2UgPSBuZXcgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcigpO1xuXG5cdHB1YmxpYyBzZXQgd3JpdGVyQWN0aXZlKG5ld1ZhbCkge1xuXHRcdGlmICh0aGlzLl93cml0ZXJBY3RpdmUgPT0gbmV3VmFsKSByZXR1cm47XG5cdFx0dGhpcy5fd3JpdGVyQWN0aXZlID0gbmV3VmFsO1xuXHRcdHRoaXMuX3VwZGF0ZUFjdGl2ZSgpO1xuXHR9XG5cblx0cHVibGljIGdldCB3cml0ZXJBY3RpdmUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3dyaXRlckFjdGl2ZTtcblx0fVxuXHRwcml2YXRlIF93cml0ZXJBY3RpdmUgPSBmYWxzZTtcblx0cHJpdmF0ZSBfcGFkZGluZyA9IDIwOyAvLyDnu5jnlLvljLrln5/nmoTlpJbmianpnaLnp69cblx0cHJpdmF0ZSBfd29ybGRNYXQ6IGNjLk1hdDQgPSBudWxsO1xuXHRwcml2YXRlIF9tMDAgPSAwO1xuXHRwcml2YXRlIF9tMDEgPSAwO1xuXHRwcml2YXRlIF9tMDQgPSAwO1xuXHRwcml2YXRlIF9tMDUgPSAwO1xuXHRwcml2YXRlIF9tMTIgPSAwO1xuXHRwcml2YXRlIF9tMTMgPSAwO1xuXHRwcml2YXRlIF93ID0gMDtcblx0cHJpdmF0ZSBfaCA9IDA7XG5cdHByaXZhdGUgX3NjYWxlWCA9IDE7XG5cdHByaXZhdGUgX3NjYWxlWSA9IDA7XG5cdHByaXZhdGUgX2xhYmVsV2lkdGggPSAwO1xuXHRwcml2YXRlIF9sYWJlbEhlaWdodCA9IDA7XG5cdHByaXZhdGUgX2NhY2hlVmlld3BvcnRSZWN0OiBjYy5SZWN0ID0gbnVsbDtcblx0cHJpdmF0ZSBfZWxlbTogSFRNTEVsZW1lbnQgPSBudWxsO1xuXHRwcml2YXRlIF9kb21JZCA9ICcnO1xuXHRwcml2YXRlIF9oYXNJbml0ID0gZmFsc2U7XG5cdHByaXZhdGUgX2V2ZW50TGlzdGVuZXJzOiBhbnkgPSB7fTtcblxuXHRfaW5pdCgpIHtcblx0XHR0aGlzLl9sYWJlbCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcblx0XHR0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5ub2RlLndpZHRoO1xuXHRcdHRoaXMuX2xhYmVsSGVpZ2h0ID0gdGhpcy5ub2RlLmhlaWdodDtcblx0XHR0aGlzLl9kb21JZCA9IGBXcml0ZUJveCR7KytfZG9tQ291bnR9YDtcblx0XHR0aGlzLl9lbGVtID0gbnVsbDtcblx0XHR0aGlzLl93b3JsZE1hdCA9IG5ldyBjYy5NYXQ0KCk7XG5cdFx0dGhpcy5fY2FtZXJhTWF0ID0gbmV3IGNjLk1hdDQoKTtcblx0XHR0aGlzLl9tMDAgPSAwO1xuXHRcdHRoaXMuX20wMSA9IDA7XG5cdFx0dGhpcy5fbTA0ID0gMDtcblx0XHR0aGlzLl9tMDUgPSAwO1xuXHRcdHRoaXMuX20xMiA9IDA7XG5cdFx0dGhpcy5fbTEzID0gMDtcblx0XHR0aGlzLl93ID0gMDtcblx0XHR0aGlzLl9oID0gMDtcblx0XHR0aGlzLl9jYWNoZVZpZXdwb3J0UmVjdCA9IGNjLnJlY3QoMCwgMCwgMCwgMCk7XG5cdFx0dGhpcy5pbml0SGFuemkoKTtcblx0XHR0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5lbmFibGVkID0gZmFsc2U7XG5cdFx0dGhpcy5faGFzSW5pdCA9IHRydWU7XG5cdH1cblx0cHJpdmF0ZSBfY3JlYXRlRG9tKCkge1xuXHRcdHRoaXMuX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0fVxuXHRwcml2YXRlIF9pbml0U3R5bGVTaGVldCgpIHtcblx0XHRsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG5cdFx0Ly8gZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdGVsZW0uc3R5bGUuYm9yZGVyID0gJzAnO1xuXHRcdGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XG5cdFx0ZWxlbS5zdHlsZS53aWR0aCA9ICcxMDAlJztcblx0XHRlbGVtLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblx0XHRlbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG5cdFx0ZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0ZWxlbS5zdHlsZS5ib3R0b20gPSBCT1RUT01fUEFERElORyArICdweCc7XG5cdFx0ZWxlbS5zdHlsZS5sZWZ0ID0gTEVGVF9QQURESU5HICsgJ3B4Jztcblx0XHRlbGVtLmlkID0gdGhpcy5fZG9tSWQ7XG5cdH1cblx0cHJpdmF0ZSBfYWRkRG9tVG9HYW1lQ29udGFpbmVyKCkge1xuXHRcdGNjLmdhbWUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2VsZW0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfY2FtZXJhTWF0OiBjYy5NYXQ0ID0gbnVsbDtcblx0cHJpdmF0ZSBfdXBkYXRlTWF0cml4KCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgY2MubG9nKHRoaXMuX3dvcmxkTWF0KVxuXHRcdG5vZGUuZ2V0V29ybGRNYXRyaXgodGhpcy5fd29ybGRNYXQpO1xuXHRcdGxldCB3b3JsZE1hdCA9IHRoaXMuX3dvcmxkTWF0O1xuXHRcdGxldCB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuXHRcdGxldCBsb2NhbFZpZXcgPSBjYy52aWV3O1xuXHRcdC8vIOajgOa1i+aYr+WQpumcgOimgeaMquWKqOS9jee9rlxuXHRcdGlmIChcblx0XHRcdHRoaXMuX20wMCA9PT0gd29ybGRNYXRtWzBdICYmXG5cdFx0XHR0aGlzLl9tMDEgPT09IHdvcmxkTWF0bVsxXSAmJlxuXHRcdFx0dGhpcy5fbTA0ID09PSB3b3JsZE1hdG1bNF0gJiZcblx0XHRcdHRoaXMuX20wNSA9PT0gd29ybGRNYXRtWzVdICYmXG5cdFx0XHR0aGlzLl9tMTIgPT09IHdvcmxkTWF0bVsxMl0gJiZcblx0XHRcdHRoaXMuX20xMyA9PT0gd29ybGRNYXRtWzEzXSAmJlxuXHRcdFx0dGhpcy5fdyA9PT0gbm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoICYmXG5cdFx0XHR0aGlzLl9oID09PSBub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0ICYmXG5cdFx0XHR0aGlzLl9jYWNoZVZpZXdwb3J0UmVjdC5lcXVhbHMobG9jYWxWaWV3LmdldFZpZXdwb3J0UmVjdCgpKVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIOabtOaWsOefqemYtee8k+WtmFxuXHRcdHRoaXMuX20wMCA9IHdvcmxkTWF0bVswXTtcblx0XHR0aGlzLl9tMDEgPSB3b3JsZE1hdG1bMV07XG5cdFx0dGhpcy5fbTA0ID0gd29ybGRNYXRtWzRdO1xuXHRcdHRoaXMuX20wNSA9IHdvcmxkTWF0bVs1XTtcblx0XHR0aGlzLl9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuXHRcdHRoaXMuX20xMyA9IHdvcmxkTWF0bVsxM107XG5cdFx0dGhpcy5fdyA9IG5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aDtcblx0XHR0aGlzLl9oID0gbm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcblxuXHRcdC8vIOabtOaWsOinhuWbvue8k+WtmCDpnIDopoHliKTmlq3nvKnmlL7lkozplJrngrlcblx0XHR0aGlzLl9jYWNoZVZpZXdwb3J0UmVjdC5zZXQobG9jYWxWaWV3LmdldFZpZXdwb3J0UmVjdCgpKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0bGV0IHNjYWxlWCA9IGxvY2FsVmlldy5fc2NhbGVYO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRsZXQgc2NhbGVZID0gbG9jYWxWaWV3Ll9zY2FsZVk7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGxldCB2aWV3cG9ydCA9IGxvY2FsVmlldy5fdmlld3BvcnRSZWN0O1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRsZXQgZHByID0gbG9jYWxWaWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRfdmVjMy54ID0gLW5vZGUuX2FuY2hvclBvaW50LnggKiB0aGlzLl93O1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRfdmVjMy55ID0gLW5vZGUuX2FuY2hvclBvaW50LnkgKiB0aGlzLl9oO1xuXG5cdFx0Y2MuTWF0NC50cmFuc2Zvcm0od29ybGRNYXQsIHdvcmxkTWF0LCBfdmVjMyk7XG5cblx0XHRsZXQgY2FtZXJhTWF0O1xuXG5cdFx0bGV0IGNhbWVyYSA9IGNjLkNhbWVyYS5maW5kQ2FtZXJhKG5vZGUpO1xuXHRcdGNhbWVyYS5nZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQodGhpcy5fY2FtZXJhTWF0KTtcblx0XHRjYW1lcmFNYXQgPSB0aGlzLl9jYW1lcmFNYXQ7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGNjLk1hdDQubXVsKGNhbWVyYU1hdCwgY2FtZXJhTWF0LCB3b3JsZE1hdCk7XG5cblx0XHRzY2FsZVggLz0gZHByO1xuXHRcdHNjYWxlWSAvPSBkcHI7XG5cblx0XHRsZXQgY29udGFpbmVyID0gY2MuZ2FtZS5jb250YWluZXI7XG5cdFx0bGV0IGNhbWVyYU1hdG0gPSBjYW1lcmFNYXQubTtcblx0XHRsZXQgYSA9IGNhbWVyYU1hdG1bMF0gKiBzY2FsZVgsXG5cdFx0XHRiID0gY2FtZXJhTWF0bVsxXSxcblx0XHRcdGMgPSBjYW1lcmFNYXRtWzRdLFxuXHRcdFx0ZCA9IGNhbWVyYU1hdG1bNV0gKiBzY2FsZVk7XG5cdFx0dGhpcy5fc2NhbGVYID0gYTtcblx0XHR0aGlzLl9zY2FsZVkgPSBkO1xuXHRcdGxldCBvZmZzZXRYID1cblx0XHRcdGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQgJiYgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0KTtcblx0XHRvZmZzZXRYICs9IHZpZXdwb3J0LnggLyBkcHI7XG5cdFx0bGV0IG9mZnNldFkgPVxuXHRcdFx0Y29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nQm90dG9tICYmIHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nQm90dG9tKTtcblx0XHRvZmZzZXRZICs9IHZpZXdwb3J0LnkgLyBkcHI7XG5cdFx0bGV0IHR4ID0gY2FtZXJhTWF0bVsxMl0gKiBzY2FsZVggKyBvZmZzZXRYLFxuXHRcdFx0dHkgPSBjYW1lcmFNYXRtWzEzXSAqIHNjYWxlWSArIG9mZnNldFk7XG5cblx0XHRsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG5cdFx0bGV0IG1hdHJpeCA9ICdtYXRyaXgoJyArIDEgKyAnLCcgKyAtYiArICcsJyArIC1jICsgJywnICsgMSArICcsJyArIHR4ICsgJywnICsgLXR5ICsgJyknO1xuXHRcdGVsZW0uc3R5bGVbJ3RyYW5zZm9ybSddID0gbWF0cml4O1xuXHRcdGVsZW0uc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSBtYXRyaXg7XG5cdFx0ZWxlbS5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XG5cdFx0ZWxlbS5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4Jztcblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZUhhbnppKCkge1xuXHRcdHRoaXMuX2xhYmVsV2lkdGggPSB0aGlzLm5vZGUud2lkdGg7XG5cdFx0dGhpcy5fbGFiZWxIZWlnaHQgPSB0aGlzLm5vZGUuaGVpZ2h0O1xuXHRcdHRoaXMuZGVzdHJveVNlbGYoKTtcblx0XHR0aGlzLmluaXRIYW56aSgpO1xuXHR9XG5cdHByaXZhdGUgX3VwZGF0ZUFjdGl2ZSgpIHtcblx0XHRpZiAodGhpcy5fd3JpdGVyQWN0aXZlKSB7XG5cdFx0XHRpZiAoIXRoaXMuX2hhc0luaXQpIHtcblx0XHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fc2hvd0RvbSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9oaWRlRG9tKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfc2hvd0RvbSgpIHtcblx0XHR0aGlzLl91cGRhdGVNYXRyaXgoKTtcblx0XHR0aGlzLl9lbGVtLnN0eWxlLmRpc3BsYXkgPSAnJztcblx0fVxuXG5cdHByaXZhdGUgX2hpZGVEb20oKSB7XG5cdFx0dGhpcy5fZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHR9XG5cdHByaXZhdGUgX2NsZWFyKCkge1xuXHRcdGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl9kb21JZCkpIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuX2RvbUlkKS5yZW1vdmUoKTtcblx0XHR9XG5cdH1cblx0cHJpdmF0ZSBfcmVnaXN0ZXJFdmVudExpc3RlbmVycygpIHtcblx0XHRsZXQgaW1wbCA9IHRoaXM7XG5cdFx0bGV0IGNicyA9IHRoaXMuX2V2ZW50TGlzdGVuZXJzO1xuXG5cdFx0Y2JzLm9uUmVzaXplID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpbXBsLl91cGRhdGVNYXRyaXgoKTtcblx0XHR9O1xuXHRcdGNicy5QT1NJVElPTl9DSEFOR0VEID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpbXBsLl91cGRhdGVNYXRyaXgoKTtcblx0XHR9O1xuXHRcdGNicy5TSVpFX0NIQU5HRUQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGltcGwuX3VwZGF0ZUhhbnppKCk7XG5cdFx0fTtcblx0XHRjYnMuQU5DSE9SX0NIQU5HRUQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGltcGwuX3VwZGF0ZU1hdHJpeCgpO1xuXHRcdH07XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNicy5vblJlc2l6ZSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgY2JzLm9uUmVzaXplKTtcblxuXHRcdHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VELCBjYnMuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcyk7XG5cdFx0dGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2JzLlNJWkVfQ0hBTkdFRCwgdGhpcyk7XG5cdFx0dGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCBjYnMuQU5DSE9SX0NIQU5HRUQsIHRoaXMpO1xuXHR9XG5cdHByaXZhdGUgX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdGxldCBjYnMgPSB0aGlzLl9ldmVudExpc3RlbmVycztcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2JzLm9uUmVzaXplKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBjYnMub25SZXNpemUpO1xuXHRcdHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgY2JzLlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMpO1xuXHRcdHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCBjYnMuU0laRV9DSEFOR0VELCB0aGlzKTtcblx0XHR0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCBjYnMuQU5DSE9SX0NIQU5HRUQsIHRoaXMpO1xuXHR9XG5cblx0cHVibGljIGluaXRIYW56aSgpIHtcblx0XHR0aGlzLl9jcmVhdGVEb20oKTtcblx0XHR0aGlzLl9pbml0U3R5bGVTaGVldCgpO1xuXHRcdHRoaXMuX3VwZGF0ZU1hdHJpeCgpO1xuXHRcdHRoaXMuc2V0U2l6ZSgpO1xuXHRcdHRoaXMuX2FkZERvbVRvR2FtZUNvbnRhaW5lcigpO1xuXHRcdHRoaXMuX3JlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMoKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0dGhpcy53cml0ZXIgPSBIYW56aVdyaXRlci5jcmVhdGUodGhpcy5fZG9tSWQsIHRoaXMuX2xhYmVsLCB7XG5cdFx0XHR3aWR0aDogKHRoaXMuX2xhYmVsV2lkdGggKyB0aGlzLl9wYWRkaW5nICogMikgKiB0aGlzLl9zY2FsZVgsXG5cdFx0XHRoZWlnaHQ6ICh0aGlzLl9sYWJlbEhlaWdodCArIHRoaXMuX3BhZGRpbmcgKiAyKSAqIHRoaXMuX3NjYWxlWSxcblx0XHRcdHBhZGRpbmc6IHRoaXMuX3BhZGRpbmcgKiB0aGlzLl9zY2FsZVgsXG5cdFx0XHRzaG93SGludEFmdGVyTWlzc2VzOiB0aGlzLnNob3dIaW50QWZ0ZXJNaXNzZXMsXG5cdFx0XHRzdHJva2VDb2xvcjogJyMnICsgdGhpcy5zdHJva2VDb2xvci50b0hFWCgnI3JyZ2diYicpLFxuXHRcdFx0aGlnaGxpZ2h0Q29sb3I6ICcjJyArIHRoaXMuaGlnaGxpZ2h0Q29sb3IudG9IRVgoJyNycmdnYmInKSxcblx0XHRcdHJhZGljYWxDb2xvcjogJyMnICsgdGhpcy5yYWRpY2FsQ29sb3IudG9IRVgoJyNycmdnYmInKSxcblx0XHRcdG91dGxpbmVDb2xvcjogJyMnICsgdGhpcy5vdXRsaW5lQ29sb3IudG9IRVgoJyNycmdnYmInKSxcblx0XHRcdGRyYXdpbmdDb2xvcjogJyMnICsgdGhpcy5kcmF3aW5nQ29sb3IudG9IRVgoJyNycmdnYmInKSxcblx0XHRcdGRyYXdpbmdXaWR0aDogdGhpcy5kcmF3aW5nV2lkdGgsXG5cdFx0XHRzdHJva2VBbmltYXRpb25TcGVlZDogdGhpcy5zdHJva2VBbmltYXRpb25TcGVlZCxcblx0XHRcdGRlbGF5QmV0d2VlblN0cm9rZXM6IHRoaXMuZGVsYXlCZXR3ZWVuU3Ryb2tlcyxcblx0XHRcdGhpZ2hsaWdodE9uQ29tcGxldGU6IHRoaXMuaGlnaGxpZ2h0T25Db21wbGV0ZSxcblx0XHRcdHN0cm9rZUhpZ2hsaWdodFNwZWVkOiB0aGlzLnN0cm9rZUhpZ2hsaWdodFNwZWVkLFxuXHRcdFx0ZGVsYXlCZXR3ZWVuTG9vcHM6IHRoaXMuZGVsYXlCZXR3ZWVuTG9vcHNcblx0XHR9KTtcblx0XHRjb25zdCBjb21wb25lbnQgPSB0aGlzO1xuXHRcdHRoaXMud3JpdGVyLnF1aXooe1xuXHRcdFx0b25Db21wbGV0ZShzdW1tYXJ5RGF0YTogQ09NUExFVEVfU1RST0tFREFUQSkge1xuXHRcdFx0XHRjYy5sb2coJ2NvbXBsZXRlJyk7XG5cdFx0XHRcdGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyhcblx0XHRcdFx0XHRbY29tcG9uZW50Lm9uQ29tcGxldGVdLFxuXHRcdFx0XHRcdHN1bW1hcnlEYXRhLFxuXHRcdFx0XHRcdGNvbXBvbmVudFxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdG9uQ29ycmVjdFN0cm9rZShzdHJva2VEYXRhOiBNSVNUQUtFX1NUUk9LRURBVEEpIHtcblx0XHRcdFx0Y2MubG9nKCflvZPliY3nmoTnrJTnlLvnvJblj7c6JyArIHN0cm9rZURhdGEuc3Ryb2tlTnVtKTtcblx0XHRcdFx0Y2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKFxuXHRcdFx0XHRcdFtjb21wb25lbnQub25Db3JyZWN0U3Ryb2tlXSxcblx0XHRcdFx0XHRzdHJva2VEYXRhLFxuXHRcdFx0XHRcdGNvbXBvbmVudFxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHRcdG9uTWlzdGFrZShzdHJva2VEYXRhOiBNSVNUQUtFX1NUUk9LRURBVEEpIHtcblx0XHRcdFx0Y2MubG9nKCdlcnJvcicpO1xuXHRcdFx0XHRjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHMoW2NvbXBvbmVudC5vbk1pc3Rha2VdLCBzdHJva2VEYXRhLCBjb21wb25lbnQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHB1YmxpYyBzaG93KCkge1xuXHRcdHRoaXMuX3Nob3dEb20oKTtcblx0fVxuXHRwdWJsaWMgaGlkZSgpIHtcblx0XHR0aGlzLl9oaWRlRG9tKCk7XG5cdH1cblx0cHVibGljIGRlc3Ryb3lTZWxmKCkge1xuXHRcdHRoaXMuX2VsZW0gPSBudWxsO1xuXHRcdHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG5cdFx0dGhpcy5fY2xlYXIoKTtcblx0fVxuXHQvLyDmlLnlj5hjb2Nvc+WGheeahGxhYmVs5LmL5ZCO6LCD55So6L+Z5Liq5pa55rOVXG5cdHB1YmxpYyBjaGFuZ2VMYWJlbCgpIHtcblx0XHR0aGlzLl9jbGVhcigpO1xuXHRcdHRoaXMuX2luaXQoKTtcblx0fVxuXHRwdWJsaWMgYW5pbWF0ZUNoYXJhY3RlcigpIHtcblx0XHR0aGlzLndyaXRlci5hbmltYXRlQ2hhcmFjdGVyKCk7XG5cdH1cblx0cHVibGljIHNldFNpemUoKSB7XG5cdFx0bGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuXHRcdGVsZW0uc3R5bGUud2lkdGggPSAodGhpcy5fbGFiZWxXaWR0aCArIHRoaXMuX3BhZGRpbmcgKiAyKSAqIHRoaXMuX3NjYWxlWCArICdweCc7XG5cdFx0ZWxlbS5zdHlsZS5oZWlnaHQgPSAodGhpcy5fbGFiZWxIZWlnaHQgKyB0aGlzLl9wYWRkaW5nICogMikgKiB0aGlzLl9zY2FsZVkgKyAncHgnO1xuXHR9XG5cblx0b25FbmFibGUoKSB7XG5cdFx0dGhpcy5faW5pdCgpO1xuXHR9XG5cblx0b25EaXNhYmxlKCkge1xuXHRcdHRoaXMuZGVzdHJveVNlbGYoKTtcblx0fVxufVxuIl19
//------QC-SOURCE-SPLIT------
