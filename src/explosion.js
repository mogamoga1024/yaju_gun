
class Explosion {
    static #playingCount = 0;

    #frameCount = 0;
    #image = null;
    #imageIndex = 0;
    #imageIndexMax = 67;
    shouldDisappear = false;
    
    constructor() {
        this.#image = ImageStorage.get("爆発スプライト_170");
        SoundStorage.get("爆発").play();
    }

    draw(centerX, centerY, sideSize) {
        if (this.#imageIndex > this.#imageIndexMax) {
            throw new Error(`#imageIndex: ${this.#imageIndex}`);
        }

        const sSize = 170;
        const sx = sSize * ((this.#imageIndex + 1) % 10);
        const sy = sSize * Math.floor((this.#imageIndex + 1) / 10);
        const dx = centerX - sideSize / 2;
        const dy = centerY - sideSize / 2;

        context.globalAlpha = 1 - Math.pow(this.#imageIndex / this.#imageIndexMax, 4);
        context.drawImage(this.#image, sx, sy, sSize, sSize, dx, dy, sideSize, sideSize);
        context.globalAlpha = 1;
    }

    update() {
        this.#frameCount++;
        if (this.#frameCount % 1 === 0) {
            this.#imageIndex++;
        }

        if (this.#imageIndex > this.#imageIndexMax) {
            this.shouldDisappear = true;
        }
    }
}
