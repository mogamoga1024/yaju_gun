
class TitleScene extends Scene {
    #backgroundImage = null;
    #canClick = false;

    #canContinue = false;
    #startPoint = "new"; // new or continue

    #hajimeBtn = null;
    #tudukiBtn = null;
    #easyBtn = null;
    #normalBtn = null;
    #hardBtn = null;
    #startBtn = null;

    #prevLevel = 1;
    #prevNextExp = undefined;
    #prevHp = undefined;
    #prevMdkr = undefined;
    #prevScore = 0;

    #defaultDifficulty = "";

    constructor(canClick = false) {
        super();
        this.#canClick = canClick;
    }

    async onStart() {
        console.log("TitleScene:onStart");
        this.#backgroundImage = await loadImage("asset/やじゅがん.png");

        const strDifficulty = Cookies.get("difficulty");
        if (strDifficulty !== undefined) {
            difficulty = strDifficulty;
        }
        this.#defaultDifficulty = difficulty;

        const strHp = Cookies.get("hp");
        const strMdkr = Cookies.get("mdkr");
        const strLevel = Cookies.get("level");
        const strNextExp = Cookies.get("next_exp");
        const strScore = Cookies.get("score");
        if (strLevel !== undefined && strNextExp !== undefined && strHp !== undefined && strMdkr !== undefined && strScore !== undefined) {
            const prevLevel = Number(strLevel);
            const prevNextExp = Number(strNextExp);
            const prevHp = Number(strHp);
            const prevMdkr = Number(strMdkr);
            const prevScore = Number(strScore);
            if (prevHp > 0 && prevScore > 0) {
                this.#canContinue = true;
                this.#startPoint = "continue";
                this.#prevLevel = prevLevel;
                this.#prevNextExp = prevNextExp;
                this.#prevHp = prevHp;
                this.#prevMdkr = prevMdkr;
                this.#prevScore = prevScore;
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

        const isNew = this.#startPoint === "new";

        this.#hajimeBtn.draw(isNew);
        this.#tudukiBtn.draw(!isNew);

        const d = difficulty;
        this.#easyBtn.active(isNew || d === "easy");
        this.#normalBtn.active(isNew || d === "normal");
        this.#hardBtn.active(isNew || d === "hard");

        this.#easyBtn.draw(d === "easy");
        this.#normalBtn.draw(d === "normal");
        this.#hardBtn.draw(d === "hard");
        
        this.#startBtn.draw();
    }

    onClick(e) {
        if (!isPC) {
            return;
        }
        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.canvasXY(e.offsetX, e.offsetY, rect);
        this.#onClick(x, y);
    }

    onTouchEnd(e) {
        const rect = e.target.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        const {x, y} = this.canvasXY(offsetX, offsetY, rect);
        this.#onClick(x, y);
    }
    
    #onClick(x, y) {
        if (!this.#canClick) {
            return;
        }

        if (this.#hajimeBtn.isTargeted(x, y)) {
            this.#startPoint = "new";
            this.#update();
        }
        else if (this.#tudukiBtn.isTargeted(x, y)) {
            this.#startPoint = "continue";
            difficulty = this.#defaultDifficulty;
            this.#update();
        }
        else if (this.#easyBtn.isTargeted(x, y)) {
            difficulty = "easy";
            this.#update();
        }
        else if (this.#normalBtn.isTargeted(x, y)) {
            difficulty = "normal";
            this.#update();
        }
        else if (this.#hardBtn.isTargeted(x, y)) {
            difficulty = "hard";
            this.#update();
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
            SceneManager.start(new GameplayScene());
        }
        else /*if (this.#startPoint = "continue")*/ {
            level = this.#prevLevel;
            SceneManager.start(new GameplayScene(this.#prevHp, this.#prevMdkr, this.#prevScore, this.#prevNextExp));
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
        const strHighScore = Cookies.get(`${difficulty}_high_score`);
        if (strHighScore !== undefined) {
            highScore = Number(strHighScore);
        }

        context.textAlign = "start";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.font = "400 40px 'Noto Sans JP'";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;

        const text = String(`HIGT SCORE ${highScore}`);
        const measure = context.measureText(text);
        drawStrokeText(context, text, canvas.width - measure.width - 20, 40);
    }
}
