
class MeteorSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #pivotX = 0;
    #angle = 0;
    #virtualCenterX = 0;
    #virtualCenterY = 0;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #imageListIndexDelta = 1;
    #animeFrameMax = 11;
    #meteorSound = null;
    #hasPlayedMeteorSound = false;
    #opacity = 1;
    #explosion = null;

    constructor(pivotX, viewAngle, temaeRate = 0) {
        super(temaeRate);
        this.#pivotX = pivotX;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`タオル先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 1.5;
        this.#oriHeight = this.#imageList[0].height * 1.5;
        this.#hasPlayedMeteorSound = false;
        this.#updateBounds(viewAngle);
    }

    draw() {
        // todo sound

        context.save();
        context.globalAlpha = this.#opacity;
        context.translate(this.#x + this.#width, this.#y + this.#height);
        context.rotate(this.#angle);
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, -this.#width, -this.#height, this.#width, this.#height);
        context.restore();

        this.#explosion?.draw(this.#virtualCenterX, this.#virtualCenterY, Math.max(this.#width, this.#height));
    }

    update(viewAngle) {
        this.#frameCount++;
        this.#explosion?.update();

        if (this.state !== "alive") {
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
            const a = 0.0008 + 0.002 * this.temaeRate;
            this.temaeRate = Math.min(this.temaeRate + a, temaeRateMax);
        }

        this.#angle += 0.05;

        this.#updateBounds(viewAngle);
    }

    isTargeted(crosshairX, crosshairY) {
        if (this.state !== "alive") {
            return false;
        }

        const radius = Math.max(this.#width, this.#height) / 2;
        const d = Math.sqrt(Math.pow(crosshairX - this.#virtualCenterX, 2) + Math.pow(crosshairY - this.#virtualCenterY, 2));

        return d <= radius;
    }

    takeDamage() {
        loadSound("爆発").then(sound => playSound(sound));
        this.state = "dying";
        this.#explosion = new Explosion();
        if (this.#meteorSound !== null) {
            stopSound(this.#meteorSound);
        }
    }

    #updateBounds(viewAngle) {
        this.#width = this.#oriWidth * this.temaeRate;
        this.#height = this.#oriHeight * this.temaeRate;

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#pivotX - this.#width + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }

        // 水平線でのcenterY
        const bottomY0 = canvas.height / 8;
        // 一番手前のcenterY
        const bottomY1 = canvas.height / 2;
        const bottomY = bottomY0 * (1 - this.temaeRate) + bottomY1 * this.temaeRate;
        this.#y = bottomY - this.#height;

        const pivotX = this.#x + this.#width;
        const pivotY = this.#y + this.#height;
        const centerX = this.#x + this.#width / 2;
        const centerY = this.#y + this.#height / 2;
        const dx = centerX - pivotX;
        const dy = centerY - pivotY;
        this.#virtualCenterX = pivotX + dx * Math.cos(this.#angle) - dy * Math.sin(this.#angle);
        this.#virtualCenterY = pivotY + dx * Math.sin(this.#angle) + dy * Math.cos(this.#angle);
    }
}
