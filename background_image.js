
function drawBackgroundImage(backgroundImage, viewAngle) {
    const sw = backgroundImage.width;
    let sy = 0;
    let sh = backgroundImage.height;
    if (backgroundImage.height >= canvas.height) {
        sy = (backgroundImage.height - canvas.height) / 2;
        sh = canvas.height;
    }

    const canvasCenterX = canvas.width / 2;
    const offsetX = (canvasCenterX * (viewAngle / 90)) % (canvasCenterX * 4);
    
    let dx = offsetX % (canvas.width * 2);
    if (dx >= canvas.width) {
        dx = dx - canvas.width * 2;
    }

    context.drawImage(
        backgroundImage,
        0, sy, sw, sh,
        dx, 0, canvas.width, canvas.height
    );
}

