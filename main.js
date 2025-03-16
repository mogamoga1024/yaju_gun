
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

loadImage("asset/草原.png").then(backgroundImage => {
    drawBackgroundImage(backgroundImage);
    const enemy = new RunningSenpai(canvas.width / 2);
    enemy.draw();

    function update() {
        drawBackgroundImage(backgroundImage);

        enemy.update();
        enemy.draw();

        requestAnimationFrame(update);
    };

    update();
});
