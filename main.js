
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemyList = [];

// 範囲：[0, 360)
// 0で真正面 90で左 180で後ろ 270で右
let viewAngle = 0;

loadImage("asset/草原.png").then(backgroundImage => {
    drawBackgroundImage(backgroundImage, viewAngle);
    enemyList.push(new RunningSenpai(canvas.width / 2));
    // enemyList.push(new ShoutingSenpai(canvas.width / 2));
    enemyList.forEach(enemy => enemy.draw(viewAngle));

    setupControls();

    function update() {
        // 状態の更新
        enemyList.forEach(enemy => enemy.update());
        
        for (const enemy of enemyList) {
            if (!(enemy instanceof ShoutingSenpai)) {
                continue;
            }
            if (!!enemy.canShout()) {
                continue;
            }
            const kotodama = enemy.shout();
            enemyList.push(kotodama);
        }
        
        // 描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage(backgroundImage, viewAngle);
        enemyList.forEach(enemy => enemy.draw(viewAngle));

        requestAnimationFrame(update);
    };

    update();
});

function setupControls() {
    const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
    const isMobileByUa = mobileRegex.test(navigator.userAgent);
    const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
    const isPC = !(isMobileByUa || isMobileByClientHint);

    if (isPC) {
        window.addEventListener("keydown", e => {
            switch (e.key) {
                case "ArrowLeft":
                case "a": case "A":
                    // todo
                    viewAngle = (viewAngle + 4) % 360;
                    break;

                case "ArrowRight":
                case "d": case "D":
                    // todo
                    viewAngle = (viewAngle + (360 - 4)) % 360;
                    break;
            }
        });
    }
    else {
        // todo
    }
}


