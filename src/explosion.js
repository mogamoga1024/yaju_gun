
class Explosion {
    #frameCount = 0;
    #image = null;
    #imageIndex = 0;
    #imageIndexMax = 67;
    shouldDisappear = false;
    
    constructor(centerX, viewAngle, temaeRate) {
        // todo
        this.#image = ImageStorage.get("爆発スプライト_170");
        this.#updateBounds(viewAngle);
    }

    draw() {
        if (this.#imageIndex > this.#imageIndexMax) {
            throw new Error(`#imageIndex: ${this.#imageIndex}`);
        }

        const sSize = 170;
        const sx = sSize * ((this.#imageIndex + 1) % 10);
        const sy = sSize * Math.floor((this.#imageIndex + 1) / 10);
        const dSize = 100;

        context.globalAlpha = 1 - Math.pow(this.#imageIndex / this.#imageIndexMax, 4);
        context.drawImage(this.#image, sx, sy, sSize, sSize, 0, 0, dSize, dSize);
        context.globalAlpha = 1;
    }

    update(viewAngle) {
        this.#frameCount++;
        if (this.#frameCount % 2 === 0) {
            this.#imageIndex++;
        }

        if (this.#imageIndex > this.#imageIndexMax) {
            this.shouldDisappear = true;
        }

        // todo
    }

    #updateBounds(viewAngle) {
        // todo
    }
}
