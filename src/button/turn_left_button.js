
class TurnLeftButton {
    #startX = 0;
    #startY = 0;
    #x = 0;
    #y = 0;
    #width = 50;
    #height = 60;
    #frameCount = 0;

    constructor(left) {
        this.#startX = left;
        this.#startY = canvas.height / 2;
    }

    draw() {
        const dx = Math.sin(this.#frameCount++ / 10) * 10 + 10;

        context.beginPath();
        let x = this.#startX + dx;
        let y = this.#startY;
        context.moveTo(x, y);
        x += this.#width;
        y += this.#height / 2;
        context.lineTo(x, y);
        x += 0;
        y += -this.#height;
        context.lineTo(x, y);
        context.closePath();

        context.fillStyle = "rgba(255, 255, 0, 0.6)";
        context.fill();

        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.lineJoin = "round";
        context.stroke();
    }

    isTargeted(crosshairX, crosshairY) {
        
    }
}
