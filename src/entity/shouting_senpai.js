
class ShoutingSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #centerX = 0;
    #frameCount = 0;
    #canShoutFrameCount = Math.floor((-120) / (1 + balanceFactor() / 100));
    #imageList = [];
    #animeFrameMax = 5;
    #imageListIndex = 0;
    #imageListIndexDelta = 1;
    #text = kotodamaNameList[Math.floor(Math.random() * kotodamaNameList.length)];
    #textIndex = 0;
    #ktdmType = "uneune"; // "uneune" or "kurukuru"
    #ktdmColor = null;
    #ktdmDirection = 1;
    #shoutSoundId = -1;
    #opacity = 1;
    #explosion = null;

    constructor(centerX, viewAngle, temaeRate = 0.15) {
        super(temaeRate);
        this.#centerX = centerX;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`くねくね先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 2.07;
        this.#oriHeight = this.#imageList[0].height * 2.07;
        this.#updateBounds(viewAngle);

        if (Math.random() < 0.5) {
            this.#ktdmType = "uneune";
        }
        else {
            this.#ktdmType = "kurukuru";
        }

        switch (Math.floor(Math.random() * 3)) {
            case 0:
                this.#ktdmColor = {
                    stroke: "#B00000",
                    fill: "255, 192, 203"
                };
                break;
            case 1:
                this.#ktdmColor = {
                    stroke: "#007000",
                    fill: "144, 238, 144"
                };
                break;
            case 2:
                this.#ktdmColor = {
                    stroke: "#0030B0",
                    fill: "173, 216, 230"
                };
                break;
        }

        if (Math.random() < 0.5) {
            this.#ktdmDirection = 1;
        }
        else {
            this.#ktdmDirection = -1;
        }
    }

    end() {
        SoundStorage.get(this.#text).stop(this.#shoutSoundId);
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
            this.#canShoutFrameCount = Math.floor((-240) / (1 + balanceFactor() / 100));
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

    instantDeath(damageSoundVolume) {
        SoundStorage.get(this.#text).stop(this.#shoutSoundId);
        this.state = "dying";
        this.#explosion = new Explosion(this.temaeRate, damageSoundVolume);
    }

    takeDamage() {
        SoundStorage.get(this.#text).stop(this.#shoutSoundId);
        this.state = "dying";
        this.#explosion = new Explosion(this.temaeRate);
    }

    getXRange() {
        const leftX = this.#x;
        const rightX = leftX + this.#width;
        return {leftX, rightX};
    }

    canShout() {
        if (this.state !== "alive") {
            return false;
        }
        if (this.#canShoutFrameCount < 0) {
            return false;
        }
        return this.#canShoutFrameCount % 60 === 0;
    }

    shout(viewAngle) {
        if (this.#textIndex === 0) {
            this.#shoutSoundId = SoundStorage.get(this.#text).play();
        }
        const height = this.#oriHeight * this.temaeRate;
        const centerY = this.#y + height * 0.1; // 顔当たりの座標
        const char = this.#text[this.#textIndex];
        this.#textIndex = (this.#textIndex + 1) % this.#text.length;
        return new Kotodama(this, char, this.#centerX, centerY, viewAngle, this.temaeRate, this.#ktdmType, this.#ktdmColor, this.#ktdmDirection);
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
        this.#y = bottomY - this.#height;
    }
}
