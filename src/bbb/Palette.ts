class Palette
{
    static Primary : number = 0x4abdac;
    static Secondary : number = 0xfc4a1a;
    static BackgroundA : number = 0xf78733;
    static BackgroundB: number = 0xf99246;
    static SecondaryOpposite = 0xdfdce3;

    static TitleBackground = Palette.Primary;
    static TitleText = Palette.SecondaryOpposite;

    static Ball = Palette.Primary;;
    static BallBorder = Palette.SecondaryOpposite;

    static BasketRim = Palette.Secondary;
    static BasketRimBorder = Palette.SecondaryOpposite;
    static BasketNet = Palette.SecondaryOpposite;

    static Ground = Palette.Secondary;

    static SkyA = Palette.BackgroundA;
    static SkyB = Palette.BackgroundA;

    static TimeGauge = Palette.SecondaryOpposite;
    static Score = Palette.SecondaryOpposite;

    static GameOverBackground = Palette.SecondaryOpposite;
    static GameOverText = Palette.Secondary;
}