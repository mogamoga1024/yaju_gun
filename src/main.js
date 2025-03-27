
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemyList = [];
const kotodamaList = [];

const player = new Player();

// 範囲：[0, 360)
// 0で真正面 90で左 180で後ろ 270で右
let viewAngle = 0;

let hasShot = false;

const isPC = (function() {
    const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
    const isMobileByUa = mobileRegex.test(navigator.userAgent);
    const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
    return !(isMobileByUa || isMobileByClientHint);
})();

const pc = {
    isPressed: {
        "left": false,
        "right": false,
        "turn": false,
    },
    canTurn: true,
    mouseX: canvas.width / 2,
    mouseY: canvas.height / 2,
};

let backgroundImage = null;
let bgm = {
    isFirst: true,
    sound: null
};
(async function() {
    backgroundImage = await loadImage("asset/草原.png");

    const promiseList = [];
    const plpiss = (name) => {
        promiseList.push((async () => ImageStorage.set(name, await loadImage(`asset/${name}.png`)))());
    };
    const plpsss = (name, ext = "mp3", option = null) => {
        promiseList.push((async () => SoundStorage.set(name, await loadSound(`asset/${name}.${ext}`, option)))());
    };

    for (let i = 0; i <= 12; i++) {
        plpiss(`走る野獣先輩/${i}`);
    }
    for (let i = 0; i <= 5; i++) {
        plpiss(`くねくね先輩/${i}`);
    }
    plpiss("照準1");
    plpiss("照準2");
    plpiss("爆発スプライト_170");
    
    for (const name of ["ドンッ", "アイスティー"]) {
        plpsss(name);
    }
    plpsss("銃声", "mp3", {volume: 0.4});
    plpsss("息継ぎ", "m4a", {volume: 1, loop: true});

    await Promise.all(promiseList);

    window.addEventListener("click", async () => {
        return; // todo
        if (!bgm.isFirst) {
            return;
        }
        bgm.isFirst = false;
        bgm.sound = await loadSound(`asset/PLUMBER.m4a`, {volume: 0.3, loop: true});
        playSound(bgm.sound);
    });

    canvas.addEventListener("click", e => {
        hasShot = true;
        pc.mouseX = e.offsetX;
        pc.mouseY = e.offsetY;
    });
    canvas.addEventListener("mousemove", e => {
        pc.mouseX = e.offsetX;
        pc.mouseY = e.offsetY;
    });

    main();
})();

function main() {
    drawBackgroundImage(backgroundImage, viewAngle);
    // enemyList.push(new RunningSenpai(canvas.width / 2, viewAngle));
    enemyList.push(new ShoutingSenpai(canvas.width / 2, viewAngle));
    // enemyList.push(new ShoutingSenpai(canvas.width * 3 + canvas.width / 2, viewAngle));
    enemyList.forEach(enemy => enemy.draw());

    setupControls();

    function update() {
        // PCでのキーイベントの捕捉
        if (isPC) {
            const speed = 4;
            if (pc.isPressed.left) {
                viewAngle = (viewAngle + speed) % 360;
            }
            if (pc.isPressed.right) {
                viewAngle = (viewAngle + (360 - speed)) % 360;
            }
            if (pc.isPressed.turn && pc.canTurn) {
                pc.canTurn = false;
                viewAngle = (viewAngle + 180) % 360;
            }
        }

        // プレイヤーの攻撃
        if (hasShot) {
            playSound(SoundStorage.get("銃声"));
            if (isPC) {
                addSparks(pc.mouseX, pc.mouseY);
            }
        }

        // 敵の状態の更新と被弾
        let canDealDamage = true;
        sortedEntityList("desc").forEach(entity => {
            if (hasShot && canDealDamage && isPC && entity.isTargeted(pc.mouseX, pc.mouseY)) {
                canDealDamage = false;
                entity.takeDamage();
            }
            entity.update(viewAngle);
        });
        for (let i = enemyList.length - 1; i >= 0; i--) {
            const enemy = enemyList[i];
            if (enemy.state === "dead") {
                enemyList.splice(i, 1);
            }
        }
        for (let i = kotodamaList.length - 1; i >= 0; i--) {
            const kotodama = kotodamaList[i];
            if (kotodama.state === "dead" || kotodama.shooter.state === "dying") {
                kotodamaList.splice(i, 1);
            }
        }
        
        // 敵の攻撃
        for (const enemy of enemyList) {
            if (!(enemy instanceof ShoutingSenpai)) {
                continue;
            }
            if (!enemy.canShout()) {
                continue;
            }
            const kotodama = enemy.shout(viewAngle);
            kotodamaList.push(kotodama);
        }

        // プレイヤーの被弾
        for (let i = kotodamaList.length - 1; i >= 0; i--) {
            const kotodama = kotodamaList[i];
            if (kotodama.isHittingPlayer()) {
                kotodamaList.splice(i, 1);
                player.takeDamage();
            }
        }
        
        // 奥側から描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage(backgroundImage, viewAngle);
        let willHit = false;
        sortedEntityList().forEach(entity => {
            if (isPC && !willHit && entity.isTargeted(pc.mouseX, pc.mouseY)) {
                willHit = true;
            }
            entity.draw();
        });

        if (isPC) {
            player.drawCrosshair(pc.mouseX, pc.mouseY, willHit);
        }

        drawSparks(context);

        // 後処理
        hasShot = false;

        requestAnimationFrame(update);
    };

    update();
}

function setupControls() {
    if (isPC) {
        window.addEventListener("keydown", e => {
            switch (e.key) {
                case "ArrowLeft":
                case "a": case "A":
                    pc.isPressed.left = true;
                    break;

                case "ArrowRight":
                case "d": case "D":
                    pc.isPressed.right = true;
                    break;
                
                case "ArrowDown":
                case "s": case "S":
                    pc.isPressed.turn = true;
                    break;
            }
        });
        window.addEventListener("keyup", e => {
            switch (e.key) {
                case "ArrowLeft":
                case "a": case "A":
                    pc.isPressed.left = false;
                    break;

                case "ArrowRight":
                case "d": case "D":
                    pc.isPressed.right = false;
                    break;
                
                case "ArrowDown":
                case "s": case "S":
                    pc.isPressed.turn = false;
                    pc.canTurn = true;
                    break;
            }
        });
    }
    else {
        // todo
    }
}

function sortedEntityList(sortOrder = "asc") {
    return enemyList.concat(kotodamaList).sort((a, b) => (a.temaeRate - b.temaeRate) * (sortOrder === "asc" ? 1 : -1));
}

