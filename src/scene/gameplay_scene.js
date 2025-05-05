
class GameplayScene extends Scene {
    static #isFirst = true;
    #backgroundImage = null;
    #gunshotSound = null;
    #gunshotSoundId = -1;

    #enemyList = [];
    #kotodamaList = [];

    #player = null;

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

    #nextExp = Number.POSITIVE_INFINITY;
    #maxLevel = 50;
    #score = 0;

    #turnLeftBtn = null;
    #turnRightBtn = null;
    #shouldWarnLeft = false;
    #shouldWarnRight = false;

    #kmr = null;
    #isKMRTalking = false;
    #isQuitting = false;
    #hasComplained = false;
    #complainList = [
        {
            mur: "チラチラ\n見てただろ",
            kmr: "いや、見てないですよ"
        },
        {
            mur: "嘘つけ\n絶対見てたゾ",
            kmr: "なんで見る必要なんかあるんですか"
        },
        {
            mur: "見たけりゃ\n見せてやるよ",
            kmr: "やめてくれよ…（絶望）"
        },
    ];
    #complainIndex = 0;

    #quitBtn = null;
    #backBtn = null;
    #complainBtn = null;

    #mdkrSnpi = null;

    #bgm = null;
    #bgmId = -1;

    #soundList = [];

    #message = {
        text: "",
        isTransient: true,
    };

    #isTutorial = true;

    #fadeOutAlpha = 0;
    #fadeOutDuration = 5000;

    constructor(useNipple, hp = undefined, score = 0) {
        super();
        this.#useNipple = useNipple;
        this.#player = new Player(hp);
        this.#score = score;
    }

    async onStart() {
        console.log("GameplayScene:onStart");

        Cookies.set("difficulty", difficulty, {expires: 365, path: COOKIE_PATH});

        this.#backgroundImage = await loadImage("asset/草原.png");
        await this.#preload();

        this.#bgm = SoundStorage.get("ほのぼの神社");
        this.#gunshotSound = SoundStorage.get("銃声");

        this.#bgmId = this.#bgm.play();

        // debug start
        // 0 <= centerX < canvas.width * 2
        // this.#enemyList.push(new MeteorSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new RunningSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new MukimukiSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new ShoutingSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new KunekuneSenpai(canvas.width / 2, this.#viewAngle));
        // this.#enemyList.push(new Honsya(this.#viewAngle));
        // debug end

        // debug start
        // this.#enemyList.push(new KunekuneSenpai(canvas.width / 2, this.#viewAngle, 0.5));
        // this.#enemyList.push(new MeteorSenpai(canvas.width / 2, this.#viewAngle, 0.5));
        // debug end

        // チュートリアル用
        this.#enemyList.push(new KunekuneSenpai(canvas.width / 2, this.#viewAngle));
        this.#enemyList.push(new KunekuneSenpai(canvas.width / 2 * 3, this.#viewAngle));

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

        this.#nextExp = this.#calcNextExp(level);

        this.#kmr = new KMR();
        this.#turnLeftBtn = new TurnLeftButton(10);
        this.#turnRightBtn = new TurnRightButton(10);
        this.#quitBtn = new QuitButton();
        this.#backBtn = new BackButton();
        this.#complainBtn = new ComplainButton();

        this.#mdkrSnpi = new MedikaraSenpai();

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
        const deltaTime = 1 / FPS;
        const calcFps = (time, prevTime) => 1000 / (time - prevTime);
        const anime = (time) => {
            if (this.#shouldAnimation) {
                if (prevTime === -1 || time - prevTime >= deltaTime * 1000 * 0.9) {
                    actualFPS = calcFps(time, prevTime);
                    if (debug.shouldDisplayFPS && prevTime !== -1) {
                        domDebguFps.innerText = actualFPS.toFixed(1);
                    }
                    prevTime = time;
                    this.#update();
                    // iOSで低電力モードだと30FPSになるっぽい
                    // 他、環境によって30FPSになることはあるっぽい
                    if (prevTime !== -1 && actualFPS < 40) {
                        this.#update();
                    }
                }
                if (this.#player.state === "dead") {
                    setTimeout(() => {
                        SceneManager.start(new GameOverScene(this.#score), false);
                    }, 3000);
                }
                else {
                    requestAnimationFrame(anime);
                }
            }
        };
        anime(performance.now());
    }

    #update() {
        if (this.#player.state === "dead") {
            return;
        }

        if (debug.canCreateEnemy && !this.#isTutorial && !this.#isKMRTalking) {
            if (this.#enemyList.length < 8 * (1 + balanceFactor() / 100)) {
                this.#enemyCreateFrame++;
            }
            this.#honsyaCreateFrame++;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        // プレイヤーの攻撃音と火花の追加
        if (this.#shotPosList.length > 0) {
            this.#gunshotSoundId = this.#gunshotSound.play();
            for (const {x, y} of this.#shotPosList) {
                addSparks(x, y);
            }
        }

        // 背景の描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage(this.#backgroundImage, this.#viewAngle);

        // 敵と言霊の描画
        let willHit = false;
        const willHitCond = entity => isPC && !willHit && entity.isTargeted(this.#pc.mouseX, this.#pc.mouseY);
        this.#sortedEntityList().forEach(entity => {
            if (willHitCond(entity)) {
                willHit = true;
            }
            entity.draw();
        });

        // ダメージ描写の描画
        this.#player.drawDamageOverlay();

        // レベルの描画
        this.#drawLevel();

        // スコアの描画
        this.#drawScore();

        // ボタンの描画
        this.#turnLeftBtn.draw(this.#shouldWarnLeft);
        this.#turnRightBtn.draw(this.#shouldWarnRight);

        // 画面の状態による差異
        if (this.#isKMRTalking) {
            this.#kmrTalking();
        }
        else if (this.#isTutorial) {
            this.#message.isTransient = false;
            if (isPC) {
                this.#message.text = "クリックで攻撃\nAキーとDキーで移動";
            }
            else {
                this.#message.text = "タップで攻撃\n指を押したまま動かすと移動";
            }
        }
        else {
            this.#message.isTransient = true;
            this.#message.text = "";
        }

        // メッセージウィンドウの描画
        MessageWindow.drawText(this.#message.text, this.#message.isTransient);

        // KMRの描画
        if (willHitCond(this.#kmr)) {
            willHit = true;
        }
        this.#kmr.draw();

        // 目力先輩の描画
        if (willHitCond(this.#mdkrSnpi)) {
            willHit = true;
        }
        this.#mdkrSnpi.draw();

        // 照準の描画
        if (isPC) {
            this.#player.drawCrosshair(this.#pc.mouseX, this.#pc.mouseY, willHit);
        }

        // 火花の描画
        drawSparks(context);

        if (this.#player.state === "dying") {
            if (this.#fadeOutAlpha === 0) {
                let highScore = 0;
                const strHighScore = Cookies.get(`${difficulty}_high_score`);
                if (strHighScore !== undefined) {
                    highScore = Number(strHighScore);
                }
                if (this.#score > highScore) {
                    Cookies.set(`${difficulty}_high_score`, String(this.#score), {expires: 365, path: COOKIE_PATH});
                }

                Howler._howls.forEach(sound => {
                    const playingIds = sound._getSoundIds().filter(id => sound.playing(id));
                    playingIds.forEach(id => {
                        sound.fade(sound.volume(id), 0, this.#fadeOutDuration, id);
                    });
                });
                setTimeout(() => {
                    this.#enemyList.forEach(enemy => enemy.end());
                    this.#bgm.stop(this.#bgmId);
                }, this.#fadeOutDuration);
            }
            this.#fadeOutAlpha += 0.004;
            if (this.#fadeOutAlpha > 1) {
                this.#fadeOutAlpha = 1;
                this.#player.state = "dead";
            }
            context.fillStyle = `rgba(255, 128, 170, ${this.#fadeOutAlpha})`;
            context.fillRect(0, 0, canvas.width, canvas.height);

            this.#shotPosList = [];
            return;
        }

        // KMRが押されたときの処理
        if (!this.#isKMRTalking) {
            for (const {x, y} of this.#shotPosList) {
                if (this.#kmr.isTargeted(x, y)) {
                    this.#isKMRTalking = true;
                    this.#togglePlaySound(false);
                    this.#bgm.volume(this.#bgm.defaultVolume * 0.5, this.#bgmId);
                    break;
                }
            }
        }
        
        // 目力先輩が押されたときの処理
        if (!this.#isKMRTalking) {
            for (const {x, y} of this.#shotPosList) {
                if (this.#mdkrSnpi.isTargeted(x, y)) {
                    this.#mdkrSnpi.onTouched();
                    break;
                }
            }
        }

        // 目力先輩の状態の更新
        this.#mdkrSnpi.update();

        // KMRと会話中なら処理はここまで
        if (this.#isKMRTalking) {
            this.#shotPosList = [];
            return;
        }

        // 横向くんだよ90度ボタンが押されたときの処理
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

        // 移動系イベントによる移動
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

        const explosionSound = SoundStorage.get("爆発");
        const crashSound = SoundStorage.get("大破");
        let explosionSoundVolume = explosionSound.defaultVolume;
        let crashSoundVolume = crashSound.defaultVolume;
        if (this.#mdkrSnpi.isRoaring) {
            const enemyCount = this.#enemyList.filter(e => e.state === "alive").length;
            const kotodamaCount = this.#kotodamaList.filter(k => k.state === "alive").length;
            if (enemyCount > 1) {
                explosionSoundVolume = explosionSound.defaultVolume * 0.85 ** enemyCount;
            }
            if (kotodamaCount > 1) {
                crashSoundVolume = crashSound.defaultVolume * 0.85 ** kotodamaCount;
            }
        }

        // 敵の被弾と状態の更新
        this.#sortedEntityList("desc").forEach(entity => {
            if (this.#mdkrSnpi.isRoaring && entity.state === "alive") {
                const damageSoundVolume = (entity instanceof Kotodama) ? crashSoundVolume : explosionSoundVolume;
                entity.instantDeath(damageSoundVolume);
            }
            else if (this.#shotPosList.length > 0) {
                // プレイヤーの攻撃が敵を貫通してほしくないため、
                // 攻撃が当たった場合は、this.#shotPosListからshotを削除する
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
                this.#score += enemy.score;
                this.#mdkrSnpi.charge();
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
                this.#score += kotodama.score;
                this.#mdkrSnpi.charge();
                this.#kotodamaList.splice(i, 1);
            }
        }

        // ボタンの状態の更新
        this.#turnLeftBtn.update(this.#shouldWarnLeft);
        this.#turnRightBtn.update(this.#shouldWarnRight);

        // レベル処理
        if (this.#nextExp <= 0) {
            SoundStorage.get("レベルアップ").play();
            level += 1;
            this.#nextExp = this.#calcNextExp(level);
        }

        // 敵の生成
        if (this.#enemyCreateFrame >= (FPS * 1.25) / (1 + balanceFactor() / 100)) {
            this.#enemyList.push(this.#createRandomEnemy());
            this.#enemyCreateFrame = 0;
        }

        // 本社生成
        if (this.#honsyaCreateFrame >= FPS * 60) {
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
            const {leftX, rightX} = entity.getXRange();
            if (leftX >= canvas.width) {
                const overflowRight = leftX - canvas.width;
                const overflowLeft = canvas.width * 2 - rightX;
                if (overflowRight <= overflowLeft) {
                    this.#shouldWarnRight = true;
                }
                else {
                    this.#shouldWarnLeft = true;
                }
            }
            if (this.#shouldWarnLeft && this.#shouldWarnRight) {
                break;
            }
        }

        // 敵を全滅させたらチュートリアルを終わる
        if (this.#isTutorial && this.#enemyList.length === 0) {
            this.#isTutorial = false;
            this.#bgm.stop(this.#bgmId);
            this.#bgm = SoundStorage.get("Smart Boy(Daily Unchi Special Mix)");
            this.#bgmId = this.#bgm.play();
        }
        
        // 後処理
        this.#shotPosList = [];
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
        if (!isPC) {
            return;
        }
        const rect = e.target.getBoundingClientRect();
        const {x, y} = this.canvasXY(e.offsetX, e.offsetY, rect);
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
            const {x, y} = this.canvasXY(offsetX, offsetY, rect);
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
        const {x, y} = this.canvasXY(e.offsetX, e.offsetY, rect);
        this.#pc.mouseX = x;
        this.#pc.mouseY = y;
    }

    async #preload() {
        if (!GameplayScene.#isFirst) {
            return;
        }
        GameplayScene.#isFirst = false;

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
        plpiss("いんゆめくん");
        plpiss("照準1");
        plpiss("照準2");
        plpiss("爆発スプライト_170");
        plpiss("座るKMR");
        plpiss("絶望KMR");
        plpiss("目力先輩/溜め1");
        plpiss("目力先輩/溜め2");
        plpiss("目力先輩/解放");
        
        // 音声
        for (const name of bgmNameList) {
            plpsss(name);
        }
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
        SoundStorage.get("横向くんだよ90度！").stop();
        SoundStorage.get("横向くんだよ90度！").play();
    }

    #createRandomEnemy() {
        const enemyClassList = [RunningSenpai];
        if (level >= 10) {
            enemyClassList.push(MeteorSenpai);
        }
        if (level >= 20) {
            enemyClassList.push(ShoutingSenpai);
        }
        if (level >= 30) {
            enemyClassList.push(MukimukiSenpai);
        }
        const totalWeight = enemyClassList.reduce((sum, enemyClass) => sum + enemyClass.spawnWeight, 0);
        const centerX = Math.random() * (canvas.width * 2);

        let rand = Math.random() * totalWeight;
        for (const enemyClass of enemyClassList) {
            rand -= enemyClass.spawnWeight;
            if (rand <= 0) {
                return new enemyClass(centerX, this.#viewAngle);
            }
        }

        // 万が一何も選ばれなかった場合、最初の敵を返す
        // 浮動小数点による丸め誤差対策
        return new enemyClassList[0](centerX, this.#viewAngle);
    }

    #calcNextExp(nextLevel) {
        if (nextLevel < this.#maxLevel) {
            return Math.floor(5 * (nextLevel + this.#maxLevel) ** (1/8));
        }
        else {
            return 50;
        }
    }

    #drawLevel() {
        context.textAlign = "start";
        context.textBaseline = "top";
        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;
        context.lineJoin = "round";
        let text = "Lv.";
        if (level < this.#maxLevel) {
            text += String(level);
        }
        else if (level === this.#maxLevel) {
            text += "MAX";
        }
        else {
            text += `MAX+${level - this.#maxLevel}`;
        }
        drawStrokeText(context, text, 20, 20);
    }

    #drawScore() {
        context.textAlign = "start";
        context.textBaseline = "top";
        context.font = "400 40px Xim-Sans";
        context.fillStyle = "#000";
        context.strokeStyle = "#eee";
        context.lineWidth = 5;
        context.lineJoin = "round";

        const text = String(`SCORE ${this.#score}`);
        const measure = context.measureText(text);
        drawStrokeText(context, text, canvas.width - measure.width - 20, 20);
    }
    
    save() {
        Cookies.set("level", String(level), {expires: 365, path: COOKIE_PATH});
        Cookies.set("score", String(this.#score), {expires: 365, path: COOKIE_PATH});
        Cookies.set("hp", String(this.#player?.hp ?? 0), {expires: 365, path: COOKIE_PATH});
    }

    #kmrTalking() {
        this.#message.isTransient = false;
        if (this.#isQuitting) {
            this.#message.text = "じゃ、終わります";
            return;
        }
        else if (this.#hasComplained) {
            // 何もしない
        }
        else {
            this.#message.text = "なんですか？";
        }

        this.#quitBtn.draw();
        this.#backBtn.draw();
        this.#complainBtn.draw(this.#complainList[this.#complainIndex].mur);

        if (this.#player.state !== "alive") {
            return;
        }

        for (const {x, y} of this.#shotPosList) {
            if (this.#quitBtn.isTargeted(x, y)) {
                this.#isQuitting = true;
                SoundStorage.get("じゃ、流します").play();
                setTimeout(() => {
                    Howler.stop();
                    this.save();
                    SceneManager.start(new TitleScene(), false);
                }, 2000);
                break;
            }
            else if (this.#backBtn.isTargeted(x, y)) {
                this.#isKMRTalking = false;
                this.#hasComplained = false;
                this.#complainIndex = 0;
                this.#togglePlaySound(true);
                this.#bgm.volume(this.#bgm.defaultVolume, this.#bgmId);
                break;
            }
            else if (this.#complainBtn.isTargeted(x, y)) {
                this.#hasComplained = true;
                this.#message.text = this.#complainList[this.#complainIndex].kmr;
                this.#kmr.say(this.#message.text);
                if (this.#complainIndex < this.#complainList.length - 1) {
                    this.#complainIndex += 1;
                }
                else {
                    this.#kmr.despair(true);
                    this.#player.state = "dying";
                    this.#score = -1145148101919;
                }
                break;
            }
        }
    }

    #togglePlaySound(shouldPlay) {
        if (!shouldPlay) {
            this.#soundList = [];
        }
        Howler._howls.forEach(sound => {
            if (!shouldPlay) {
                sound._getSoundIds().forEach(id => {
                    if (id === this.#gunshotSoundId) return;
                    if (id === this.#bgmId) return;
                    if (sound.playing(id)) {
                        this.#soundList.push({sound, id});
                    }
                });
            }
        });
        this.#soundList.forEach(({sound, id}) => {
            if (shouldPlay) {
                sound.play(id);
            }
            else {
                sound.pause(id);
            }
        });
    }
}
