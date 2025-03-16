
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const enemy = new Senpai(canvas.width / 2);
enemy.draw();

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    enemy.update();
    enemy.draw();
    requestAnimationFrame(update);
};

update();
