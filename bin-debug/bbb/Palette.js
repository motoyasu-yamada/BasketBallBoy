var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Palette = (function () {
    function Palette() {
    }
    ;
    Palette.Primary = 0x4abdac;
    Palette.Secondary = 0xfc4a1a;
    Palette.BackgroundA = 0xf78733;
    Palette.BackgroundB = 0xf99246;
    Palette.SecondaryOpposite = 0xdfdce3;
    Palette.TitleBackground = Palette.Primary;
    Palette.TitleText = Palette.SecondaryOpposite;
    Palette.Ball = Palette.Primary;
    Palette.BallBorder = Palette.SecondaryOpposite;
    Palette.BasketRim = Palette.Secondary;
    Palette.BasketRimBorder = Palette.SecondaryOpposite;
    Palette.BasketNet = Palette.SecondaryOpposite;
    Palette.Ground = Palette.Secondary;
    Palette.SkyA = Palette.BackgroundA;
    Palette.SkyB = Palette.BackgroundA;
    Palette.TimeGauge = Palette.SecondaryOpposite;
    Palette.Score = Palette.SecondaryOpposite;
    Palette.GameOverBackground = Palette.SecondaryOpposite;
    Palette.GameOverText = Palette.Secondary;
    return Palette;
}());
__reflect(Palette.prototype, "Palette");
//# sourceMappingURL=Palette.js.map