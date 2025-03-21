
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemyList = [];
const kotodamaList = [];

const player = new Player();

// 範囲：[0, 360)
// 0で真正面 90で左 180で後ろ 270で右
let viewAngle = 0;

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
};

let backgroundImage = null;
let bgm = {
    isFirst: true,
    sound: null
};
(async function() {
    backgroundImage = await loadImage("asset/草原.png");
    
    const promiseList = [];
    for (let i = 0; i <= 12; i++) {
        promiseList.push((async () => {
            const name = `走る野獣先輩/${i}`;
            const image = await loadImage(`asset/${name}.png`);
            ImageStorage.set(name, image);
        })());
    }
    for (let i = 0; i <= 5; i++) {
        promiseList.push((async () => {
            const name = `くねくね先輩/${i}`;
            const image = await loadImage(`asset/${name}.png`);
            ImageStorage.set(name, image);
        })());
    }
    await Promise.all(promiseList);

    for (const name of ["ドンッ", "アイスティー"]) {
        const sound = await loadSound(`asset/${name}.mp3`);
        SoundStorage.set(name, sound);
    }

    window.addEventListener("click", async () => {
        if (!bgm.isFirst) {
            return;
        }
        bgm.isFirst = false;
        bgm.sound = await loadSound(`asset/PLUMBER.m4a`, {volume: 0.3, loop: true});
        playSound(bgm.sound);
    });

    main();
})();

function main() {
    drawBackgroundImage(backgroundImage, viewAngle);
    // enemyList.push(new RunningSenpai(canvas.width / 2));
    enemyList.push(new ShoutingSenpai(canvas.width / 2));
    // enemyList.push(new ShoutingSenpai(canvas.width * 3 + canvas.width / 2));
    enemyList.forEach(enemy => enemy.draw(viewAngle));

    setupControls();

    function update() {
        // PCでのキーイベント
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

        // 状態の更新
        enemyList.forEach(enemy => enemy.update());
        kotodamaList.forEach(kotodama => kotodama.update());
        
        for (const enemy of enemyList) {
            if (!(enemy instanceof ShoutingSenpai)) {
                continue;
            }
            if (!enemy.canShout()) {
                continue;
            }
            const kotodama = enemy.shout();
            kotodamaList.unshift(kotodama);
        }
        
        // 描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage(backgroundImage, viewAngle);
        enemyList.forEach(enemy => enemy.draw(viewAngle));
        kotodamaList.forEach(kotodama => kotodama.draw(viewAngle));

        for (let i = kotodamaList.length - 1; i >= 0; i--) {
            const kotodama = kotodamaList[i];
            if (kotodama.isColliding()) {
                kotodamaList.splice(i, 1);
                player.takeDamage();
            }
        }

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


