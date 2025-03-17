
class KotodamaGroup {
    #text = "";
    #fontSize = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;
    // #kotodamaList = [];

    constructor(text, centerX, temaeRate) {
        this.#text = text;
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        this.#fontSize = 200;
    }

    draw() {
        // todo 仮
        const fontSize = this.#fontSize * this.#temaeRate;
        // 水平線でのcenterY
        const centerY0 = canvas.height / 2; // todo 野獣先輩の口のy座標にする
        // 一番手前のcenterY
        const centerY1 = canvas.height / 2;
        const centerY = centerY0 * (1 - this.#temaeRate) + centerY1 * this.#temaeRate;

        context.font = `${fontSize}px Meiryo`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "pink";
        context.fillText(this.#text, this.#centerX, centerY);
    }

    update() {
        this.#frameCount++;

        const temaeRateMax = 1;
        if (this.#temaeRate >= temaeRateMax) {
            return;
        }

        let a = 0.002 + 0.002 * this.#temaeRate;

        this.#temaeRate = Math.min(this.#temaeRate + a, temaeRateMax);
    }
}
