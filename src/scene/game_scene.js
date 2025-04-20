
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

    #nextExp = Number.MAX_SAFE_INTEGER;

    #turnLeftBtn = null;
    #turnRightBtn = null;
    #shouldWarnLeft = false;
    #shouldWarnRight = false;
    #canPlayYokomukunSound = true;

    #bgm = null;

    #message = {
        text: "",
        isTransient: true,
    };

    constructor(useNipple) {
        super();
        this.#useNipple = useNipple;
    }

    async onStart() {
        console.log("GameScene:onStart");
        this.#backgroundImage = await loadImage("asset/草原.png");
        await this.#preload();

        // Lv.10まではパラオナボーイを流し続ける
        loadSound(bgmNameList[0]).then(bgm => {
            if (bgm.isOK) {
                this.#bgm = bgm;
                playSound(bgm);
                for (const event of ["end", "playerror"]) {
                    bgm.on(event, () => {
                        if (level <= 10) {
                            playSound(bgm);
                        }
                        else {
                            bgm.unload();
                            this.#bgm = null;
                            playBGM();
                        }
                    });
                }
            }
            else {
                bgm.unload();
                playBGM();
            }
        });

        let bgli = 1;
        const playBGM = () => {
            loadSound(bgmNameList[bgli]).then(bgm => {
                const playNextBGM = () => {
                    bgli = (bgli + 1) % bgmNameList.length;
                    bgm.unload();
                    this.#bgm = null;
                    playBGM();
                };
                if (bgm.isOK) {
                    this.#bgm = bgm;
                    playSound(bgm);
                    bgm.on("end", playNextBGM);
                    bgm.on("playerror", playNextBGM);
                }
                else {
                    playNextBGM();
                }
            });
        };

        this.#gunshotSound = SoundStorage.get("銃声");

        // debug start
        // 0 <= centerX < canvas.width * 2
        // this.#enemyList.push(new MeteorSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new MukimukiSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new ShoutingSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new KunekuneSenpai(canvas.width / 2, this.#viewAngle));
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

        level = 1;
        this.#nextExp = this.#calcNextExp(level);

        this.#turnLeftBtn = new TurnLeftButton(10);
        this.#turnRightBtn = new TurnRightButton(10);

        MessageWindow.init(10, 10);

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
        if (debug.canCreateEnemy) {
            if (this.#enemyList.length < 6 * (1 + level / 100)) {
                this.#enemyCreateFrame++;
            }
            this.#honsyaCreateFrame++;
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
        else if (this.#useNipple) {
            this.#viewAngle = (this.#viewAngle + this.#nippleDx) % 360;
        }

        // ボタンが押されたときの処理
        for (const {x, y} of this.#shotPosList) {
            if (this.#turnLeftBtn.isTargeted(x, y)) {
                this.#playYokomukunSound();
                this.#viewAngle = (this.#viewAngle + 90) % 360;
                break;
            }
            if (this.#turnRightBtn.isTargeted(x, y)) {
                this.#playYokomukunSound();
                this.#viewAngle = (this.#viewAngle + 270) % 360;
                break;
            }
        }

        // パラオナ
        this.#lyricsIfNeed();

        // 背景の描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage(this.#backgroundImage, this.#viewAngle);

        // 敵と言霊の描画
        let willHit = false;
        this.#sortedEntityList().forEach(entity => {
            if (isPC && !willHit && entity.isTargeted(this.#pc.mouseX, this.#pc.mouseY)) {
                willHit = true;
            }
            entity.draw();
        });

        // ダメージ描写の描画
        this.#drawDamageOverlay(this.#player.damageRate());

        // レベルの描画
        context.textAlign = "start";
        context.textBaseline = "top";
        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;
        context.lineJoin = "round";
        drawStrokeText(context, `Lv.${level}`, 20, 20);

        // ボタンの描画
        this.#turnLeftBtn.draw(this.#shouldWarnLeft);
        this.#turnRightBtn.draw(this.#shouldWarnRight);

        // メッセージウィンドウの描画
        MessageWindow.drawText(this.#message.text, this.#message.isTransient);

        // 照準の描画
        if (isPC) {
            this.#player.drawCrosshair(this.#pc.mouseX, this.#pc.mouseY, willHit);
        }

        // 火花の描画
        drawSparks(context);

        // プレイヤーの攻撃
        if (this.#shotPosList.length > 0) {
            playSound(this.#gunshotSound);
            for (const {x, y} of this.#shotPosList) {
                addSparks(x, y);
            }
        }

        // 敵の被弾と状態の更新
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
            if (enemy.state === "dying" && !enemy.hasGivenExp) {
                this.#player.heal(enemy.healAmount);
                enemy.hasGivenExp = true;
                this.#nextExp -= 1;
            }
            else if (enemy.state === "dead") {
                this.#enemyList.splice(i, 1);
                enemy.end();
            }
            else if (enemy.state === "disappear") {
                this.#enemyList.splice(i, 1);
                enemy.end();
            }
        }
        for (let i = this.#kotodamaList.length - 1; i >= 0; i--) {
            const kotodama = this.#kotodamaList[i];
            if (kotodama.state === "dead" || kotodama.shooter.state === "dying") {
                this.#kotodamaList.splice(i, 1);
            }
        }

        // ボタンの更新
        this.#turnLeftBtn.update(this.#shouldWarnLeft);
        this.#turnRightBtn.update(this.#shouldWarnRight);

        // レベル処理
        if (this.#nextExp <= 0) {
            playSound(SoundStorage.get("レベルアップ"));
            level += 1;
            this.#nextExp = this.#calcNextExp(level);
        }

        // 敵の生成
        if (this.#enemyCreateFrame >= (60 * 1.5) / (1 + level / 100)) {
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
                this.#enemyList.push(new ShoutingSenpai(centerX, this.#viewAngle));
            }
            this.#enemyCreateFrame = 0;
        }

        // 本社生成
        if (this.#honsyaCreateFrame >= 60 * 60) {
            this.#enemyList.push(new Honsya(this.#viewAngle));
            this.#honsyaCreateFrame = 0;
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

        // プレイヤーの被弾と状態の更新
        for (let i = this.#enemyList.length - 1; i >= 0; i--) {
            const enemy = this.#enemyList[i];
            if (enemy.temaeRate >= 1) {
                this.#enemyList.splice(i, 1);
                enemy.end();
                this.#player.takeDamage(enemy.power);
            }
        }
        for (let i = this.#kotodamaList.length - 1; i >= 0; i--) {
            const kotodama = this.#kotodamaList[i];
            if (kotodama.temaeRate >= 1) {
                this.#kotodamaList.splice(i, 1);
                this.#player.takeDamage(kotodama.power);
            }
        }
        this.#player.update();

        // ボタンをワーニングにするかチェック
        this.#shouldWarnLeft = false;
        this.#shouldWarnRight = false;
        for (const entity of this.#sortedEntityList()) {
            if (entity.temaeRate < 0.3) {
                continue;
            }
            const leftX = entity.leftX();
            if (leftX >= canvas.width * 3 / 2) {
                this.#shouldWarnLeft = true;
            }
            else if (leftX >= canvas.width) {
                this.#shouldWarnRight = true;
            }
            if (this.#shouldWarnLeft && this.#shouldWarnRight) {
                break;
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
        for (const name of seNameList) {
            plpsss(name);
        }
        for (const name of kotodamaNameList) {
            plpsss(name);
        }

        await Promise.all(promiseList);
    }

    #sortedEntityList(sortOrder = "asc") {
        return this.#enemyList.concat(this.#kotodamaList).sort((a, b) => (a.temaeRate - b.temaeRate) * (sortOrder === "asc" ? 1 : -1));
    }

    #playYokomukunSound() {
        if (this.#canPlayYokomukunSound) {
            this.#canPlayYokomukunSound = false;
            playSound(SoundStorage.get("横向くんだよ90度！"));
            setTimeout(() => {
                this.#canPlayYokomukunSound = true;
            }, 1000 * 10);
        }
    }

    #lyricsIfNeed() {
        if (this.#bgm?.name === "パラオナボーイ／feat.重音テト") {
            const seek = this.#bgm.seek();
            this.#message.isTransient = false;

            if (seek < 1.5) {
                this.#message.text = "";
            }
            else if (seek < 17) {
                this.#message.text = "オチ〇ポ・パラダイス\nパラダイス・ラブ・ユー・ベイビー";
            }
            else if (seek < 25) {
                this.#message.text = "パラダイス・オ〇ニー・ボーイ\n（略してパラオナボーイ）";
            }
            else if (seek < 31) {
                this.#message.text = "泊まりのウリで　マジ狂いの天国さ";
            }
            else if (seek < 37) {
                this.#message.text = "ホテル代も　バカにならないけどね";
            }
            else if (seek < 43) {
                this.#message.text = "小遣い稼ぎなら　これが一番！";
            }
            else {
                this.#message.text = "俺のケツ〇ンパラダイス";
            }
        }
        else {
            this.#message.isTransient = true;
            this.#message.text = "";
        }
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

    #calcNextExp(nextLevel) {
        if (nextLevel <= 100) {
            return Math.floor(5 * Math.pow(nextLevel, 1/6));
        }
        else {
            return Math.floor(5 * Math.pow(nextLevel, 1/3));
        }
    }

    #drawDamageOverlay(damageRate) {
        if (damageRate === 0) {
            return;
        }
        context.save();
        const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 50 * (1 - damageRate),
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, "rgba(255, 0, 128, 0)");
        gradient.addColorStop(1, `rgba(255, 0, 128, ${damageRate})`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}
