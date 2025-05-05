
class MedikaraSenpai extends Entity {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #chargeImage1 = 0;
    #chargeImage2 = 0;
    #kaihouImage = 0;
    #chargeSound = null;
    #chargeSoundId = -1;
    #roarSound = null;
    #roarSoundId = -1;
    #roarTimerId = -1;
    #powerGauge = 90;
    #chargeFrameCount = 0;
    #fullFrameCount = 0;
    isRoaring = false;

    get centerX() {
        return this.#x + this.#width;
    }
    get centerY() {
        return this.#y + this.#height;
    }
    get powerGauge() {
        return this.#powerGauge;
    }

    constructor(powerGauge = 90) {
        super();

        this.#powerGauge = powerGauge;

        this.#chargeImage1 = ImageStorage.get("目力先輩/溜め1");
        this.#chargeImage2 = ImageStorage.get("目力先輩/溜め2");
        this.#kaihouImage = ImageStorage.get("目力先輩/解放");

        this.#roarSound = SoundStorage.get("目力先輩/アー！");

        this.#height = 90;
        this.#width = this.#height * this.#chargeImage1.width / this.#chargeImage1.height;
        this.#x = canvas.width - this.#width - 15;
        this.#y = canvas.height - this.#height - 35;
    }

    draw() {
        let image;
        if (this.isRoaring) {
            image = this.#kaihouImage;
        }
        else if (this.#powerGauge >= 100) {
            if (Math.sin(this.#fullFrameCount / 5) > 0) {
                image = this.#chargeImage1;
            }
            else {
                image = this.#chargeImage2;
            }
        }
        else if (this.#chargeFrameCount > 0) {
            image = this.#chargeImage2;
        }
        else {
            image = this.#chargeImage1;
        }

        if (this.isRoaring) {
            const w = this.#width * 2;
            const h = this.#height * 2;
            const x = this.#x - (w - this.#width) / 2;
            const y = this.#y - (h - this.#height) / 2;
            context.drawImage(image, x, y, w, h);
        }
        else {
            context.drawImage(image, this.#x, this.#y, this.#width, this.#height);
        }

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
        if (this.#powerGauge >= 100) {
            this.#fullFrameCount++;
        }
        if (this.#chargeFrameCount > 0) {
            this.#chargeFrameCount--;
        }
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

    onTouched() {
        if (this.isRoaring) {
            return;
        }
        if (this.#chargeSound !== null) {
            this.#chargeSound.stop(this.#chargeSoundId);
            this.#chargeSound = null;
        }
        if (this.#powerGauge >= 100) {
            this.#powerGauge = 0;
            this.#roar();
        }
        else {
            this.charge(true);
        }
    }

    charge(needSound = false) {
        if (this.#powerGauge >= 100) {
            this.#powerGauge = 100;
            return;
        }
        if (needSound) {
            if (Math.random() < 0.5) {
                this.#chargeSound = SoundStorage.get("目力先輩/ヌウン");
            }
            else {
                this.#chargeSound = SoundStorage.get("目力先輩/ヘッヘッ");
            }
            this.#chargeSoundId = this.#chargeSound.play();
        }
        this.#powerGauge += 1;
        this.#chargeFrameCount = 8;
    }

    #roar() {
        this.isRoaring = true;
        if (this.#roarSoundId !== -1) {
            this.#roarSound.off("playerror", this.#roarSoundId);
            this.#roarSound.off("end", this.#roarSoundId);
        }
        if (this.#roarTimerId !== -1) {
            clearTimeout(this.#roarTimerId);
            this.#roarTimerId = -1;
        }

        if (this.#roarSound.isOK) {
            this.#roarSoundId = this.#roarSound.play();
            const fn = () => {
                this.isRoaring = false;
                this.#roarSound.off("playerror", this.#roarSoundId);
                this.#roarSound.off("end", this.#roarSoundId);
                this.#roarSoundId = -1;
            };
            this.#roarSound.on("playerror", fn, this.#roarSoundId);
            this.#roarSound.on("end", fn, this.#roarSoundId);
        }
        else {
            this.#roarTimerId = setTimeout(() => {
                this.isRoaring = false;
            }, 250);
        }
    }
}
