
class MeteorSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #oriWidth = 0;
    #oriHeight = 0;
    #pivotX = 0;
    #angle = 0;
    #frameCount = 0;
    #imageList = [];
    #imageListIndex = 0;
    #imageListIndexDelta = 1;
    #animeFrameMax = 11;
    #meteorSound = null;
    #hasPlayedMeteorSound = false;
    #opacity = 1;
    #explosion = null;

    constructor(pivotX, viewAngle, temaeRate = 0) {
        super(temaeRate);
        this.#pivotX = pivotX;
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

        context.save();
        context.globalAlpha = this.#opacity;
        context.translate(this.#x + this.#width, this.#y + this.#height);
        context.rotate(this.#angle);
        const image = this.#imageList[this.#imageListIndex];
        // context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
        context.drawImage(image, -this.#width, -this.#height, this.#width, this.#height);
        // context.globalAlpha = 1;
        context.restore();

        // todo
        this.#explosion?.draw(this.#x + this.#width / 2, this.#y + this.#height / 2, Math.max(this.#width, this.#height));
    }

    update(viewAngle) {
        this.#frameCount++;
        this.#explosion?.update();

        // todo

        if (this.#frameCount % 4 == 0) {
            if (this.#imageListIndex <= 0) {
                this.#imageListIndexDelta = 1;
            }
            else if (this.#imageListIndex >= this.#animeFrameMax) {
                this.#imageListIndexDelta = -1;
            }
            this.#imageListIndex += this.#imageListIndexDelta;
        }

        this.#angle += 0.05;

        this.#updateBounds(viewAngle);
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
        this.#x = (this.#pivotX - this.#width + offsetX) % (canvas.width * 2);
        if (this.#x + this.#width > canvas.width * 2) {
            this.#x = this.#x - canvas.width * 2;
        }

        // todo 仮
        // this.#x = 0;
        this.#y = 0;
    }
}
