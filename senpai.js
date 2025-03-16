
class Senpai {
    #width = 0;
    #height = 0;
    #centerX = 0;
    #zRate = 1;
    #frameCount = 0;

    constructor(centerX, zRate = 1) {
        this.#centerX = centerX;
        this.#width = 200;
        this.#height = 400;
        this.#zRate = zRate;
    }

    draw() {
        const width = this.#width;
        const height = this.#height;

        const x = this.#centerX - this.#width / 2;
        const bottomY0 = canvas.height + 200;
        const bottomY = bottomY0;
        const y = bottomY - height;

        context.fillStyle = "blue";
        context.fillRect(x, y, width, height);
    }

    update() {
        if (this.#zRate <= 0) {
            return;
        }
        this.#frameCount++;
        // todo
    }
}
