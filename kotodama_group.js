
class KotodamaGroup {
    #text = "";
    #fontSize = 0;
    #centerX = 0;
    #temaeRate = 1;
    #frameCount = 0;

    constructor(text, centerX, temaeRate) {
        this.#text = text;
        this.#centerX = centerX;
        this.#temaeRate = temaeRate;
        this.#fontSize = 64; // todo temaeRateに依存させる
    }

    draw() {
        // todo
    }

    update() {
        this.#frameCount++;
    }
}
