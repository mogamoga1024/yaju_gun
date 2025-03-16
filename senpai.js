
class Senpai {
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
            const image = new Image();
            image.src = `asset/走る野獣先輩/${i}.png`;
            this.#imageList.push(image);
        }
        this.#width = this.#imageList[0].width * 2;
        this.#height = this.#imageList[0].height * 2;
    }

    draw() {
        const width = this.#width * this.#temaeRate;
        const height = this.#height * this.#temaeRate;

        const x = this.#centerX - width / 2;
        const bottomY0 = canvas.height + this.#height / 2;
        const bottomY1 = canvas.height / 2;
        // this.#temaeRate: 1でoffsetY: 0
        const offsetY = canvas.height * (1 - this.#temaeRate);
        const y = bottomY0 - height - offsetY;

        const image = this.#imageList[this.#frameCount % this.#animeFrameMax];
        context.drawImage(image, x, y, width, height);
    }

    update() {
        this.#frameCount++;

        const temaeRateMax = 1;
        if (this.#temaeRate >= temaeRateMax) {
            return;
        }
        this.#temaeRate = Math.min(this.#temaeRate + 0.002, temaeRateMax);
    }
}
