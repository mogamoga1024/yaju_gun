
class MukimukiSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #centerX = 0;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #imageListIndexDelta = 1;
    #animeFrameMax = 6;
    #ikitugiSoundId = -1;
    #hp = 5;
    #opacity = 1;
    #explosion = null;

    constructor(centerX, viewAngle, temaeRate = 0) {
        super(temaeRate);
        this.#centerX = centerX;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`ムキムキ先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 2.4;
        this.#oriHeight = this.#imageList[0].height * 2.4;
        this.#updateBounds(viewAngle);

        playSound(SoundStorage.get("ムキムキ息継ぎ")).then(id => {
            if (this.state === "alive") {
                this.#ikitugiSoundId = id;
            }
        });
    }

    end() {
        if (this.#ikitugiSoundId !== -1) {
            stopSound(SoundStorage.get("ムキムキ息継ぎ"), this.#ikitugiSoundId);
        }
    }

    draw() {
        context.globalAlpha = this.#opacity;
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
        context.globalAlpha = 1;

        this.#explosion?.draw(this.#x + this.#width / 2, this.#y + this.#height / 2, Math.max(this.#width, this.#height));
    }

    update(viewAngle) {
        this.#frameCount++;
        this.#explosion?.update();

        if (this.state === "dying") {
            this.#opacity -= 0.01;
            if (this.#opacity <= 0 || this.#explosion.shouldDisappear) {
                this.state = "dead";
            }
            this.#updateBounds(viewAngle);
            return;
        }

        if (this.#frameCount % 4 == 0) {
            if (this.#imageListIndex <= 0) {
                this.#imageListIndexDelta = 1;
            }
            else if (this.#imageListIndex >= this.#animeFrameMax) {
                this.#imageListIndexDelta = -1;
            }
            this.#imageListIndex += this.#imageListIndexDelta;
        }

        const temaeRateMax = 1;
        if (this.temaeRate >= temaeRateMax) {
            this.temaeRate = temaeRateMax;
        }
        else {
            let a = 0.0006 + 0.002 * this.temaeRate;
            a *= 1 + level / 100;
            this.temaeRate = Math.min(this.temaeRate + a, temaeRateMax);
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
        playSound(SoundStorage.get("ムキムキオォン！"));
        this.#hp -= 1;
        if (this.#hp <= 0) {
            playSound(SoundStorage.get("爆発"));
            this.state = "dying";
            this.#explosion = new Explosion();
        }
    }

    #updateBounds(viewAngle) {
        this.#width = this.#oriWidth * this.temaeRate;
        this.#height = this.#oriHeight * this.temaeRate;

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
        const bottomY = bottomY0 * (1 - this.temaeRate) + bottomY1 * this.temaeRate;
        this.#y = bottomY - (this.#height * 1.1);
    }
}
