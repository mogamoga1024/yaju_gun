
function drawStrokeText(context, text, x, y) {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
}

function drawLoading() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.globalAlpha = 0.8;

    const image = drawLoading.backgroundImage;
    const sw = image.width;
    const sh = image.width * (canvas.height / canvas.width);
    const sx = 0;
    const sy = (image.height - sh) / 2;
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    
    context.globalAlpha = 1;
    const text = "Loading...";
    context.textBaseline = "top";
    context.font = "900 48px sans-serif";
    context.fillStyle = "#000000";
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 5;
    drawStrokeText(context, text, 530, 400);
}
