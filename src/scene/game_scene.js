
class GameScene extends Scene {
    #backgroundImage = null;
    #bgm = null;
    #gunshotSound = null;

    #enemyList = [];
    #kotodamaList = [];

    #player = new Player();

    // 範囲：[0, 360)
    // 0で真正面 90で左 180で後ろ 270で右
    #viewAngle = 0;

    #hasShot = false;

    #pc = {
        isPressed: {
            "left": false,
            "right": false,
            "turn": false,
        },
        canTurn: true,
        mouseX: canvas.width / 2,
        mouseY: canvas.height / 2,
    };

    #enemyCreateFrame = 0;

    async onStart() {
        console.log("GameScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        await this.#preload();

        this.#bgm = await loadSound("PLUMBER");
        playSound(this.#bgm);

        this.#gunshotSound = await loadSound("銃声");

        // debug start
        // 0 <= centerX < canvas.width * 2
        // this.#enemyList.push(new RunningSenpai(0, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width * 3 / 2, this.#viewAngle));
        // this.#enemyList.push(new ShoutingSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new ShoutingSenpai(canvas.width * 3 / 2, this.#viewAngle));
        // debug end

        this.#update();
    }

    #update() {
        const update = () => {
            if (this.#enemyList.length < 5) {
                this.#enemyCreateFrame++;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);

            // PCでのキーイベントの捕捉
            if (isPC) {
                const speed = 4;
                if (this.#pc.isPressed.left) {
                    this.#viewAngle = (this.#viewAngle + speed) % 360;
                }
                if (this.#pc.isPressed.right) {
                    this.#viewAngle = (this.#viewAngle + (360 - speed)) % 360;
                }
                if (this.#pc.isPressed.turn && this.#pc.canTurn) {
                    this.#pc.canTurn = false;
                    this.#viewAngle = (this.#viewAngle + 180) % 360;
                }
            }

            // 奥側から描画
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBackgroundImage(this.#backgroundImage, this.#viewAngle);
            let willHit = false;
            this.#sortedEntityList().forEach(entity => {
                if (isPC && !willHit && entity.isTargeted(this.#pc.mouseX, this.#pc.mouseY)) {
                    willHit = true;
                }
                entity.draw();
            });

            if (isPC) {
                this.#player.drawCrosshair(this.#pc.mouseX, this.#pc.mouseY, willHit);
            }

            drawSparks(context);

            // プレイヤーの攻撃
            if (this.#hasShot) {
                playSound(this.#gunshotSound);
                if (isPC) {
                    addSparks(this.#pc.mouseX, this.#pc.mouseY);
                }
            }

            // 敵の状態の更新と被弾
            let canDealDamage = true;
            this.#sortedEntityList("desc").forEach(entity => {
                if (this.#hasShot && canDealDamage && isPC && entity.isTargeted(this.#pc.mouseX, this.#pc.mouseY)) {
                    canDealDamage = false;
                    entity.takeDamage();
                }
                entity.update(this.#viewAngle);
            });
            for (let i = this.#enemyList.length - 1; i >= 0; i--) {
                const enemy = this.#enemyList[i];
                if (enemy.state === "dead") {
                    this.#enemyList.splice(i, 1);
                }
            }
            for (let i = this.#kotodamaList.length - 1; i >= 0; i--) {
                const kotodama = this.#kotodamaList[i];
                if (kotodama.state === "dead" || kotodama.shooter.state === "dying") {
                    this.#kotodamaList.splice(i, 1);
                }
            }

            // 敵の生成
            if (this.#enemyCreateFrame >= 60 * 2) {
                const centerX = Math.random() * (canvas.width * 2);
                if (Math.random() < 0.6) {
                    this.#enemyList.push(new RunningSenpai(centerX, this.#viewAngle));
                }
                else {
                    if (Math.random() < 0.5) {
                        this.#enemyList.push(new ShoutingSenpai(centerX, this.#viewAngle, "uneune"));
                    }
                    else {
                        this.#enemyList.push(new ShoutingSenpai(centerX, this.#viewAngle, "kurukuru"));
                    }
                }
                this.#enemyCreateFrame = 0;
            }
            
            // 敵の攻撃
            for (const enemy of this.#enemyList) {
                if (!(enemy instanceof ShoutingSenpai)) {
                    continue;
                }
                if (!enemy.canShout()) {
                    continue;
                }
                const kotodama = enemy.shout(this.#viewAngle);
                this.#kotodamaList.push(kotodama);
            }

            // プレイヤーの被弾
            for (let i = this.#kotodamaList.length - 1; i >= 0; i--) {
                const kotodama = this.#kotodamaList[i];
                if (kotodama.isHittingPlayer()) {
                    this.#kotodamaList.splice(i, 1);
                    this.#player.takeDamage();
                }
            }
            
            // 後処理
            this.#hasShot = false;

            requestAnimationFrame(update);
        }

        update();
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

    #sortedEntityList(sortOrder = "asc") {
        return this.#enemyList.concat(this.#kotodamaList).sort((a, b) => (a.temaeRate - b.temaeRate) * (sortOrder === "asc" ? 1 : -1));
    }

    onKeyDown(e) {
        if (!isPC) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
            case "a": case "A":
                this.#pc.isPressed.left = true;
                break;

            case "ArrowRight":
            case "d": case "D":
                this.#pc.isPressed.right = true;
                break;
            
            case "ArrowDown":
            case "s": case "S":
                this.#pc.isPressed.turn = true;
                break;
        }
    }

    onKeyUp(e) {
        if (!isPC) {
            return;
        }
        switch (e.key) {
            case "ArrowLeft":
            case "a": case "A":
                this.#pc.isPressed.left = false;
                break;

            case "ArrowRight":
            case "d": case "D":
                this.#pc.isPressed.right = false;
                break;
            
            case "ArrowDown":
            case "s": case "S":
                this.#pc.isPressed.turn = false;
                this.#pc.canTurn = true;
                break;
        }
    }
    
    onClick(e) {
        this.#hasShot = true;
        this.#pc.mouseX = e.offsetX;
        this.#pc.mouseY = e.offsetY;
    }

    onMouseMove(e) {
        this.#pc.mouseX = e.offsetX;
        this.#pc.mouseY = e.offsetY;
    }
}
