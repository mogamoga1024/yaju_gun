
class Kotodama {
    #text = "";
    #fontSize = 0;
    #centerX = 0;
    #centerY = 0;
    #temaeRate = 1;
    #frameCount = 0;
    #radian = 0;
    #type = "uneune"; // "uneune" or "kurukuru"

    constructor(text, centerX, centerY, temaeRate, type = "uneune") {
        this.#text = text;
        this.#centerX = centerX;
        this.#centerY = centerY;
        this.#temaeRate = temaeRate;
        this.#type = type;
        this.#fontSize = 250;
    }

    draw(viewAngle) {
        const fontSize = this.#fontSize * this.#temaeRate;

        // 水平線でのcenterY
        const centerY0 = this.#centerY;
        // 一番手前のcenterY
        const centerY1 = canvas.height / 2;
        let centerY = centerY0 * (1 - this.#temaeRate) + centerY1 * this.#temaeRate;

        context.font = `700 ${fontSize}px Meiryo`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        const width = context.measureText(this.#text).width;
        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        let centerX = (this.#centerX + offsetX) % (canvas.width * 2);

        if (this.#type === "uneune") {
            centerX += Math.sin(this.#radian) * 200 * this.#temaeRate;
        }
        else if (this.#type === "kurukuru") {
            centerX += Math.sin(this.#radian) * 200 * this.#temaeRate;
            centerY += Math.cos(this.#radian) * 200 * this.#temaeRate;
        }

        if (centerX + width / 2 > canvas.width * 2) {
            centerX = centerX - canvas.width * 2;
        }

        context.lineWidth = 10 * this.#temaeRate;
        context.strokeStyle = "#B00000";
        context.strokeText(this.#text, centerX, centerY);
        
        context.fillStyle = `rgba(255, 192, 203, ${0.5 + this.#temaeRate / 2})`;
        context.fillText(this.#text, centerX, centerY);
    }

    update() {
        this.#frameCount++;
        this.#radian += 0.02;

        const temaeRateMax = 1;
        if (this.#temaeRate >= temaeRateMax) {
            return;
        }

        let a = 0.001 + 0.001 * this.#temaeRate;

        this.#temaeRate = Math.min(this.#temaeRate + a, temaeRateMax);
    }
}
