
function drawStrokeText(context, text, x, y) {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
}

function drawLoading() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.globalAlpha = 0.8;
    drawBackgroundImage(drawLoading.backgroundImage);
    context.globalAlpha = 1;

    const text = "Loading...";
    context.textBaseline = "top";
    context.font = "400 60px Xim-Sans";
    context.fillStyle = "#000";
    context.strokeStyle = "#fff";
    context.lineWidth = 5;
    drawStrokeText(context, text, canvas.width - 280, 370);
}
