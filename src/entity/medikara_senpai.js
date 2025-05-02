
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
        
        this.#tameImage1 = ImageStorage.get("目力先輩/溜め1");
        this.#tameImage2 = ImageStorage.get("目力先輩/溜め2");
        this.#kaihouImage = ImageStorage.get("目力先輩/解放");

        this.#height = 90;
        this.#width = this.#height * this.#tameImage1.width / this.#tameImage1.height;
        this.#x = canvas.width - this.#width - 15;
        this.#y = canvas.height - this.#height - 35;
    }

    draw() {
        // todo
        context.drawImage(this.#tameImage1, this.#x, this.#y, this.#width, this.#height);

        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;
        context.font = `400 30px Xim-Sans`;
        drawStrokeText(context, "100%", this.#x + this.#width / 2, this.#y + this.#height + 5);
        context.restore();
    }

    update() {
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
