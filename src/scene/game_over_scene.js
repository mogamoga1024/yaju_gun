
class GameOverScene extends Scene {
    #levelText = "";
    #score = 0; 
    #comment = "";
    #canClick = false;
    #gotoTitleBtn = null;
    #tweetBtn = null;

    constructor(score) {
        super();
        this.#score = score;
    }

    onStart() {
        console.log("GameOverScene:onStart");

        const maxLevel = 50;
        this.#levelText = "Lv.";
        if (level < maxLevel) {
            this.#levelText += String(level);
        }
        else if (level === maxLevel) {
            this.#levelText += "MAX";
        }
        else {
            this.#levelText += `MAX+${level - maxLevel}`;
        }

        if (level <= 5) {
            this.#comment = "は？";
        }
        else if (level <= 10) {
            this.#comment = "へなちょこ";
        }
        else if (level <= 20) {
            this.#comment = "もうちょっと力入れないとダメだね";
        }
        else if (level <= 30) {
            this.#comment = "ま、多少はね？";
        }
        else if (level === 36) {
            this.#comment = "36…普通だな！";
        }
        else if (level <= 40) {
            this.#comment = "なんか足んねぇよなぁ？";
        }
        else if (level <= 49) {
            this.#comment = "いいゾ～これ";
        }
        else /*if (level >= 50)*/ {
            this.#comment = "やりますねえ！";
        }

        this.#gotoTitleBtn = new GotoTitleButton();
        this.#tweetBtn = new TweetButton();

        this.state = "loaded";
        this.#update();
        setTimeout(() => {
            // すぐにタイトル画面に戻ってほしくないため
            this.#canClick = true;
        }, 500);
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgb(255, 128, 170)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.textAlign = "start";
        context.textBaseline = "top";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.strokeStyle = "rgb(255, 0, 128)";

        const btp = SoundStorage.get("ブッチッパ！");
        if (btp.isOK) {
            let shouldAnimation = true;
            btp.on("playerror", () => {
                btp.off("playerror");
                shouldAnimation = false;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "rgb(255, 128, 170)";
                context.fillRect(0, 0, canvas.width, canvas.height);
                this.#drawTitle();
                this.#drawLevel();
                this.#drawScore();
                this.#drawComment();
                this.#gotoTitleBtn.draw();
                this.#tweetBtn.draw();
            });
            let drawCount = 0;
            playSound(btp);
            const anime = () => {
                if (shouldAnimation) {
                    const seek = btp.seek();
                    if (drawCount === 0 && seek > 0.1) {
                        drawCount += 1;
                        this.#drawTitle();
                    }
                    else if (drawCount === 1 && seek > 0.3) {
                        drawCount += 1;
                        this.#drawLevel();
                        this.#drawScore();
                        this.#gotoTitleBtn.draw();
                        this.#tweetBtn.draw();
                    }
                    else if (drawCount === 2 && seek > 0.5) {
                        this.#drawComment();
                        btp.off("playerror");
                        shouldAnimation = false;
                    }
                    requestAnimationFrame(anime);
                }
            };
            anime();
        }
        else {
            this.#drawTitle();
            this.#drawLevel();
            this.#drawScore();
            this.#drawComment();
            this.#gotoTitleBtn.draw();
            this.#tweetBtn.draw();
        }
    }

    #drawTitle() {
        context.lineWidth = 12;
        context.font = "400 80px 'Noto Sans JP'";
        const text = "リザルト";
        const width = context.measureText(text).width;
        drawStrokeText(context, text, (canvas.width - width) / 2, 30);
    }

    #drawLevel() {
        context.lineWidth = 5;
        context.font = "400 50px Xim-Sans";
        const width = context.measureText(this.#levelText).width;
        drawStrokeText(context, this.#levelText, (canvas.width - width) / 2, 140);
    }

    #drawScore() {
        context.lineWidth = 5;
        context.font = "400 50px Xim-Sans";
        const text = `SCORE ${this.#score}`;
        const width = context.measureText(text).width;
        drawStrokeText(context, text, (canvas.width - width) / 2, 195);
    }

    #drawComment() {
        context.lineWidth = 5;
        context.font = "400 60px Xim-Sans";
        const width = context.measureText(this.#comment).width;
        drawStrokeText(context, this.#comment, (canvas.width - width) / 2, 270);
    }

    onClick(e) {
        if (!this.#canClick) {
            return;
        }

        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.canvasXY(e.offsetX, e.offsetY, rect);

        if (this.#gotoTitleBtn.isTargeted(x, y)) {
            SceneManager.start(new TitleScene(), false);
        }
        else if (this.#tweetBtn.isTargeted(x, y)) {
            const link = document.createElement("a");
            const text = `${this.#levelText}\nSCORE：${this.#score}\n総評：${this.#comment}`;
            const hashtags = "やじゅがん,野獣先輩,ぎゃるがん3あくしろよ";
            link.href = `https://twitter.com/intent/tweet?url=https://mogamoga1024.github.io/yaju_gun/&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.click();
        }
    }
}
