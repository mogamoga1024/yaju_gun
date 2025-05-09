
class TudukiButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";
    #isActive = false;

    constructor(isActive) {
        super();
        this.#text = "つづきから";
        this.#centerY = 260;
        this.#height = 40;
        this.#isActive = isActive;

        context.font = `400 ${this.#height}px 'Noto Sans JP'`;
        this.#width = context.measureText(this.#text).width;

        this.#x = canvas.width - this.#width - 220;
    }
    
    draw(isSelected = false) {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.lineWidth = 5;
        if (!this.#isActive) {
            context.globalAlpha = 0.5
            context.fillStyle = "#888";
            context.strokeStyle = "#ccc";
        }
        else if (isSelected) {
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
        if (!this.#isActive) {
            return false;
        }
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
