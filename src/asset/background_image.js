
function drawBackgroundImage(backgroundImage, viewAngle = 0) {
    const sw = backgroundImage.width;
    const sh = canvas.height * (sw / canvas.width);
    const sy = (backgroundImage.height - sh) / 2;

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

    if (dx < 0) {
        context.drawImage(
            backgroundImage,
            0, sy, sw, sh,
            dx + canvas.width, 0, canvas.width, canvas.height
        );
    }
    else if (dx > 0) {
        context.drawImage(
            backgroundImage,
            0, sy, sw, sh,
            dx - canvas.width, 0, canvas.width, canvas.height
        );
    }
}

