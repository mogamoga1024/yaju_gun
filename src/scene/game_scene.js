
class GameScene extends Scene {
    static #isFirst = true;
    #backgroundImage = null;
    #gunshotSound = null;

    #enemyList = [];
    #kotodamaList = [];

    #player = new Player();

    // 範囲：[0, 360)
    // 0で真正面 90で左 180で後ろ 270で右
    #viewAngle = 0;

    #shotPosList = [];

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
    #useNipple = false;
    #nipple = null;
    #nippleDx = 0;
    #touchXMap = new Map();

    #shouldAnimation = true;
    #enemyCreateFrame = 0;
    #honsyaCreateFrame = 0;

    constructor(useNipple) {
        super();
        this.#useNipple = useNipple;
    }

    async onStart() {
        console.log("GameScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        await this.#preload();

        const bgmNameList = [
            "PLUMBER",
            "中華淫行",
            "snow prizm (Ketsupine mix)",
        ];
        let bgli = 0;

        (function playBGM() {
            loadSound(bgmNameList[bgli]).then(bgm => {
                const playNextBGM = () => {
                    bgli = (bgli + 1) % bgmNameList.length;
                    bgm.unload();
                    playBGM();
                };
                if (bgm.isOK) {
                    playSound(bgm);
                    bgm.on("end", playNextBGM);
                    bgm.on("playerror", playNextBGM);
                }
                else {
                    playNextBGM();
                }
            });
        })();

        this.#gunshotSound = SoundStorage.get("銃声");

        // debug start
        // 0 <= centerX < canvas.width * 2
        // this.#enemyList.push(new MeteorSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new MukimukiSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new ShoutingSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new Honsya(this.#viewAngle));
        // debug end

        if (this.#useNipple) {
            this.#nipple = nipplejs.create({
                zone: domGameCanvasWrapper,
                color: "#f00",
                lockX: true,
                fadeTime: 0,
                dataOnly: true,
            });

            this.#nipple.on("end", (e, data) => {
                this.#nippleDx = 0;
            });
            this.#nipple.on("move", (e, data) => {
                this.#nippleDx = data.vector.x * -6;
                while (this.#nippleDx < 0) {
                    this.#nippleDx += 360;
                }
            });
        }

        this.state = "loaded";
        this.#startAnimation();
    }

    onEnd() {
        this.#shouldAnimation = false;
        this.#nipple?.destroy();
    }

    #startAnimation() {
        let prevTime = -1;
        const deltaTime = 1 / 60;
        const anime = (time) => {
            if (this.#shouldAnimation) {
                if (prevTime === -1 || time - prevTime >= deltaTime * 1000 * 0.9) {
                    prevTime = time;
                    this.#update();
                }
                requestAnimationFrame(anime);
            }
        };
        anime(performance.now());
    }

    #update() {
        if (this.#enemyList.length < 6) {
            this.#enemyCreateFrame++;
        }
        this.#honsyaCreateFrame++;

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
        else if (this.#useNipple) {
            this.#viewAngle = (this.#viewAngle + this.#nippleDx) % 360;
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
        if (this.#shotPosList.length > 0) {
            playSound(this.#gunshotSound);
            for (const {x, y} of this.#shotPosList) {
                addSparks(x, y);
            }
        }

        // 敵の状態の更新と被弾
        this.#sortedEntityList("desc").forEach(entity => {
            if (this.#shotPosList.length > 0) {
                for (let i = this.#shotPosList.length - 1; i >= 0; i--) {
                    const {x, y} = this.#shotPosList[i];
                    if (entity.isTargeted(x, y)) {
                        entity.takeDamage();
                        this.#shotPosList.splice(i, 1);
                    }
                }
            }
            entity.update(this.#viewAngle);
        });
        for (let i = this.#enemyList.length - 1; i >= 0; i--) {
            const enemy = this.#enemyList[i];
            if (enemy.state === "dead" || enemy.state === "disappear") {
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
        if (this.#enemyCreateFrame >= 60 * 1.5) {
            const centerX = Math.random() * (canvas.width * 2);
            const random = Math.random();
            if (random < 0.1) {
                this.#enemyList.push(new MukimukiSenpai(centerX, this.#viewAngle));
            }
            else if (random < 0.4) {
                this.#enemyList.push(new RunningSenpai(centerX, this.#viewAngle));
            }
            else if (random < 0.6) {
                this.#enemyList.push(new MeteorSenpai(centerX, this.#viewAngle));
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

        // 本社生成
        if (this.#honsyaCreateFrame >= 60 * 60) {
            if (Math.random() < 0.5) {
                this.#enemyList.push(new Honsya(this.#viewAngle));
                this.#honsyaCreateFrame = 0;
            }
            else {
                this.#honsyaCreateFrame = 60 * 30;
            }
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
        this.#shotPosList = [];
    }

    async #preload() {
        if (!GameScene.#isFirst) {
            return;
        }
        GameScene.#isFirst = false;

        const promiseList = [];
        const plpiss = (name) => {
            promiseList.push((async () => ImageStorage.set(name, await loadImage(`asset/${name}.png`)))());
        };
        const plpsss = (name) => {
            promiseList.push((async () => SoundStorage.set(name, await loadSound(name)))());
        };

        // 画像
        for (let i = 0; i <= 12; i++) {
            plpiss(`走る野獣先輩/${i}`);
        }
        for (let i = 0; i <= 6; i++) {
            plpiss(`ムキムキ先輩/${i}`);
        }
        for (let i = 0; i <= 11; i++) {
            plpiss(`タオル先輩/${i}`);
        }
        for (let i = 0; i <= 5; i++) {
            plpiss(`くねくね先輩/${i}`);
        }
        plpiss("本社");
        plpiss("照準1");
        plpiss("照準2");
        plpiss("爆発スプライト_170");
        
        // 音声
        plpsss("銃声");
        plpsss("ドンッ");
        plpsss("大破");
        plpsss("爆発");
        plpsss("息継ぎ");
        plpsss("ムキムキ息継ぎ");
        plpsss("ンアッー！（ねっとり）");
        plpsss("アイスティー");
        plpsss("ムキムキオォン！");
        plpsss("謎の金属音");
        plpsss("FOO↑気持ちいい～");
        plpsss("アアッー！(高音)");

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
    
    onDeviceOrientation(e) {
        this.#viewAngle = e.alpha;
    }

    onClick(e) {
        if (!isPC) {
            return;
        }
        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.#canvasXY(e.offsetX, e.offsetY, rect);
        if (this.#shotPosList.length === 0) {
            this.#shotPosList.push({x, y});
        }
    }

    onTouchStart(e) {
        for (const touch of e.changedTouches) {
            this.#touchXMap.set(touch.identifier, touch.clientX);
        }
    }

    onTouchEnd(e) {
        const rect = e.target.getBoundingClientRect();
        for (const touch of e.changedTouches) {
            const startX = this.#touchXMap.get(touch.identifier);
            this.#touchXMap.delete(touch.identifier);
            if (touch.clientX !== startX) {
                continue;
            }
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            const {x, y} = this.#canvasXY(offsetX, offsetY, rect);
            this.#shotPosList.push({x, y});
        }
    }

    onTouchCancel(e) {
        for (const touch of e.changedTouches) {
            this.#touchXMap.delete(touch.identifier);
        }
    }

    onMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.#canvasXY(e.offsetX, e.offsetY, rect);
        this.#pc.mouseX = x;
        this.#pc.mouseY = y;
    }

    #canvasXY(offsetX, offsetY, rect) {
        return {
            x: offsetX * canvas.width / rect.width,
            y: offsetY * canvas.height / rect.height
        };
    }
}
