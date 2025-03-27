
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

function loadSound(name) {
    const {path, option: _option} = soundConfig[name];

    return new Promise(resolve => {
        const option = {
            src: [path],
            volume: 1,

            // trueだとユーザー操作がどうのこうので音が鳴らない場合がある。例えユーザー操作があっても。
            html5: false,
            
            // https://github.com/goldfire/howler.js/issues/293
            onload() {
                sound.isOK = true;
                resolve(sound);
            },
            onloaderror() {
                sound.isOK = false;
                resolve(sound);
            },
        };
        if (_option !== null) {
            Object.assign(option, _option);
        }
        const sound = new Howl(option);
    });
}

function playSound(sound) {
    return new Promise(resolve => {
        // https://github.com/goldfire/howler.js/issues/1753
        if (Howler.ctx.state === "suspended" || Howler.ctx.state === "interrupted") {
            Howler.ctx.resume().then(() => {
                sound.play();
                resolve();
            });
        }
        else {
            sound.play();
            resolve();
        }
    });
}
