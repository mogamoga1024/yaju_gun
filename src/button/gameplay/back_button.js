
class BackButton extends Button {
    #x = 0;
    #y = 0;
    #width = 0;
    #height = 0;
    #text = "何でもない";

    constructor() {
        super();
        this.#y = 70;
        this.#width = 230;
        this.#height = 150;
        this.#x = (canvas.width - this.#width) / 2;
    }
    
    draw() {
        context.beginPath();
        context.fillStyle = "rgba(0, 128, 255, 0.7)";
        context.roundRect(this.#x, this.#y, this.#width, this.#height, 20);
        context.fill();

        const fontSize = 32;
        const lineHeight = fontSize * 1.1;
        const lineTextList = this.#text.split("\n");
        let y = this.#y + (this.#height - lineHeight * lineTextList.length) / 2 + lineHeight / 2;

        const x = this.#x + this.#width / 2;

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `400 ${fontSize}px 'Noto Sans JP'`;
        context.fillStyle = "#fff";

        for (let i = 0; i < lineTextList.length; i++) {
            const lineText = lineTextList[i];
            context.fillText(lineText, x, y);
            y += lineHeight;
        }
    }

    isTargeted(crosshairX, crosshairY) {
        if (crosshairX < this.#x) {
            return false;
        }
        if (crosshairX > this.#x + this.#width) {
            return false;
        }
        if (crosshairY < this.#y - this.#height) {
            return false;
        }
        if (crosshairY > this.#y + this.#height) {
            return false;
        }
        return true;
    }
}
