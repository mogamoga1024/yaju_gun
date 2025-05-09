
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
    context.textAlign = "start";
    context.textBaseline = "middle";
    context.font = "400 60px 'Noto Sans JP'";
    context.fillStyle = "#000";
    context.strokeStyle = "#fff";
    context.lineWidth = 5;
    context.lineJoin = "round";
    drawStrokeText(context, text, canvas.width - 320, 390);
}
