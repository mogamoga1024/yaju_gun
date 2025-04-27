
class BackButton extends Button {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #text = "";

    constructor() {
        super();
        // todo
    }
    
    draw() {
        // todo
    }

    isTargeted(crosshairX, crosshairY) {
        if (crosshairX < this.#x) {
            return false;
        }
        if (crosshairX > this.#x + this.#width) {
            return false;
        }
        if (crosshairY < this.#y - this.#height) {
            return false;
        }
        if (crosshairY > this.#y + this.#height) {
            return false;
        }
        return true;
    }
}
