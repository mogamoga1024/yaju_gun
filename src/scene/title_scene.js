
class TitleScene extends Scene {
    #backgroundImage = null;
    #canClick = false;

    #canContinue = false;
    #startPoint = "new"; // new or continue
    #difficulty = "normal";

    #hajimeBtn = null;
    #tudukiBtn = null;
    #easyBtn = null;
    #normalBtn = null;
    #hardBtn = null;
    #startBtn = null;

    #prevLevel = 1;
    #prevHp = undefined;
    #prevScore = 0;

    constructor(canClick = false) {
        super();
        this.#canClick = canClick;
    }

    async onStart() {
        console.log("TitleScene:onStart");
        this.#backgroundImage = await loadImage("asset/やじゅがん.png");

        const strDifficulty = Cookies.get("difficulty");
        if (strDifficulty !== undefined) {
            this.#difficulty = strDifficulty;
        }

        const strHp = Cookies.get("hp");
        const strLevel = Cookies.get("level");
        const strScore = Cookies.get("score");
        if (strLevel !== undefined && strHp !== undefined && strScore !== undefined) {
            const hp = Number(strHp);
            const score = Number(strScore);
            if (hp > 0 && score > 0) {
                this.#canContinue = true;
                this.#startPoint = "continue";
                this.#prevLevel = Number(strLevel);
                this.#prevHp = hp;
                this.#prevScore = score;
            }
        }
        
        this.#hajimeBtn = new HajimeButton();
        this.#tudukiBtn = new TudukiButton(this.#canContinue);
        this.#easyBtn = new EasyButton();
        this.#normalBtn = new NormalButton();
        this.#hardBtn = new HardButton();
        this.#startBtn = new StartButton();

        this.state = "loaded";
        this.#update();
        if (!this.#canClick) setTimeout(() => {
            // ゲームオーバー画面から戻ってきたときに連打しているとすぐ開始してしまうため
            this.#canClick = true;
        }, 500);
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.globalAlpha = 0.8;
        drawBackgroundImage(this.#backgroundImage);
        context.globalAlpha = 1;

        this.#drawTitle();
        this.#drawHighScore();

        this.#drawStartPointBtn();
        this.#drawDifficultyBtn();
        this.#startBtn.draw();
    }
    
    onClick(e) {
        if (!this.#canClick) {
            return;
        }

        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.canvasXY(e.offsetX, e.offsetY, rect);

        if (this.#hajimeBtn.isTargeted(x, y)) {
            this.#startPoint = "new";
            this.#drawStartPointBtn();
        }
        else if (this.#tudukiBtn.isTargeted(x, y)) {
            this.#startPoint = "continue";
            this.#drawStartPointBtn();
        }
        else if (this.#easyBtn.isTargeted(x, y)) {
            this.#difficulty = "easy";
            this.#drawDifficultyBtn();
        }
        else if (this.#normalBtn.isTargeted(x, y)) {
            this.#difficulty = "normal";
            this.#drawDifficultyBtn();
        }
        else if (this.#hardBtn.isTargeted(x, y)) {
            this.#difficulty = "hard";
            this.#drawDifficultyBtn();
        }
        else if (this.#startBtn.isTargeted(x, y)) {
            this.#canClick = false;
            if (Howler.ctx !== null && (Howler.ctx.state === "suspended" || Howler.ctx.state === "interrupted")) {
                Howler.ctx.resume().then(() => {
                    this.#start();
                });
            }
            else {
                this.#start();
            }
        }
    }

    #start() {
        if (this.#startPoint === "new") {
            level = 1;
            SceneManager.start(new GameplayScene(!isPC));
        }
        else /*if (this.#startPoint = "continue")*/ {
            level = this.#prevLevel;
            SceneManager.start(new GameplayScene(!isPC, this.#prevHp, this.#prevScore));
        }
    }

    #drawTitle() {
        context.save();
    
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.lineWidth = 12;
        const baseY = 140;
    
        // 各パートとフォント設定
        const parts = [
            {
                text: "やじゅ",
                fonts: ["900 150px 'Noto Sans JP'", "900 120px 'Noto Sans JP'"],
                colors: ["#ff69b4", "#ffb6c1"]
            },
            {
                text: "がん",
                fonts: ["900 120px 'Noto Sans JP'", "900 150px 'Noto Sans JP'"],
                colors: ["#87cefa", "#00ced1"]
            }
        ];
    
        // 幅測定
        let totalWidth = 0;
        const partWidths = parts.map(part => {
            let width = 0;
            for (let i = 0; i < part.text.length; i++) {
                context.font = part.fonts[i];
                width += context.measureText(part.text[i]).width;
            }
            totalWidth += width;
            return width;
        });
    
        const startX = (canvas.width - totalWidth) / 2;
    
        // 描画関数
        function drawPart(ctx, text, fonts, grad, x, y) {
            let currentX = x;
            for (let i = 0; i < text.length; i++) {
                ctx.font = fonts[i];
                const char = text[i];
                const width = ctx.measureText(char).width;
                ctx.fillStyle = grad;
                ctx.strokeStyle = "#8b008b";
                ctx.strokeText(char, currentX, y);
                ctx.fillText(char, currentX, y);
                currentX += width;
            }
        }
    
        // 実際の描画
        let currentX = startX;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const partWidth = partWidths[i];
            const grad = context.createLinearGradient(currentX, 0, currentX + partWidth, 0);
            grad.addColorStop(0, part.colors[0]);
            grad.addColorStop(1, part.colors[1]);
            drawPart(context, part.text, part.fonts, grad, currentX, baseY);
            currentX += partWidth;
        }
    
        context.restore();
    }

    #drawHighScore() {
        let highScore = 0;
        const strHighScore = Cookies.get("high_score");
        if (strHighScore !== undefined) {
            highScore = Number(strHighScore);
        }

        context.textAlign = "start";
        context.textBaseline = "top";
        context.lineJoin = "round";
        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;

        const text = String(`HIGT SCORE ${highScore}`);
        const measure = context.measureText(text);
        drawStrokeText(context, text, canvas.width - measure.width - 20, 20);
    }

    #drawStartPointBtn() {
        this.#hajimeBtn.draw(this.#startPoint === "new");
        this.#tudukiBtn.draw(this.#startPoint === "continue");
    }

    #drawDifficultyBtn() {
        this.#easyBtn.draw(this.#difficulty === "easy");
        this.#normalBtn.draw(this.#difficulty === "normal");
        this.#hardBtn.draw(this.#difficulty === "hard");
    }
}
