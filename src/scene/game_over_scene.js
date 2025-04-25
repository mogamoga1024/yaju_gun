
class GameOverScene extends Scene {
    #score = 0; 
    #canClick = false;

    onStart(score) {
        console.log("GameOverScene:onStart");
        this.#score = score;
        this.state = "loaded";
        this.#update();
        setTimeout(() => {
            // すぐにタイトル画面に戻ってほしくないため
            this.#canClick = true;
        }, 500);
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgb(255, 0, 128)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.textAlign = "start";
        context.textBaseline = "top";
        context.lineJoin = "round";
        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;

        
    }

    onClick(e) {
        if (!this.#canClick) {
            return;
        }
        SceneManager.start(new TitleScene(), false);
    }
}
