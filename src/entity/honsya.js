
class Honsya extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriCenterX = 0;
    #image = null;
    #frameCount = 0;
    #opacity = 1;
    #explosion = null;

    constructor(centerX, viewAngle) {
        super(0); // 一番後ろに表示させたいため
        this.#image = ImageStorage.get("本社");
        this.#oriCenterX = centerX;
        this.#width = this.#image.width / 8;
        this.#height = this.#image.height / 8;

        this.#updateBounds(viewAngle);
    }

    draw() {
        context.globalAlpha = this.#opacity;
        context.drawImage(this.#image, this.#x, this.#y, this.#width, this.#height);
        context.globalAlpha = 1;

        this.#explosion?.draw(this.#x + this.#width / 2, this.#y + this.#height / 2, Math.max(this.#width, this.#height));
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

        // todo #frameCount

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
        playSound(SoundStorage.get("爆発"));
        this.state = "dying";
        this.#explosion = new Explosion();
    }

    #updateBounds(viewAngle) {
        // todo oriCenterX
        this.#x = 0;
        this.#y = 0;
    }
}
