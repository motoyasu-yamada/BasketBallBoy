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
var ScoreUi = (function (_super) {
    __extends(ScoreUi, _super);
    function ScoreUi() {
        var _this = _super.call(this, "ScoreUi") || this;
        _this.score = 0;
        return _this;
    }
    ScoreUi.prototype.reset = function () {
        this.score = 0;
    };
    Object.defineProperty(ScoreUi.prototype, "lastScore", {
        get: function () {
            return this.score;
        },
        enumerable: true,
        configurable: true
    });
    ScoreUi.prototype.countup = function () {
        this.score++;
        this.textField.text = this.score.toString();
    };
    ScoreUi.prototype.createDisplay = function () {
        this.textField = new egret.TextField();
        this.textField.x = 50;
        this.textField.y = 100;
        this.textField.size = 30;
        this.textField.textColor = 0xffffff;
        return this.textField;
    };
    ScoreUi.prototype.process = function () {
    };
    return ScoreUi;
}(GameObject));
__reflect(ScoreUi.prototype, "ScoreUi");
//# sourceMappingURL=ScoreUi.js.map