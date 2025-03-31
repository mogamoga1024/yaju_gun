
class GameScene extends Scene {
    #backgroundImage = null;

    async onStart() {
        console.log("GameScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        this.#update();
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // todo
    }

    onKeyDown(e) {
        // todo
    }

    onKeyUp(e) {
        // todo
    }
    
    onClick(e) {
        // todo
    }
}
