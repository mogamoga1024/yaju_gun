
class TurnLeftButton extends Button {
    #startX = 0;
    #startY = 0;
    #x = 0;
    #y = 0;
    #width = 50;
    #height = 60;
    #frameCount = 0;

    constructor(left) {
        super();
        this.#startX = left;
        this.#startY = canvas.height / 2;
        this.#y = this.#startY - this.#height / 2;
        this.#updateBounds();
    }

    draw(shouldWarn) {
        context.beginPath();
        let x = this.#startX + this.#dx(shouldWarn);
        let y = this.#startY;
        context.moveTo(x, y);
        x += this.#width;
        y += this.#height / 2;
        context.lineTo(x, y);
        x += 0;
        y += -this.#height;
        context.lineTo(x, y);
        context.closePath();

        if (shouldWarn) {
            context.fillStyle = "rgba(255, 0, 0, 0.6)";
        }
        else {
            context.fillStyle = "rgba(255, 255, 0, 0.6)";
        }
        context.fill();

        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.lineJoin = "round";
        context.stroke();
    }

    update(shouldWarn) {
        throw new Error("30fps未対応");
        this.#frameCount++;
        this.#updateBounds(shouldWarn);
    }

    isTargeted(crosshairX, crosshairY) {
        const a = 10;
        const b = 20;
        if (crosshairX < this.#x - a) {
            return false;
        }
        if (crosshairX > this.#x + this.#width + a) {
            return false;
        }
        if (crosshairY < this.#y - b) {
            return false;
        }
        if (crosshairY > this.#y + this.#height + b) {
            return false;
        }
        return true;
    }

    #dx(shouldWarn) {
        const a = shouldWarn ? 5 : 10;
        return Math.sin(this.#frameCount / a) * 10 + 10;
    }

    #updateBounds(shouldWarn) {
        this.#x = this.#startX + this.#dx(shouldWarn);
    }
}
