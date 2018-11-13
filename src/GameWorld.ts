class GameWorld {
    public static world: p2.World;
    private static pixelPerMeter: number;
    private static meterPerPixel: number;
    private static objects: GameObject[] = [];
    private static namedObjects: { [id: string]: GameObject; } = {};
    private static physicsObjects: { [id: number]: PhysicsObject; } = {};
    public static stageHeight: number;
    public static stageWidth: number;
    public static stageHeightMeter: number;
    public static stageWidthMeter: number;
    public static displayObjectContainer: egret.DisplayObjectContainer;

    static getGameObject<T extends GameObject>(name:string) : T {
        const o:T = this.namedObjects[name] as T;
        if (o) {
            return o;
        }
        throw new Error(`GameObject'${name}' is not found`);
    }

    static addGameObject(o: GameObject) {
        this.objects.push(o);
        const name = o.name;
        if (!name) {
            return;
        }
        if (this.namedObjects[name]) {
            throw new Error(`GameObject'${name}' already exists`);            
        }
        this.namedObjects[name] = o;
    }

    static addPhysicsObject(o: PhysicsObject) {
        this.world.addBody(o.body);
        this.physicsObjects[o.id] = o;
    }

    static destroy() {
        setTimeout(()=>{
            console.log("GameWorld#destroy -> setInterval");
            this.objects.forEach(i => i.delete());
            this.objects = [];
            this.physicsObjects = {};
            this.namedObjects = {};          
            this.world.clear();  
        },1);
    }


    static pixelToMeter(pixel: number): number {
        return pixel / this.pixelPerMeter;
    }
    static meterToPixel(meter: number): number {
        return meter * this.pixelPerMeter;
    }
    static xMeterToPixel(meter: number): number {
        return this.meterToPixel(meter);

    }
    static yMeterToPixel(meter: number): number {
        return this.stageHeight - this.meterToPixel(meter);
    }

    static init(pixelPerMeter: number, displayObjectContainer: egret.DisplayObjectContainer) {
        this.pixelPerMeter = pixelPerMeter;
        this.meterPerPixel = 1 / pixelPerMeter;

        this.stageHeight = egret.MainContext.instance.stage.stageHeight;
        this.stageWidth = egret.MainContext.instance.stage.stageWidth;
        this.stageHeightMeter = this.pixelToMeter(this.stageHeight);
        this.stageWidthMeter = this.pixelToMeter(this.stageWidth);

        this.displayObjectContainer = displayObjectContainer;

        const world = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, -9.8];
        this.world = world;
    }

    private static callback: (e?:any) => void;
    private static loop: (e: egret.Event) => void;

    static emit(eventName:string,e?:any) {
        if (this.callback !== null) {
            this.callback(e);
        }
    }

    static on(eventName:string, callback: (e?:any) => void) {
        this.callback = callback;
    }

    static start() {

        this.world.on("impact", (evt) => {
            const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
            const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
            if (a.onImpact(b) === false) {
                return;
            }
            if (b.onImpact(a) === false) {
                return;
            }
        });

        this.world.on("beginContact", (evt: any) => {
            const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
            const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
            if (a.onBeginContact(b, evt.shapeA, evt.shapeB) === false) {
                return;
            }
            if (b.onBeginContact(a, evt.shapeB, evt.shapeA) === false) {
                return;
            }
        });

        this.world.on("endContact", (evt: any) => {
            const a: PhysicsObject = this.physicsObjects[evt.bodyA.id];
            const b: PhysicsObject = this.physicsObjects[evt.bodyB.id];
            if (a.onEndContact(b, evt.shapeA, evt.shapeB) === false) {
                return;
            }
            if (b.onEndContact(a, evt.shapeB, evt.shapeA) === false) {
                return;
            }
        });

        this.loop = (e: egret.Event) => {
            const deltaTime = 1000 / FPS;
            this.world.step(1 / 60, deltaTime / 1000, 10);
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
                    o.process();
                }
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

        this.displayObjectContainer.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    }

    static pause() {
        this.displayObjectContainer.removeEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    }


}