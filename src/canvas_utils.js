
function drawStrokeText(context, text, x, y) {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
}

function drawLoading() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.globalAlpha = 0.8;
    context.drawImage(drawLoading.backgroundImage, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    const text = "Loading...";
    context.textBaseline = "top";
    context.font = "900 48px sans-serif";
    context.fillStyle = "#000000";
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 5;
    drawStrokeText(context, text, 530, 400);
}
