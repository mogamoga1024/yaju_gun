
class MedikaraSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #tameImage1 = 0;
    #tameImage2 = 0;
    #kaihouImage = 0;

    constructor() {
        super();
        // todo

        this.#tameImage1 = ImageStorage.get("目力先輩/溜め1");
        this.#tameImage2 = ImageStorage.get("目力先輩/溜め2");
        this.#kaihouImage = ImageStorage.get("目力先輩/解放");
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
        if (crosshairY < this.#y) {
            return false;
        }
        if (crosshairY > this.#y + this.#height) {
            return false;
        }
        return true;
    }
}
