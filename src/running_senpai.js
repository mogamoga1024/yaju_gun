
class RunningSenpai {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #animeFrameMax = 12;
    #ikitugiSound = null;
    state = "alive"; // alive or dying or dead
    #opacity = 1;

    constructor(centerX, viewAngle, temaeRate = 0) {
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`走る野獣先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 2.5;
        this.#oriHeight = this.#imageList[0].height * 2.5;
        this.#ikitugiSound = SoundStorage.get("息継ぎ");
        this.#ikitugiSound.hasPlayedSound = false;
        this.#updateBounds(viewAngle);
    }

    draw() {
        if (!this.#ikitugiSound.hasPlayedSound) {
            this.#ikitugiSound.hasPlayedSound = true;
            playSound(this.#ikitugiSound);
        }

        context.globalAlpha = this.#opacity;
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
        context.globalAlpha = 1;
    }

    update(viewAngle) {
        this.#frameCount++;

        if (this.state !== "alive") {
            this.#opacity -= 0.2;
            if (this.#opacity <= 0) {
                this.state = "dead";
            }
            return;
        }

        if (this.#frameCount % 2 == 0) {
            this.#imageListIndex = (this.#imageListIndex + 1) % this.#animeFrameMax;
        }

        const temaeRateMax = 1;
        if (this.#temaeRate >= temaeRateMax) {
            this.#temaeRate = temaeRateMax;
        }
        else {
            const a = 0.002 + 0.002 * this.#temaeRate;
            this.#temaeRate = Math.min(this.#temaeRate + a, temaeRateMax);
        }

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

    takeDamage() {
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
