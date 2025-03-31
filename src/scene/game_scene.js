
class GameScene extends Scene {
    #backgroundImage = null;
    #bgm = null;

    async onStart() {
        console.log("GameScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        await this.#preload();

        this.#bgm = await loadSound("PLUMBER");
        playSound(this.#bgm);

        this.#update();
    }

    #update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // todo
    }

    async #preload() {
        const promiseList = [];
        const plpiss = (name) => {
            promiseList.push((async () => ImageStorage.set(name, await loadImage(`asset/${name}.png`)))());
        };
        const plls = (name) => {
            promiseList.push((async () => await loadSound(name))());
        };

        // 画像
        for (let i = 0; i <= 12; i++) {
            plpiss(`走る野獣先輩/${i}`);
        }
        for (let i = 0; i <= 5; i++) {
            plpiss(`くねくね先輩/${i}`);
        }
        plpiss("照準1");
        plpiss("照準2");
        plpiss("爆発スプライト_170");
        
        // 音声 プリロード
        // ※ Howler.jsにキャッシュさせておきたい
        for (const name of ["ドンッ", "大破", "爆発", "息継ぎ", "アイスティー"]) {
            plls(name);
        }

        await Promise.all(promiseList);
    }

    onKeyDown(e) {
        // todo
    }

    onKeyUp(e) {
        // todo
    }
    
    onClick(e) {
        // todo
    }
}
