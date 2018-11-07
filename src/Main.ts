const BASKET_SIZE_METER = 0.15;
const BALL_SIZE_METER = 0.6;

class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        const ballPixel = egret.MainContext.instance.stage.stageWidth / 10;
        GameWorld.init(ballPixel / BALL_SIZE_METER,this.stage);
        new Sky();
        new Ground();
        const timeGauge = new TimaeGauge();
        timeGauge.reset();
        const  ball = new Ball();
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => ball.up(), this);
        let lastBasketCreation = 2000;
        GameWorld.start((dt) => {
            lastBasketCreation += dt;
            const gn = Math.random();
            if (2000 < lastBasketCreation && gn < 0.05) {
                new Basket();
                lastBasketCreation = 0;
            }            
        });
    }
}

function random(min:number, max:number) {
    return min + Math.random() * (max -min);
}

class GameWorld {
    public static world: p2.World;
    private static pixelPerMeter: number;
    private static meterPerPixel: number;
    public static objects: GameObject[] = [];
    public static stageHeight: number;
    public static stageWidth: number;
    public static stageHeightMeter: number;
    public static stageWidthMeter: number;    
    public static displayObjectContainer: egret.DisplayObjectContainer;

    static pixelToMeter(pixel: number) : number {
        return pixel / this.pixelPerMeter;
    }
    static meterToPixel(meter: number) : number {
        return meter * this.pixelPerMeter;
    }
    static xMeterToPixel(meter: number) : number{
        return this.meterToPixel(meter);

    }
    static yMeterToPixel(meter: number) : number {
        return this.stageHeight - this.meterToPixel(meter);
    }

    static init(pixelPerMeter: number, displayObjectContainer: egret.DisplayObjectContainer) {
        this.pixelPerMeter = pixelPerMeter;
        this.meterPerPixel =  1 / pixelPerMeter;

        this.stageHeight = egret.MainContext.instance.stage.stageHeight;
        this.stageWidth = egret.MainContext.instance.stage.stageWidth;
        this.stageHeightMeter  = this.pixelToMeter(this.stageHeight);
        this.stageWidthMeter = this.pixelToMeter(this.stageWidth);

        this.displayObjectContainer = displayObjectContainer;

        const world = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, -9.8];
        this.world = world;
    }

    static start(globalProcess:(deltaMilliseconds:number) => void) {
        const loop = (deltaTime: number) => {
            if (deltaTime < 10) {
                return;
            }
            if (deltaTime > 1000) {
                return;
            }

            this.world.step(1/60, deltaTime / 1000, 10);
            const l = this.objects.length;
            for (let i: number = 0; i < l; i++) {
                const o = this.objects[i];
                if (!o.inited && !o.toDelete) {
                    o.init();
                }
            }    

            let someoneIsDeleted = false;
            for (let i: number = 0; i < l; i++) {
                const o = this.objects[i];
                if (o.inited && !o.toDelete) {
                    o.process(deltaTime);
                }
            }    
            if (globalProcess) {
                globalProcess(deltaTime);
            }
            for (let i: number = 0; i < l; i++) {
                const o = this.objects[i];
                if (o.toDelete) {
                    someoneIsDeleted = true;
                    continue;
                }
                if (o.inited) {
                    o.update();
                }
            }
            if (!someoneIsDeleted) {
                return;
            }
            this.objects = this.objects.filter((i) => {
                if (!i.toDelete) {
                    return true;
                } 
                i.delete();
                return false;
            });       
        };
        egret.Ticker.getInstance().register(loop, this.displayObjectContainer);
    }
}

abstract class GameObject {
    protected display: egret.DisplayObject;
    toDelete:boolean = false;
    inited:boolean = false;

    constructor() {
        GameWorld.objects.push(this);        
    }

    init() {
        this.resetDisplay();
        this.inited = true;        
    }

    protected resetDisplay() {
        if (this.display) {
            GameWorld.displayObjectContainer.removeChild(this.display);
            this.display = null;
        }
        this.display = this.createDisplay();     
        GameWorld.displayObjectContainer.addChild(this.display);
    }

    abstract createDisplay() : egret.DisplayObject;
    abstract process(deltaMilliseconds:number) : void;

    update() {}

    markToDelete() {
        this.toDelete = true;
    }

    delete() {
        GameWorld.displayObjectContainer.removeChild(this.display);
    }
}

abstract class PhysicsObject extends GameObject {
    protected body: p2.Body;

    constructor() {
        super();
    }

    init() {
        super.init();
        this.body = new p2.Body(this.options());
        this.addShapeToBody();
        this.body.displays = [this.display];
        GameWorld.world.addBody(this.body);
    }

    abstract options() : any;

    addShapeToBody() {
        const shape = this.createShape();
        this.body.addShape(shape);
    }

    createShape() : p2.Shape {
        throw new Error("createShape or addShapeToBody must be implemented");
    }

    update() {
        const body = this.body;
        const display: egret.DisplayObject = this.display;
        if (!display) {
            return;
        }
        display.x = GameWorld.xMeterToPixel(body.position[0]);
        display.y = GameWorld.yMeterToPixel(body.position[1]);
        display.rotation = 360 - (body.angle + body.shapes[0].angle) * 180 / Math.PI;
    }

    delete() {
        super.delete();
        GameWorld.world.removeBody(this.body);
        this.body.displays = [];
        this.body = null;        
    }
}

class TimaeGauge extends GameObject {
    private restTimeMiliseconds = 0;
    private courseOut = false;
    
    reset() {
        this.restTimeMiliseconds = 60 * 1000;
        this.courseOut = false;
    }

    createDisplay() {
        const sprite = new egret.Sprite();
        const g = sprite.graphics;
        g.clear();
        if (!this.isTimeOver()) {
            g.lineStyle(0);
            g.beginFill(0x0000ff,0.8);
            g.drawRect(0,0, GameWorld.stageWidth * this.restTimeMiliseconds / 60 /1000, 30);
            g.endFill();
        }

        g.lineStyle(2,0xffffff,0.8)
        g.beginFill(0x8080ff,0);
        g.drawRect(0,0, GameWorld.stageWidth, 30);
        g.endFill();     

        return  sprite;
    }

    isTimeOver() : boolean {
        return this.restTimeMiliseconds <= 0;
    }

    reduceByCourseOut() : void {
        this.courseOut  = true;
    }

    process(deltaMilliseconds:number) {
        if (this.courseOut) {
            this.restTimeMiliseconds -= deltaMilliseconds * 3;           
            this.courseOut  = false;
        } else {
            this.restTimeMiliseconds -= deltaMilliseconds;
        }
        this.resetDisplay();
    }
}

class Sky extends GameObject {

    createDisplay() {
        const sprite = new egret.Sprite();
        const g = sprite.graphics;
        g.clear();
        g.beginFill(0x8080ff,1);
        g.drawRect(0,0, GameWorld.stageWidth, GameWorld.stageHeight);
        g.endFill();     

        g.beginFill(0xc0c0ff);
        g.drawCircle(0, 0, GameWorld.stageWidth);
        g.endFill();
        return  sprite;
    }

    process() {}
}

class Ball extends PhysicsObject {
    private bx: number;
    private toUp: number = 0;

    constructor() {
        super();
        this.bx = GameWorld.stageWidthMeter / 4;
    }

    options() {
        return { mass: 1, force:[0,-300], position: [this.bx, GameWorld.stageHeightMeter / 2] };
    }

    up() {
        this.toUp++;
    }

    process() {
        this.body.position[0] = this.bx;
        this.body.angle = 0;
        if (this.toUp) {
            this.body.applyForceLocal([0, 500 * this.toUp],[0,0]);
            this.toUp = 0;
        }
    }

    createShape() : p2.Shape {
        return new p2.Circle({ radius: BALL_SIZE_METER / 2 });
    }

    createDisplay(): egret.DisplayObject {
        const shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.drawCircle(0, 0, GameWorld.meterToPixel(BALL_SIZE_METER / 2 ));
        shape.graphics.endFill();
        return shape;
    }
}

class Ground extends PhysicsObject {
    options() {
        return {position:[0, 1],type: p2.Body.STATIC};
    }

    createShape() : p2.Shape {
        return new p2.Plane({angle: Math.PI});
    }

    createDisplay(): egret.DisplayObject {
        const shape = new egret.Shape();
        shape.graphics.beginFill(0x400000);
        shape.graphics.drawRect(0,0, GameWorld.stageWidth, GameWorld.meterToPixel(1));
        shape.graphics.endFill();
        return shape;
    }

    process() {
    }
}


class Basket extends PhysicsObject {
    private lengthMeter: number;
    private halfLengthMeter: number;
    private velocityX: number;

    constructor() {
        super();
        this.lengthMeter = BALL_SIZE_METER + BASKET_SIZE_METER + random(0.1,0.5); 
        this.halfLengthMeter = this.lengthMeter / 2;
        this.velocityX = random(-2.5,-1);
    }

    options() {
        return {gravityScale:0, mass: 40, position: [10, random(2,7)], velocity:[this.velocityX ,0] };
    }

    createDisplay() : egret.Shape  {
        const lx  = GameWorld.xMeterToPixel((0 - this.halfLengthMeter));
        const rx  = GameWorld.xMeterToPixel((0 + this.halfLengthMeter));

        const shape = new egret.Shape();
        const g = shape.graphics;
        g.beginFill(0xffff00, 1);
        g.drawCircle(lx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));
        g.drawCircle(rx, 0, GameWorld.meterToPixel(BASKET_SIZE_METER));

        g.lineStyle(5, 0xfff000,0.5);
        g.moveTo(lx, 0);
        g.lineTo(rx, 0);

        g.endFill();        

        return shape;
    }

    addShapeToBody() {
        let left = new p2.Circle({ radius: BASKET_SIZE_METER });
        let right = new p2.Circle({ radius: BASKET_SIZE_METER });
        this.body.addShape(left, [- this.halfLengthMeter, 0]);   
        this.body.addShape(right, [+ this.halfLengthMeter, 0]);       
    }

    process() {
        if (this.body && this.body.position[0] < -1) {
            this.markToDelete();
        }
    }

}
