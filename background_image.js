
function drawBackgroundImage(backgroundImage) {
    const sx = 0;
    const sw = backgroundImage.width / 2;
    let sy = 0;
    let sh = backgroundImage.height;
    if (backgroundImage.height >= canvas.height) {
        sy = (backgroundImage.height - canvas.height) / 2;
        sh = canvas.height;
    }

    context.drawImage(
        backgroundImage,
        sx, sy, sw, sh,
        0, 0, canvas.width, canvas.height
    );
}

