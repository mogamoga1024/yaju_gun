
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemy = new Senpai(canvas.width / 2);
enemy.draw();

function update() {
    enemy.update();
    enemy.draw();
    requestAnimationFrame(update);
};

update();
