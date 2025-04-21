
class Player {
    #hp = 4;
    #maxHp = 4;
    #mutekiFrameCount = 0;

    drawCrosshair(x, y, willHit = false) {
        const image = ImageStorage.get(willHit ? "照準2" : "照準1");
        const size = 80;
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    takeDamage(power) {
        if (this.#mutekiFrameCount > 0) {
            playSound(SoundStorage.get("謎の金属音"));
            return;
        }

        this.#hp -= power; // todo GameOver
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

    damageRate() {
        if (this.#hp <= 0) return 1;
        return 1 - (this.#hp / this.#maxHp);
    }

    update() {
        if (this.#mutekiFrameCount > 0) {
            this.#mutekiFrameCount -= 1;
        }
    }
}

