
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

        context.font = "400 120px Xim-Sans";
        context.fillStyle = "#ffb6c1";
        context.strokeStyle = "#8b008b";
        context.lineWidth = 12;

        {
            const text = "やじゅ♡がん";
            const width = context.measureText(text).width;
            drawStrokeText(context, text, (canvas.width - width)  / 2, 114);
        }

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
        // todo
        SceneManager.start(new GameplayScene(!isPC));
        // if (!isPC) {
        //     if (typeof DeviceOrientationEvent.requestPermission === "function") {
        //         DeviceOrientationEvent.requestPermission()
        //             .then(permissionState => {
        //                 if (permissionState === "granted") {
        //                     // ジャイロ操作をする
        //                     SceneManager.start(new GameplayScene(false));
        //                 }
        //                 else {
        //                     // ジャイロ操作をしない
        //                     SceneManager.start(new GameplayScene(true));
        //                 }
        //             })
        //             .catch(error => {
        //                 SceneManager.start(new GameplayScene(true));
        //             });
        //     } else {
        //         SceneManager.start(new GameplayScene(true));
        //     }
        // }
        // else {
        //     SceneManager.start(new GameplayScene(false));
        // }
    }
}
