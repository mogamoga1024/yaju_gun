
class ShoutingSenpai {
    #width = 0;
    #height = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;
    #canShoutFrameCount = -60 * 2;
    #imageList = [];
    #animeFrameMax = 5;
    #imageListIndex = 0;
    #imageListIndexDelta = 1;
    #text = "アイスティー";
    #textIndex = 0;

    constructor(centerX, temaeRate = 0.15) {
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`くねくね先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#width = this.#imageList[0].width * 2.07;
        this.#height = this.#imageList[0].height * 2.07;
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
        
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, x, this.#y(), width, height);
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

        if (this.#textIndex === 0 && this.#canShoutFrameCount > 0) {
            this.#canShoutFrameCount = -60 * 10;
        }
        this.#canShoutFrameCount++;
    }

    canShout() {
        if (this.#canShoutFrameCount < 0) {
            return false;
        }
        return this.#canShoutFrameCount % 60 === 0;
    }

    shout() {
        if (this.#textIndex === 0) {
            playSound(SoundStorage.get(this.#text));
        }
        const height = this.#height * this.#temaeRate;
        const centerY = this.#y() + height * 0.1; // 顔当たりの座標
        const char = this.#text[this.#textIndex];
        this.#textIndex = (this.#textIndex + 1) % this.#text.length;
        return new Kotodama(char, this.#centerX, centerY, this.#temaeRate);
    }

    #y() {
        const height = this.#height * this.#temaeRate;
        // 水平線でのbottomY
        const bottomY0 = canvas.height / 2;
        // 一番手前のbottomY
        const bottomY1 = canvas.height + this.#height / 2;
        const bottomY = bottomY0 * (1 - this.#temaeRate) + bottomY1 * this.#temaeRate;
        return bottomY - height;
    }
}
