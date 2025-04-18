
class TurnLeftButton {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #image = null;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
        this.#image = ImageStorage.get("左向くんだよ");
    }

    draw() {
        // todo
    }
}
