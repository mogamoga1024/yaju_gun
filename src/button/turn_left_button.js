
class TurnLeftButton {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #image = null;

    constructor(left) {
        this.#image = ImageStorage.get("左向くんだよ");
        this.#width = this.#image.width * 0.2;
        this.#height = this.#image.height * 0.2;
        this.#x = left;
        this.#y = (canvas.height - this.#height) / 2;
    }

    draw() {
        context.globalAlpha = 0.7;
        context.drawImage(this.#image, this.#x, this.#y, this.#width, this.#height);
        context.globalAlpha = 1;
    }
}
