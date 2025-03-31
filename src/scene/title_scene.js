
class TitleScene extends Scene {
    #backgroundImage = null;

    async onStart() {
        console.log("TitleScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        this.#update();
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.globalAlpha = 0.8;
        drawBackgroundImage(this.#backgroundImage);
        context.globalAlpha = 1;

        context.textBaseline = "top";

        context.font = "900 80px sans-serif";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 8;

        {
            const text = "やじゅ♡がん";
            const width = context.measureText(text).width;
            drawStrokeText(context, text, (canvas.width - width)  / 2, 114);
        }

        context.font = "900 40px sans-serif";
        context.lineWidth = 5;

        {
            const text = `${isPC ? "click" : "tap"} to Start`;
            const width = context.measureText(text).width;
            drawStrokeText(context, text, (canvas.width - width)  / 2, 300);
        }
    }
    
    onClick(e) {
        SceneManager.start(new GameScene());
    }
}
