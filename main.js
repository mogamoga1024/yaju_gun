
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemyList = [];

loadImage("asset/草原.png").then(backgroundImage => {
    drawBackgroundImage(backgroundImage);
    // enemyList.push(new RunningSenpai(canvas.width / 2));
    enemyList.push(new ShoutingSenpai(canvas.width / 2));
    enemyList.forEach(enemy => enemy.draw());

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
