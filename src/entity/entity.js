
class Entity {
    temaeRate = 1;
    state = "alive"; // alive or dying or dead

    constructor(temaeRate = 1) {
        this.temaeRate = temaeRate;
    }

    draw() {}
    update(viewAngle) {}
    isTargeted(crosshairX, crosshairY) { return false; }
    takeDamage() {}
}
