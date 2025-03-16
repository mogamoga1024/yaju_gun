
function loadImage(path) {
    const image = new Image();
    image.src = path;
    return new Promise(resolve => {
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => {
            resolve(image);
        };
    });
}
