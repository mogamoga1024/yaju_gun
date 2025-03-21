
class RunningSenpai {
    #width = 0;
    #height = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;
    #imageList = [];
    #animeFrameMax = 12;

    constructor(centerX, temaeRate = 0) {
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`asset/走る野獣先輩/${i}.png`);
            this.#imageList.push(image);
        }
        this.#width = this.#imageList[0].width * 2.5;
        this.#height = this.#imageList[0].height * 2.5;
    }

    draw(viewAngle) {
        const width = this.#width * this.#temaeRate;
        const height = this.#height * this.#temaeRate;

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        let x = (this.#centerX - width / 2 + offsetX) % (canvas.width * 2);
        if (x + width > canvas.width * 2) {
            x = x - canvas.width * 2;
        }

        // 水平線でのbottomY
        const bottomY0 = canvas.height / 2;
        // 一番手前のbottomY
        const bottomY1 = canvas.height + this.#height / 2;
        const bottomY = bottomY0 * (1 - this.#temaeRate) + bottomY1 * this.#temaeRate;
        const y = bottomY - height;

        const image = this.#imageList[this.#frameCount % this.#animeFrameMax];
        context.drawImage(image, x, y, width, height);
    }

    update() {
        this.#frameCount++;

        const temaeRateMax = 1;
        if (this.#temaeRate >= temaeRateMax) {
            return;
        }

        let a = 0.002 + 0.002 * this.#temaeRate;

        this.#temaeRate = Math.min(this.#temaeRate + a, temaeRateMax);
    }
}
