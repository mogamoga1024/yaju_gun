
class KMR extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #sittingImage = null;
    #despairImage = null;
    #isDespair = true;

    constructor() {
        super();
        this.#sittingImage = ImageStorage.get("座るKMR");
        this.#despairImage = ImageStorage.get("絶望KMR");
        this.#width = this.#sittingImage.width * 0.4;
        this.#height = this.#sittingImage.height * 0.4;
        this.#x = 15;
        this.#y = canvas.height - this.#height - 15;
    }

    draw() {
        const image = this.#isDespair ? this.#despairImage : this.#sittingImage;
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
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

    despair(isDespair) {
        this.#isDespair = despair;
    }
}
