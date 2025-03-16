
class Senpai {
    #width = 0;
    #height = 0;
    #centerX = 0;
    #temaeRate = 1;
    // #frameCount = 0;

    constructor(centerX, temaeRate = 1) {
        this.#centerX = centerX;
        this.#width = 200;
        this.#height = 400;
        this.#temaeRate = temaeRate;
    }

    draw() {
        const width = this.#width * this.#temaeRate;
        const height = this.#height * this.#temaeRate;

        const x = this.#centerX - width / 2;
        const bottomY0 = canvas.height + 200;
        const bottomY = bottomY0;
        // this.#temaeRate: 1でoffsetY: 0
        const offsetY = canvas.height * (1 - this.#temaeRate);
        const y = bottomY - height - offsetY;

        context.fillStyle = "blue";
        context.fillRect(x, y, width, height);

        console.log(offsetY);
    }

    update() {
        const temaeRateMin = 0.1;
        if (this.#temaeRate <= temaeRateMin) {
            return;
        }
        this.#temaeRate = Math.max(this.#temaeRate - 0.002, temaeRateMin);
    }
}
