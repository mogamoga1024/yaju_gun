
class Honsya extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriCenterX = 0;
    #oriY = 100;
    #virtualCenterX = 0;
    #image = null;
    #frameCount = 0;
    #opacity = 1;
    #explosion = null;

    constructor(viewAngle) {
        super(0); // 一番後ろに表示させたいため
        this.#image = ImageStorage.get("本社");
        this.#width = this.#image.width / 8;
        this.#height = this.#image.height / 8;

        // viewAngle ∊ [0, 360)
        // 視界外に出現させたい
        // 具体例
        // backViewAngle = 0   → centerX = canvas.width / 2
        // backViewAngle = 90  → centerX = 0
        // backViewAngle = 180 → centerX = canvas.width * 3 / 2
        // backViewAngle = 270 → centerX = canvas.width
        // 汎化
        // canvas.width * 2 - (centerX - canvas.width / 2) = (canvas.width / 2) * (backViewAngle / 90)
        // canvas.width * 2 - centerX + canvas.width / 2 = (canvas.width / 2) * (backViewAngle / 90)
        // canvas.width * 5 / 2 - centerX = (canvas.width / 2) * (backViewAngle / 90)
        // centerX = canvas.width * 5 / 2 - (canvas.width / 2) * (backViewAngle / 90)
        const backViewAngle = (viewAngle + 180) % 360;
        const centerX = (canvas.width * 5 / 2 - (canvas.width / 2) * (backViewAngle / 90)) % (canvas.width * 2);

        this.#y = this.#oriY;
        this.#oriCenterX = centerX;
        this.#virtualCenterX = centerX;

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

        if (this.state === "dying") {
            this.#opacity -= 0.01;
            if (this.#opacity <= 0 || this.#explosion.shouldDisappear) {
                this.state = "dead";
            }
            this.#updateBounds(viewAngle);
            return;
        }

        // todo

        this.#virtualCenterX = this.#oriCenterX + this.#frameCount * 2;
        this.#y = Math.sin(this.#frameCount / 20) * 50 + this.#oriY;

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
        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#virtualCenterX - this.#width / 2 + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }
    }
}
