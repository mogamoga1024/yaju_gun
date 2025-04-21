
class Kotodama extends Entity {
    shooter = null;
    #centerX = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #fontSize = 0;
    #text = "";
    #oriFontSize = 0;
    #oriCenterX = 0;
    #oriCenterY = 0;
    #frameCount = 0;
    #radian = 0;
    #type = "uneune"; // "uneune" or "kurukuru"
    #color = null;
    healAmount = 0;
    power = 0.5;

    constructor(shooter, text, centerX, centerY, viewAngle, temaeRate, type, color) {
        super(temaeRate);
        this.shooter = shooter;
        this.#text = text;
        this.#oriCenterX = centerX;
        this.#oriCenterY = centerY;
        this.#type = type;
        this.#color = color;
        this.#oriFontSize = 250;
        this.#updateBounds(viewAngle);
    }

    draw() {
        context.font = `400 ${this.#fontSize}px Xim-Sans`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 10 * this.temaeRate;
        context.strokeStyle = this.#color.stroke;
        context.lineJoin = "round";
        context.strokeText(this.#text, this.#centerX, this.#centerY);
        
        context.fillStyle = `rgba(${this.#color.fill}, ${0.5 + this.temaeRate / 2})`;
        context.fillText(this.#text, this.#centerX, this.#centerY);
    }

    update(viewAngle) {
        this.#frameCount++;
        this.#radian += 0.02 * (1 + balanceFactor() / 200);

        const temaeRateMax = 1;
        if (this.temaeRate >= temaeRateMax) {
            this.temaeRate = temaeRateMax;
        }
        else {
            let a = 0.002 + 0.001 * this.temaeRate;
            a *= 1 + balanceFactor() / 100;
            this.temaeRate = Math.min(this.temaeRate + a, temaeRateMax);
        }

        this.#updateBounds(viewAngle);
    }

    isTargeted(crosshairX, crosshairY) {
        if (this.state !== "alive") {
            return false;
        }
        const x = this.#centerX - this.#width / 2;
        const y = this.#centerY - this.#height / 2;
        if (crosshairX < x) {
            return false;
        }
        if (crosshairX > x + this.#width) {
            return false;
        }
        if (crosshairY < y) {
            return false;
        }
        if (crosshairY > y + this.#height) {
            return false;
        }
        return true;
    }

    takeDamage() {
        playSound(SoundStorage.get("大破"));
        this.state = "dead";
    }

    leftX() {
        return this.#centerX - this.#width / 2;
    }

    #updateBounds(viewAngle) {
        this.#fontSize = this.#oriFontSize * this.temaeRate;
        context.font = `400 ${this.#fontSize}px Xim-Sans`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        const measure = context.measureText(this.#text);
        this.#width = measure.width;
        this.#height = this.#fontSize;

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#centerX = (this.#oriCenterX + offsetX) % (canvas.width * 2);

        // 水平線でのcenterY
        const centerY0 = this.#oriCenterY;
        // 一番手前のcenterY
        const centerY1 = canvas.height / 2;
        this.#centerY = centerY0 * (1 - this.temaeRate) + centerY1 * this.temaeRate;

        if (this.#type === "uneune") {
            this.#centerX += Math.sin(this.#radian) * 200 * this.temaeRate;
        }
        else if (this.#type === "kurukuru") {
            this.#centerX += Math.sin(this.#radian) * 100 * this.temaeRate;
            this.#centerY += Math.cos(this.#radian) * 100 * this.temaeRate;
        }

        if (this.#centerX + this.#width / 2 > canvas.width * 2) {
            this.#centerX = this.#centerX - canvas.width * 2;
        }
    }
}
