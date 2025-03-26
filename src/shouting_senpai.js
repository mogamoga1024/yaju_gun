
class ShoutingSenpai {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
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
    state = "alive"; // alive or dying or dead // todo

    constructor(centerX, viewAngle, temaeRate = 0.15) {
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`くねくね先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 2.07;
        this.#oriHeight = this.#imageList[0].height * 2.07;
        this.#updateBounds(viewAngle);
    }

    draw() {
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
    }

    update(viewAngle) {
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

        this.#updateBounds(viewAngle);
    }

    isTargeted(crosshairX, crosshairY) {
        if (this.state !== "alive") {
            return false;
        }
        if (crosshairX < this.#x) {
            return false;
        }
        if (crosshairX > this.#x + this.#width) {
            return false;
        }
        if (crosshairY < this.#y) {
            return false;
        }
        if (crosshairY > this.#y + this.#height) {
            return false;
        }
        return true;
    }

    canShout() {
        if (this.#canShoutFrameCount < 0) {
            return false;
        }
        return this.#canShoutFrameCount % 60 === 0;
    }

    shout(viewAngle) {
        if (this.#textIndex === 0) {
            playSound(SoundStorage.get(this.#text));
        }
        const height = this.#oriHeight * this.#temaeRate;
        const centerY = this.#y + height * 0.1; // 顔当たりの座標
        const char = this.#text[this.#textIndex];
        this.#textIndex = (this.#textIndex + 1) % this.#text.length;
        return new Kotodama(char, this.#centerX, centerY, viewAngle, this.#temaeRate);
    }

    takeDamage() {
        // todo sound
        this.state = "dying";
    }

    #updateBounds(viewAngle) {
        this.#width = this.#oriWidth * this.#temaeRate;
        this.#height = this.#oriHeight * this.#temaeRate;

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#centerX - this.#width / 2 + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }

        // 水平線でのbottomY
        const bottomY0 = canvas.height / 2;
        // 一番手前のbottomY
        const bottomY1 = canvas.height + this.#oriHeight / 2;
        const bottomY = bottomY0 * (1 - this.#temaeRate) + bottomY1 * this.#temaeRate;
        this.#y = bottomY - this.#height;
    }
}
