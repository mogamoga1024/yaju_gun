
class GameOverScene extends Scene {
    #maxLevel = 50;
    #backgroundImage = null;
    #levelText = "";
    #score = 0; 
    #comment = "";
    #canClick = false;
    #gotoTitleBtn = null;
    #tweetBtn = null;
    #hasPlayedComment = false;
    #goodEndTimer = -1;
    #shouldAnimation = false;

    constructor(score) {
        super();
        this.#score = score;
    }

    async onStart() {
        console.log("GameOverScene:onStart");

        Cookies.remove("level", {path: COOKIE_PATH});
        Cookies.remove("next_exp", {path: COOKIE_PATH});
        Cookies.remove("score", {path: COOKIE_PATH});
        Cookies.remove("hp", {path: COOKIE_PATH});
        Cookies.remove("mdkr", {path: COOKIE_PATH});

        if (level >= this.#maxLevel) {
            this.#backgroundImage = await loadImage("asset/good.png");
        }

        this.#levelText = "Lv.";
        if (level < this.#maxLevel) {
            this.#levelText += String(level);
        }
        else if (level === this.#maxLevel) {
            this.#levelText += "MAX";
        }
        else {
            this.#levelText += `MAX+${level - this.#maxLevel}`;
        }

        if (this.#score < 0) {
            this.#comment = "人間の屑がこの野郎";
        }
        else if (level <= 5) {
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
            this.#comment = "やりますねぇ！";
        }

        this.#gotoTitleBtn = new GotoTitleButton();
        this.#tweetBtn = new TweetButton();

        this.state = "loaded";
        this.#update();
    }

    onEnd() {
        Howler.stop();
        this.#shouldAnimation = false;
        clearInterval(this.#goodEndTimer);
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgb(255, 128, 170)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (level >= this.#maxLevel) {
            const bgm = SoundStorage.get("あの頃の夏の思い出神社");
            if (bgm.isOK) {
                const startTime = 38.6;
                const endTime = 50;
                bgm.volume(0);
                bgm.seek(startTime);
                bgm.fade(0, bgm.defaultVolume, (endTime - startTime) * 1000);
                const id = bgm.play();
                this.#shouldAnimation = true;
                bgm.on("playerror", () => {
                    this.#drawGoodEnd();
                    bgm.off("playerror", id);
                    this.#shouldAnimation = false;
                }, id);
                const anime = () => {
                    if (this.#shouldAnimation) {
                        const seek = bgm.seek();
                        if (seek > endTime) {
                            this.#drawGoodEnd();
                            bgm.off("playerror", id);
                            this.#shouldAnimation = false;
                        }
                        requestAnimationFrame(anime);
                    }
                };
                anime();
            }
            else {
                this.#drawGoodEnd();
            }
        }
        else {
            const btp = SoundStorage.get("ブッチッパ！");
            if (btp.isOK) {
                const id = btp.play();
                this.#shouldAnimation = true;
                btp.on("playerror", () => {
                    this.#shouldAnimation = false;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = "rgb(255, 128, 170)";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    this.#drawTitle();
                    this.#drawLevel();
                    this.#drawScore();
                    this.#drawComment();
                    this.#gotoTitleBtn.draw();
                    this.#tweetBtn.draw();
                    btp.off("playerror", id);
                }, id);
                let drawCount = 0;
                const anime = () => {
                    if (this.#shouldAnimation) {
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
                            btp.off("playerror", id);
                            this.#shouldAnimation = false;
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
    }

    #drawGoodEnd() {
        clearInterval(this.#goodEndTimer);
        this.#goodEndTimer = setInterval(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBackgroundImage(this.#backgroundImage);
            this.#drawTitle();
            this.#drawLevel();
            this.#drawScore();
            this.#drawComment();
            this.#gotoTitleBtn.draw();
            this.#tweetBtn.draw();
            drawConfetti();
        }, 1000 / FPS);
    }

    #drawTitle() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.strokeStyle = "rgb(255, 0, 128)";
        context.lineWidth = 12;
        context.font = "400 80px 'Noto Sans JP'";
        const text = "リザルト";
        const width = context.measureText(text).width;
        drawStrokeText(context, text, (canvas.width - width) / 2, 65);
        context.restore();
    }

    #drawLevel() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.strokeStyle = "rgb(255, 0, 128)";
        context.lineWidth = 5;
        context.font = "400 50px 'Noto Sans JP'";
        const width = context.measureText(this.#levelText).width;
        drawStrokeText(context, this.#levelText, (canvas.width - width) / 2, 165);
        context.restore();
    }

    #drawScore() {
        context.save();
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.strokeStyle = "rgb(255, 0, 128)";
        context.lineWidth = 5;
        context.font = "400 50px 'Noto Sans JP'";
        const text = `SCORE ${this.#score}`;
        const width = context.measureText(text).width;
        drawStrokeText(context, text, (canvas.width - width) / 2, 220);
        context.restore();
    }

    #drawComment() {
        context.save();
        this.#canClick = true;

        if (!this.#hasPlayedComment) {
            this.#hasPlayedComment = true;
            SoundStorage.get(this.#comment).play();
        }

        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.fillStyle = "#fff";
        context.strokeStyle = "rgb(255, 0, 128)";
        context.lineWidth = 5;
        context.font = "400 60px 'Noto Sans JP'";
        const width = context.measureText(this.#comment).width;
        drawStrokeText(context, this.#comment, (canvas.width - width) / 2, 300);
        context.restore();
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
            const text = `やじゅがん（${difficultyName()}）\n${this.#levelText}\nSCORE：${this.#score}\n評価：${this.#comment}`;
            const hashtags = "やじゅがん,野獣先輩,ぎゃるがん3あくしろよ";
            link.href = `https://twitter.com/intent/tweet?url=https://mogamoga1024.github.io/yaju_gun/&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.click();
        }
    }
}
