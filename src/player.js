
class Player {
    #hp = 5;
    #maxHp = 5;

    drawCrosshair(x, y, willHit = false) {
        const image = ImageStorage.get(willHit ? "照準2" : "照準1");
        const size = 80;
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    takeDamage() {
        this.#hp -= 1; // todo GameOver
        playSound(SoundStorage.get("ドンッ"));
        playSound(SoundStorage.get("アアッー！(高音)"));
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
}

