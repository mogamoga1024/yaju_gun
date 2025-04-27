
class Player {
    state = "alive"; // alive or or dying or dead
    #hp = 4;
    #maxHp = 4;
    #mutekiFrameCount = 0;

    get hp() {
        return this.#hp;
    }

    constructor(hp = 4) {
        if (hp <= 0 || hp > this.#maxHp) {
            this.#hp = this.#maxHp;
        }
        else {
            this.#hp = hp;
        }
    }

    drawCrosshair(x, y, willHit = false) {
        const image = ImageStorage.get(willHit ? "照準2" : "照準1");
        const size = 80;
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    drawDamageOverlay() {
        const damageRate = 1 - (this.#hp / this.#maxHp);

        context.save();
        const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2 - 100 * damageRate
        );
        gradient.addColorStop(0, "rgba(255, 128, 170, 0)");
        gradient.addColorStop(1, `rgba(255, 128, 170, ${damageRate})`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }

    takeDamage(power) {
        if (this.#mutekiFrameCount > 0) {
            playSound(SoundStorage.get("謎の金属音"));
            return;
        }

        this.#hp -= power;
        if (this.#hp <= 0) {
            this.#hp = 0;
            this.state = "dying";
        }
        playSound(SoundStorage.get("ドンッ"));
        playSound(SoundStorage.get("アアッー！(高音)"));
        
        this.#mutekiFrameCount = 60 * 2;
    }

    heal(amount) {
        this.#hp += amount;
        if (this.#hp > this.#maxHp) {
            this.#hp = this.#maxHp;
        }
    }

    update() {
        if (this.#mutekiFrameCount > 0) {
            this.#mutekiFrameCount -= 1;
        }
    }
}

