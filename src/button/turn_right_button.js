
class TurnRightButton {
    #startX = 0;
    #startY = 0;
    #x = 0;
    #y = 0;
    #width = 50;
    #height = 60;
    #frameCount = 0;

    constructor(right) {
        this.#startX = canvas.width - right;
        this.#startY = canvas.height / 2;
        this.#y = this.#startY - this.#height / 2;
        this.#updateBounds();
    }

    draw() {
        context.beginPath();
        let x = this.#startX - this.#dx();
        let y = this.#startY;
        context.moveTo(x, y);
        x += -this.#width;
        y += this.#height / 2;
        context.lineTo(x, y);
        x += 0;
        y += -this.#height;
        context.lineTo(x, y);
        context.closePath();

        context.fillStyle = "rgba(255, 255, 0, 0.6)";
        context.fill();

        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.lineJoin = "round";
        context.stroke();
    }

    update() {
        this.#frameCount++;
        this.#updateBounds();
    }

    isTargeted(crosshairX, crosshairY) {
        const a = 10;
        if (crosshairX < this.#x - a) {
            return false;
        }
        if (crosshairX > this.#x + this.#width + a) {
            return false;
        }
        if (crosshairY < this.#y - a) {
            return false;
        }
        if (crosshairY > this.#y + this.#height + a) {
            return false;
        }
        return true;
    }

    #dx() {
        return Math.sin(this.#frameCount / 10) * 10 + 10;
    }

    #updateBounds() {
        this.#x = this.#startX - this.#dx() - this.#width;
    }
}
