
class Kotodama {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
    }

    draw() {
        context.fillStyle = "green";
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}
