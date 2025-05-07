
class PunchSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #centerX = 0;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #opacity = 1;
    #explosion = null;
    #canAttack = false;
    canAttackForever = true;
    static spawnWeight = 0.125;

    constructor(centerX, viewAngle, temaeRate = 1) {
        super(temaeRate);
        this.#centerX = centerX;
        for (let i = 0; i <= 6; i++) {
            const image = ImageStorage.get(`パンチ先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#width = this.#imageList[0].width * 3;
        this.#height = this.#imageList[0].height * 3;
        this.#y = canvas.height;
        this.#updateBounds(viewAngle);
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
        this.#canAttack = false;
        this.#explosion?.update();

        if (this.state === "dying") {
            this.#opacity -= 0.01;
            if (this.#opacity <= 0 || this.#explosion.shouldDisappear) {
                this.state = "dead";
            }
            this.#updateBounds(viewAngle);
            return;
        }

        // todo this.#frameCount
        this.#y -= 3 * (1 + balanceFactor() / 100);
        if (this.#y < canvas.height - this.#height) {
            this.#y = canvas.height - this.#height;
            if (this.#frameCount % 5 === 0) {
                this.#imageListIndex = (this.#imageListIndex + 1) % this.#imageList.length
                if (this.#imageListIndex === 4) {
                    this.#canAttack = true;
                }
            }
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

    instantDeath(damageSoundVolume) {
        this.state = "dying";
        this.#explosion = new Explosion(damageSoundVolume);
    }

    takeDamage() {
        this.state = "dying";
        this.#explosion = new Explosion();
    }

    getXRange() {
        const leftX = this.#x;
        const rightX = leftX + this.#width;
        return {leftX, rightX};
    }

    canAttack() {
        return this.#canAttack;
    }

    #updateBounds(viewAngle) {
        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#centerX - this.#width / 2 + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }
    }
}
