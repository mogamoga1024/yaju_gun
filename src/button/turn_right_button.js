
class TurnRightButton {
    #startX = 0;
    #startY = 0;
    #frameCount = 0;

    constructor(right) {
        this.#startX = canvas.width - right;
        this.#startY = canvas.height / 2;
    }

    draw() {
        const dx = Math.sin(this.#frameCount++ / 10) * 10 + 10;

        context.beginPath();
        let x = this.#startX - dx;
        let y = this.#startY;
        context.moveTo(x, y);
        x += -50;
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
