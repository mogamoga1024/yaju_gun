
class MeteorSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #diagonal = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #pivotX = 0;
    #angle = 0;
    #virtualCenterX = 0;
    #virtualCenterY = 0;
    #inymRadian = 0;
    #frameCount = 0;
    #yajuImageList = [];
    #yajuImageListIndex = 0;
    #yajuImageListIndexDelta = 1;
    #inymImage = null;
    #animeFrameMax = 11;
    #meteorSoundId = -1;
    #opacity = 1;
    #explosion = null;

    constructor(pivotX, viewAngle, temaeRate = 0) {
        super(temaeRate);
        this.#pivotX = pivotX;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`タオル先輩/${i}`);
            this.#yajuImageList.push(image);
        }
        this.#inymImage = ImageStorage.get("いんゆめくん");
        this.#oriWidth = this.#yajuImageList[0].width * 1.5;
        this.#oriHeight = this.#yajuImageList[0].height * 1.5;
        this.#updateBounds(viewAngle);

        this.#meteorSoundId = SoundStorage.get("ンアッー！（ねっとり）").play();
    }

    end() {
        SoundStorage.get("ンアッー！（ねっとり）").stop(this.#meteorSoundId);
    }

    draw() {
        // いんゆめくんの描画
        context.save();
        context.globalAlpha = this.#opacity * 0.3;
        context.translate(this.#virtualCenterX, this.#virtualCenterY);
        context.rotate(this.#inymRadian);
        context.drawImage(this.#inymImage, -this.#diagonal / 2, -this.#diagonal / 2, this.#diagonal, this.#diagonal);
        context.restore();

        // 野獣先輩の描画
        context.save();
        context.globalAlpha = this.#opacity;
        context.translate(this.#x + this.#width, this.#y + this.#height);
        context.rotate(this.#angle);
        const image = this.#yajuImageList[this.#yajuImageListIndex];
        context.drawImage(image, -this.#width, -this.#height, this.#width, this.#height);
        context.restore();

        // 爆発の描画
        this.#explosion?.draw(this.#virtualCenterX, this.#virtualCenterY, Math.max(this.#width, this.#height));

        // 当たり判定のデバッグ用
        // context.beginPath();
        // context.arc(this.#virtualCenterX, this.#virtualCenterY, this.#diagonal / 2, 0, Math.PI * 2);
        // context.fillStyle = `rgba(0, 0, 255, 0.5)`;
        // context.fill();
        // context.closePath();
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
            if (this.#yajuImageListIndex <= 0) {
                this.#yajuImageListIndexDelta = 1;
            }
            else if (this.#yajuImageListIndex >= this.#animeFrameMax) {
                this.#yajuImageListIndexDelta = -1;
            }
            this.#yajuImageListIndex += this.#yajuImageListIndexDelta;
        }

        const temaeRateMax = 1;
        if (this.temaeRate >= temaeRateMax) {
            this.temaeRate = temaeRateMax;
        }
        else {
            let a = 0.0008 + 0.002 * this.temaeRate;
            a *= 1 + balanceFactor() / 100;
            this.temaeRate = Math.min(this.temaeRate + a, temaeRateMax);
        }

        this.#angle += 0.05 * (1 + balanceFactor() / 200);
        this.#inymRadian -= 0.06;

        this.#updateBounds(viewAngle);
    }

    isTargeted(crosshairX, crosshairY) {
        if (this.state !== "alive") {
            return false;
        }

        const radius = this.#diagonal / 2;
        const d = Math.sqrt((crosshairX - this.#virtualCenterX) ** 2 + (crosshairY - this.#virtualCenterY) ** 2);

        return d <= radius;
    }

    instantDeath(damageSoundVolume) {
        SoundStorage.get("ンアッー！（ねっとり）").stop(this.#meteorSoundId);
        this.state = "dying";
        this.#explosion = new Explosion(damageSoundVolume);
    }

    takeDamage() {
        SoundStorage.get("ンアッー！（ねっとり）").stop(this.#meteorSoundId);
        this.state = "dying";
        this.#explosion = new Explosion();
    }

    getXRange() {
        const radius = this.#diagonal / 2;
        let leftX = this.#virtualCenterX - radius;
        if (leftX + radius * 2 < 0) {
            leftX = leftX + canvas.width * 2;
        }
        const rightX = leftX + radius * 2;

        return {leftX, rightX};
    }

    #updateBounds(viewAngle) {
        this.#width = this.#oriWidth * this.temaeRate;
        this.#height = this.#oriHeight * this.temaeRate;
        this.#diagonal = Math.sqrt(this.#width ** 2 + this.#height ** 2);

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#pivotX - this.#width + offsetX) % (canvas.width * 2);

        if (this.#x + this.#width + this.#diagonal > canvas.width * 2) {
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
