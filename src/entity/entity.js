
class Entity {
    temaeRate = 1;
    state = "alive"; // alive or dying or dead or disappear
    healAmount = 0.05;
    power = 1;
    hasGivenExp = false;
    baseScore = 100;
    static spawnWeight = 1;

    get score() {
        if (difficulty === "easy") {
            return Math.floor(this.baseScore / 100);
        }
        else if (difficulty === "normal") {
            return Math.floor(this.baseScore / 10);
        }
        else /*if (difficulty === "hard")*/ {
            return this.baseScore;
        }
    }

    constructor(temaeRate = 1) {
        this.temaeRate = temaeRate;
    }

    end() {}
    draw() {}
    update(viewAngle) {}
    isTargeted(crosshairX, crosshairY) { return false; }
    takeDamage() {}
    getXRange() { return {leftX: 0, rightX: 0}; }
}
