
class StartButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        this.#text = "スタート";
        this.#centerY = 395;
        this.#height = 70;

        context.font = `400 ${this.#height}px 'Noto Sans JP'`;
        this.#width = context.measureText(this.#text).width;

        this.#x = (canvas.width - this.#width) / 2;
    }
    
    draw() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 8;
        context.font = `900 ${this.#height}px 'Noto Sans JP'`;
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
