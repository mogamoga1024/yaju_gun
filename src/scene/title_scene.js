
class TitleScene extends Scene {
    #backgroundImage = null;

    async onStart() {
        console.log("TitleScene:onStart");
        this.#backgroundImage = await loadImage("asset/やじゅがん.png");
        this.state = "loaded";
        this.#update();
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.globalAlpha = 0.8;
        drawBackgroundImage(this.#backgroundImage);
        context.globalAlpha = 1;

        context.textAlign = "start";
        context.textBaseline = "top";
        context.lineJoin = "round";

        this.#drawTitle();

        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;

        {
            const text = `${isPC ? "Click" : "Tap"} To Start`;
            const width = context.measureText(text).width;
            drawStrokeText(context, text, (canvas.width - width)  / 2, 300);
        }
    }
    
    onClick(e) {
        SceneManager.start(new GameplayScene(!isPC));
    }

    #drawTitle() {
        context.save();
    
        context.textBaseline = "middle";
        context.lineWidth = 12;
        const baseY = 180;
    
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
}
