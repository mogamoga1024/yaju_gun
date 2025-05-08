
class Entity {
    temaeRate = 1;
    state = "alive"; // alive or dying or dead or disappear
    healAmount = 0.05;
    power = 1;
    hasGivenExp = false;
    exp = 1;
    chargeAmound = 1;
    score = 100;
    static spawnWeight = 1;
    canAttackForever = false;

    constructor(temaeRate = 1) {
        this.temaeRate = temaeRate;
    }

    end() {}
    draw() {}
    update(viewAngle) {}
    isTargeted(crosshairX, crosshairY) { return false; }
    instantDeath(damageSoundVolume) {}
    takeDamage() {}
    getXRange() { return {leftX: 0, rightX: 0}; }

    canAttack() {
        return this.temaeRate >= 1; 
    }
}
