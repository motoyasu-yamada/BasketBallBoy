
class BasketManager extends GameObject {
	private lastBasketCreation = 2000;

	process() {
		this.lastBasketCreation += 1000 / FPS;
		const gn = Math.random();
		if (2000 < this.lastBasketCreation && gn < 0.05) {
			new Basket();
			this.lastBasketCreation = 0;
		}
	}
}
