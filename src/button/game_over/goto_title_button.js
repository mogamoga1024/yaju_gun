
class GotoTitleButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        this.#text = "終わる";
        this.#x = 280;
        this.#centerY = 385;
        this.#height = 40;

        context.font = `400 ${this.#height}px 'Noto Sans JP'`;
        this.#width = context.measureText(this.#text).width;
    }
    
    draw() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.lineWidth = 5;
        context.strokeStyle = "rgb(255, 0, 128)";
        context.font = `400 ${this.#height}px 'Noto Sans JP'`;
        drawStrokeText(context, this.#text, this.#x, this.#centerY);
        context.restore();
    }

    isTargeted(crosshairX, crosshairY) {
        if (crosshairX < this.#x) {
            return false;
        }
        if (crosshairX > this.#x + this.#width) {
            return false;
        }
        if (crosshairY < this.#centerY - this.#height / 2) {
            return false;
        }
        if (crosshairY > this.#centerY + this.#height / 2) {
            return false;
        }
        return true;
    }
}
