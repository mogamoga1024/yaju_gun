
class TurnLeftButton {
    #startX = 0;
    #startY = 0;

    constructor(left) {
        this.#startX = left;
        this.#startY = canvas.height / 2;
    }

    draw() {
        context.beginPath();
        let x = this.#startX;
        let y = this.#startY;
        context.moveTo(x, y);
        x += 50;
        y += 30;
        context.lineTo(x, y);
        x += 0;
        y += -30 * 2;
        context.lineTo(x, y);
        context.closePath();

        context.fillStyle = "rgba(255, 255, 0, 0.6)";
        context.fill();

        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.lineJoin = "round";
        context.stroke();
    }
}
