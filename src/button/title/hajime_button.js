
class HajimeButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        this.#text = "はじめから";
        this.#x = 180;
        this.#centerY = 260;
        this.#height = 40;

        context.font = `400 ${this.#height}px 'Noto Sans JP'`;
        this.#width = context.measureText(this.#text).width;
    }
    
    draw(isSelected = false) {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.lineWidth = 5;
        if (isSelected) {
            context.fillStyle = "#f00";
            context.strokeStyle = "#ff0";
        }
        else {
            context.fillStyle = "#000";
            context.strokeStyle = "#eee";
        }
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
