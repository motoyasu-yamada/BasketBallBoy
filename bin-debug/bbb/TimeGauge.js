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
        g.lineStyle(5, Palette.TimeGauge);
        g.beginFill(0, 0);
        g.drawRect(30, 30, GameWorld.stageWidth - 60, 60);
        g.endFill();
        if (!this.isTimeOver()) {
            g.lineStyle(0);
            g.beginFill(Palette.TimeGauge);
            g.drawRect(40, 40, (GameWorld.stageWidth - 80) * this.restTimeMiliseconds / this.remainedSecondOnStart / 1000, 40);
            g.endFill();
        }
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