
class MessageWindow {
    static #x = 0;
    static #y = 0;
    static #width = 0;
    static #height = 0;

    static init(marginX, marginY) {
        const height = canvas.height / 3;
        this.#x = marginX;
        this.#y = canvas.height - (height + marginY);
        this.#width = canvas.width - marginX * 2;
        this.#height = height;
    }

    static drawWindow() {
        context.beginPath();
        context.fillStyle = "rgba(0, 128, 255, 0.5)";
        context.roundRect(this.#x, this.#y, this.#width, this.#height, 20);
        context.fill();
    }

    static drawText() {
        // todo
    }
}
