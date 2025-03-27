
class Player {
    drawCrosshair(x, y, willHit = false) {
        const image = ImageStorage.get(willHit ? "照準2" : "照準1");
        const size = 80;
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    takeDamage() {
        loadSound("ドンッ").then(sound => playSound(sound));
    }

    #canHitTarget(target) {
        // todo
    }
}

