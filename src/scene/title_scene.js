
class TitleScene extends Scene {
    #backgroundImage = null;
    #canClick = false;

    #startPoint = "new"; // new or continue
    #difficulty = "normal"; // easy or normal or hard

    #hajimeBtn = null;
    #tudukiBtn = null;
    #easyBtn = null;
    #normalBtn = null;
    #hardBtn = null;
    #startBtn = null;

    constructor(canClick = false) {
        super();
        this.#canClick = canClick;
    }

    async onStart() {
        console.log("TitleScene:onStart");
        this.#backgroundImage = await loadImage("asset/やじゅがん.png");

        this.#hajimeBtn = new HajimeButton();
        this.#tudukiBtn = new TudukiButton();
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

        this.#hajimeBtn.draw(true);
        this.#tudukiBtn.draw();
        this.#easyBtn.draw();
        this.#normalBtn.draw(true);
        this.#hardBtn.draw();
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
            this.#hajimeBtn.draw(true);
            this.#tudukiBtn.draw();
        }
        else if (this.#tudukiBtn.isTargeted(x, y)) {
            this.#startPoint = "continue";
            this.#hajimeBtn.draw();
            this.#tudukiBtn.draw(true);
        }
        else if (this.#easyBtn.isTargeted(x, y)) {
            this.#difficulty = "easy";
            this.#easyBtn.draw(true);
            this.#normalBtn.draw();
            this.#hardBtn.draw();
        }
        else if (this.#normalBtn.isTargeted(x, y)) {
            this.#difficulty = "normal";
            this.#easyBtn.draw();
            this.#normalBtn.draw(true);
            this.#hardBtn.draw();
        }
        else if (this.#hardBtn.isTargeted(x, y)) {
            this.#difficulty = "hard";
            this.#easyBtn.draw();
            this.#normalBtn.draw();
            this.#hardBtn.draw(true);
        }
        else if (this.#startBtn.isTargeted(x, y)) {
            // todo はーい、よーいスタート
            SceneManager.start(new GameplayScene(!isPC));
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
}
