
class ShoutingSenpai {
    #width = 0;
    #height = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;
    #imageList = [];
    #animeFrameMax = 5;
    #imageListIndex = 0;
    #imageListIndexDelta = 1;

    constructor(centerX, temaeRate = 0.15) {
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = new Image();
            image.src = `asset/くねくね先輩/${i}.png`;
            this.#imageList.push(image);
        }
        this.#width = this.#imageList[0].width * 2.07;
        this.#height = this.#imageList[0].height * 2.07;
    }

    draw() {
        const width = this.#width * this.#temaeRate;
        const height = this.#height * this.#temaeRate;

        const x = this.#centerX - width / 2;
        // 水平線でのbottomY
        const bottomY0 = canvas.height / 2;
        // 一番手前のbottomY
        const bottomY1 = canvas.height + this.#height / 2;
        const bottomY = bottomY0 * (1 - this.#temaeRate) + bottomY1 * this.#temaeRate;
        const y = bottomY - height;

        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, x, y, width, height);
    }

    update() {
        this.#frameCount++;

        if (this.#frameCount % 3 === 0) {
            if (this.#imageListIndex <= 0) {
                this.#imageListIndexDelta = 1;
            }
            else if (this.#imageListIndex >= this.#animeFrameMax) {
                this.#imageListIndexDelta = -1;
            }
            this.#imageListIndex += this.#imageListIndexDelta;
        }
    }

    canShout() {
        // todo 仮
        return this.#frameCount !== 60 * 3;
    }

    shout() {
        return new KotodamaGroup("学生です", this.#centerX, this.#temaeRate);
    }
}
