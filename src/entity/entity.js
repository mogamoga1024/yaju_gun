
class Entity {
    temaeRate = 1;
    state = "alive"; // alive or dying or dead or disappear
    healAmount = 0.2;

    constructor(temaeRate = 1) {
        this.temaeRate = temaeRate;
    }

    end() {}
    draw() {}
    update(viewAngle) {}
    isTargeted(crosshairX, crosshairY) { return false; }
    takeDamage() {}
}
