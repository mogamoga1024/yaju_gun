
class TweetButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        this.#text = "つぶやく";
        this.#centerY = 390;
        this.#height = 32;

        context.font = `400 ${this.#height}px Xim-Sans`;
        this.#width = context.measureText(this.#text).width;

        this.#x = canvas.width - this.#width - 300;
    }
    
    draw() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.lineWidth = 5;
        context.strokeStyle = "rgb(255, 0, 128)";
        context.font = `400 ${this.#height}px Xim-Sans`;
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
