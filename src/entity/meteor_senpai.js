
class MeteorSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #centerX = 0;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #animeFrameMax = 11;
    #meteorSound = null;
    #hasPlayedMeteorSound = false;
    #opacity = 1;
    #explosion = null;

    constructor(centerX, viewAngle, temaeRate = 0) {
        super(temaeRate);
        this.#centerX = centerX;
        for (let i = 0; i <= this.#animeFrameMax; i++) {
            const image = ImageStorage.get(`タオル先輩/${i}`);
            this.#imageList.push(image);
        }
        this.#oriWidth = this.#imageList[0].width * 1.8;
        this.#oriHeight = this.#imageList[0].height * 1.8;
        this.#hasPlayedMeteorSound = false;
        this.#updateBounds(viewAngle);
    }

    draw() {
        // todo sound

        context.globalAlpha = this.#opacity;
        const image = this.#imageList[this.#imageListIndex];
        context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
        context.globalAlpha = 1;

        this.#explosion?.draw(this.#x + this.#width / 2, this.#y + this.#height / 2, Math.max(this.#width, this.#height));
    }

    update(viewAngle) {
        // todo
    }

    isTargeted(crosshairX, crosshairY) { 
        // todo
        return false;
    }

    takeDamage() {
        // todo
    }

    #updateBounds(viewAngle) {
        this.#width = this.#oriWidth * this.temaeRate;
        this.#height = this.#oriHeight * this.temaeRate;

        const canvasCenterX = canvas.width / 2;
        const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
        this.#x = (this.#centerX - this.#width / 2 + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }

        // todo 仮
        this.#y = 0;
    }
}
