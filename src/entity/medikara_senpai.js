
class MedikaraSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #chargeImage1 = 0;
    #chargeImage2 = 0;
    #kaihouImage = 0;
    #powerGauge = 0;
    #chargeFrameCount = 0;

    constructor() {
        super();
        
        this.#chargeImage1 = ImageStorage.get("目力先輩/溜め1");
        this.#chargeImage2 = ImageStorage.get("目力先輩/溜め2");
        this.#kaihouImage = ImageStorage.get("目力先輩/解放");

        this.#height = 90;
        this.#width = this.#height * this.#chargeImage1.width / this.#chargeImage1.height;
        this.#x = canvas.width - this.#width - 15;
        this.#y = canvas.height - this.#height - 35;
    }

    draw() {
        // todo
        let image;
        if (this.#chargeFrameCount > 0) {
            image = this.#chargeImage2;
        }
        else {
            image = this.#chargeImage1;
        }
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);

        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;
        context.font = `400 30px Xim-Sans`;
        drawStrokeText(context, `${this.#powerGauge}%`, this.#x + this.#width / 2, this.#y + this.#height + 5);
        context.restore();
    }

    update() {
        if (this.#chargeFrameCount > 0) {
            this.#chargeFrameCount--;
        }
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

    charge() {
        if (this.#powerGauge === 100) {
            return;
        }
        this.#powerGauge += 1;
        this.#chargeFrameCount = 8;
    }
}
