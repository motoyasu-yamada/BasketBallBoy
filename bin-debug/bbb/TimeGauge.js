var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var TimeGauge = (function (_super) {
    __extends(TimeGauge, _super);
    function TimeGauge(remainedSecond) {
        if (remainedSecond === void 0) { remainedSecond = 30; }
        var _this = _super.call(this, "TimeGauge") || this;
        _this.courseOut = false;
        _this.remainedSecondOnStart = remainedSecond;
        _this.restTimeMiliseconds = remainedSecond * 1000;
        return _this;
    }
    TimeGauge.prototype.createDisplay = function () {
        var sprite = new egret.Sprite();
        var g = sprite.graphics;
        g.clear();
        if (!this.isTimeOver()) {
            g.lineStyle(0);
            g.beginFill(0x0000ff, 0.8);
            g.drawRect(0, 0, GameWorld.stageWidth * this.restTimeMiliseconds / this.remainedSecondOnStart / 1000, 30);
            g.endFill();
        }
        g.lineStyle(2, 0xffffff, 0.8);
        g.beginFill(0x8080ff, 0);
        g.drawRect(0, 0, GameWorld.stageWidth, 30);
        g.endFill();
        return sprite;
    };
    TimeGauge.prototype.isTimeOver = function () {
        return this.restTimeMiliseconds <= 0;
    };
    TimeGauge.prototype.reduceByCourseOut = function () {
        this.courseOut = true;
    };
    TimeGauge.prototype.process = function () {
        if (this.courseOut) {
            this.restTimeMiliseconds -= 3000;
            this.courseOut = false;
        }
        else {
            this.restTimeMiliseconds -= 1000 / FPS;
        }
        this.resetDisplay();
        if (this.isTimeOver()) {
            GameWorld.emit("gameover");
        }
    };
    return TimeGauge;
}(GameObject));
__reflect(TimeGauge.prototype, "TimeGauge");
//# sourceMappingURL=TimeGauge.js.map