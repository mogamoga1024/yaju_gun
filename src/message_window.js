
class MessageWindow {
    static #x = 0;
    static #y = 0;
    static #width = 0;
    static #height = 0;
    static #canDraw = true;
    static #currentText = "";
    static #timerId = 0;

    static init(marginX, marginY) {
        const height = canvas.height / 3;
        this.#x = marginX;
        this.#y = canvas.height - (height + marginY);
        this.#width = canvas.width - marginX * 2;
        this.#height = height;
    }

    static #drawWindow() {
        context.beginPath();
        context.fillStyle = "rgba(0, 128, 255, 0.7)";
        context.roundRect(this.#x, this.#y, this.#width, this.#height, 20);
        context.fill();
    }

    // drawText("", true)でウィンドウを閉じる
    // drawText("", false)でウィンドウを表示しっぱなし
    static drawText(text, isTransient = false) {
        if (isTransient) {
            this.#drawTransientText(text);
        }
        else {
            this.#drawText(text);
        }
    }

    static #drawText(text) {
        this.#drawWindow();

        const fontSize = 32;
        const lineHeight = fontSize * 1.1;
        const lineTextList = text.split("\n");
        let y = this.#y + (this.#height - lineHeight * lineTextList.length) / 2 + lineHeight / 2;

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `400 ${fontSize}px 'Noto Sans JP'`;
        context.fillStyle = "#fff";

        for (let i = 0; i < lineTextList.length; i++) {
            const lineText = lineTextList[i];
            context.fillText(lineText, canvas.width / 2, y);
            y += lineHeight;
        }
    }

    static #drawTransientText(text) {
        if (text === "") {
            return;
        }
        if (this.#currentText !== text) {
            clearTimeout(this.#timerId);
            this.#currentText = text;
            this.#canDraw = true;
        }
        else if (!this.#canDraw) {
            return;
        }

        this.#timerId = setTimeout(() => {
            this.#canDraw = false;
        }, 2000);

        this.#drawText(text);
    }
}
