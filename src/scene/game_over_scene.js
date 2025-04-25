
class GameOverScene extends Scene {
    #score = 0; 
    #canClick = false;

    constructor(score) {
        super();
        this.#score = score;
    }

    onStart() {
        console.log("GameOverScene:onStart");
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
        // context.lineJoin = "round";
        context.fillStyle = "#fff";
        // context.strokeStyle = "#eee";
        // context.lineWidth = 5;

        this.#drawTitle();
        this.#drawLevel();
        this.#drawScore();
        this.#drawComment();
    }

    #drawTitle() {
        context.font = "400 80px 'Noto Sans JP'";
        const text = "リザルト";
        const width = context.measureText(text).width;
        context.fillText(text, (canvas.width - width) / 2, 30);
    }

    #drawLevel() {
        context.font = "400 40px Xim-Sans";
        const maxLevel = 50;
        let text = "Lv.";
        if (level < maxLevel) {
            text += String(level);
        }
        else if (level === maxLevel) {
            text += "MAX";
        }
        else {
            text += `MAX+${level - maxLevel}`;
        }
        const width = context.measureText(text).width;
        context.fillText(text, (canvas.width - width) / 2, 150);
    }

    #drawScore() {
        context.font = "400 40px Xim-Sans";
        const text = `SCORE ${this.#score}`;
        const width = context.measureText(text).width;
        context.fillText(text, (canvas.width - width) / 2, 200);
    }

    #drawComment() {
        context.font = "400 40px Xim-Sans";
        let text = "";
        if (level <= 5) {
            text = "はぁ～つっかえ";
        }
        else if (level <= 10) {
            text = "へなちょこ";
        }
        else if (level <= 20) {
            text = "もうちょっと力入れないとダメだね";
        }
        else if (level <= 30) {
            text = "ま、多少はね？";
        }
        else if (level === 36) {
            text = "36…普通だな！";
        }
        else if (level <= 40) {
            text = "なんか足んねえよなぁ？";
        }
        else if (level <= 49) {
            text = "お～ええやん";
        }
        else /*if (level >= 50)*/ {
            text = "やりますねえ！";
        }
        const width = context.measureText(text).width;
        context.fillText(text, (canvas.width - width) / 2, 280);
    }

    onClick(e) {
        if (!this.#canClick) {
            return;
        }
        // todo 仮
        SceneManager.start(new TitleScene(), false);
    }
}
