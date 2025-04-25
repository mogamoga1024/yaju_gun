
class GotoTitleButton extends Button {
    #x = 0;
    #centerY = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        this.#text = "終わる";
        this.#x = 300;
        this.#centerY = 390;
        this.#height = 32;

        context.font = `400 ${this.#height}px Xim-Sans`;
        this.#width = context.measureText(this.#text).width;
    }
    
    draw() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.fillStyle = "#fff";
        context.font = `400 ${this.#height}px Xim-Sans`;
        context.fillText(this.#text, this.#x, this.#centerY);
        context.restore();
    }

    isTargeted(crosshairX, crosshairY) {
        // todo
        return false;
    }
}
