abstract class GameObject {
	protected display: egret.DisplayObject;
	private _name: string;
	toDelete: boolean = false;
	inited: boolean = false;

	constructor(name:string = null) {
		if (name) {
			this._name = name;
		}
		GameWorld.addGameObject(this);
	}

	get name() : string {
		return this._name;
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
		if (this.display) {
			GameWorld.displayObjectContainer.addChild(this.display);
		}
	}

	createDisplay(): egret.DisplayObject {
		return null;
	}

	abstract process(): void;

	update() { }

	markToDelete() {
		this.toDelete = true;
	}

	delete() {
		if (this.display) {
			GameWorld.displayObjectContainer.removeChild(this.display);
		}
		this.display = null;
	}
}

