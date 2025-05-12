
function drawStrokeText(context, text, x, y) {
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
}

function drawLoading(index = 0) {
    context.save();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(0, 0, 255)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = 60;
    const text = "Loading...";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `400 ${fontSize}px 'Noto Sans JP'`;
    context.fillStyle = "#fff";

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const senpai = drawLoading.spinningSenpaiImage;
    const sw = 120;
    const sh = 151;
    const sx = sw * (index % 5);
    const sy = sh * Math.floor(index / 4);
    const dh = fontSize * 1.8;
    const dw = sw * (dh / sh);
    const dy = (canvas.height - dh) / 2;
    const margin = 120;

    context.drawImage(senpai, sx, sy, sw, sh, margin, dy, dw, dh);
    context.drawImage(senpai, sx, sy, sw, sh, canvas.width - dw - margin, dy, dw, dh);

    context.restore();
};
