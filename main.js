
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemyList = [];

loadImage("asset/草原.png").then(backgroundImage => {
    drawBackgroundImage(backgroundImage);
    // enemyList.push(new RunningSenpai(canvas.width / 2));
    enemyList.push(new ShoutingSenpai(canvas.width / 2));
    enemyList.forEach(enemy => enemy.draw());

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
        drawBackgroundImage(backgroundImage);
        enemyList.forEach(enemy => enemy.draw());

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
                    break;

                case "ArrowRight":
                case "d": case "D":
                    // todo
                    break;
            }
        });
    }
    else {
        // todo
    }
}


