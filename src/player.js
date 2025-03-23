
class Player {
    drawCrosshair(x, y) {
        const image = ImageStorage.get("照準");
        const size = 80;
        context.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    takeDamage() {
        playSound(SoundStorage.get("ドンッ"));
    }
}

