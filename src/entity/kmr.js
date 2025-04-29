
class KMR extends Entity {
    #sittingX = 0;
    #sittingY = 0;
    #sittingW = 0;
    #sittingH = 0;
    #sittingImage = null;
    #despairX = 0;
    #despairY = 0;
    #despairW = 0;
    #despairH = 0;
    #despairImage = null;
    #isDespair = false;
    #prevText = "";
    #soundId = -1;

    constructor() {
        super();
        this.#sittingImage = ImageStorage.get("座るKMR");
        this.#despairImage = ImageStorage.get("絶望KMR");

        this.#sittingW = this.#sittingImage.width * 0.4;
        this.#sittingH = this.#sittingImage.height * 0.4;
        this.#sittingX = 15;
        this.#sittingY = canvas.height - this.#sittingH - 15;

        this.#despairH = this.#sittingH;
        this.#despairW = this.#despairH * this.#despairImage.width / this.#despairImage.height;
        this.#despairX = 15;
        this.#despairY = canvas.height - this.#despairH - 15;
    }

    draw() {
        if (this.#isDespair) {
            context.drawImage(this.#despairImage, this.#despairX, this.#despairY, this.#despairW, this.#despairH);
        }
        else {
            context.drawImage(this.#sittingImage, this.#sittingX, this.#sittingY, this.#sittingW, this.#sittingH);
        }
    }

    say(text) {
        if (this.#soundId !== -1) {
            stopSound(SoundStorage.get(this.#prevText), this.#soundId);
        }
        this.#prevText = text;
        playSound(SoundStorage.get(text)).then(id => {
            if (text !== this.#prevText) {
                stopSound(SoundStorage.get(text), id);
            }
            else {
                this.#soundId = id;
            }
        });
    }

    isTargeted(crosshairX, crosshairY) {
        let x, y, w, h;
        if (this.#isDespair) {
            x = this.#despairX; y = this.#despairY;
            w = this.#despairW; h = this.#despairH;
        }
        else {
            x = this.#sittingX; y = this.#sittingY;
            w = this.#sittingW; h = this.#sittingH;
        }

        if (crosshairX < x) {
            return false;
        }
        if (crosshairX > x + w) {
            return false;
        }
        if (crosshairY < y) {
            return false;
        }
        if (crosshairY > y + h) {
            return false;
        }
        return true;
    }

    despair(isDespair) {
        this.#isDespair = isDespair;
    }
}
