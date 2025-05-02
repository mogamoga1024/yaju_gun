
const domGameCanvasWrapper = document.querySelector("#game-canvas-wrapper");
const domNotice = document.querySelector("#notice");
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const COOKIE_PATH = "/yaju_gun";
const FPS = 60;

let level = 1;
let difficulty = "normal";
let actualFPS = 60;

function balanceFactor() {
    let a;
    if (difficulty === "easy") {
        a = 35;
    }
    else if (difficulty === "normal") {
        a = 55;
    }
    else /*if (difficulty === "hard")*/ {
        a = 70;
    }
    if (actualFPS < 40) {
        a -= 32;
    }
    return (level + a) * 1.1;
}

const EASY_NAME = "ひで";
const NORMAL_NAME = "ノンケ";
const HARD_NAME = "迫真";

function difficultyName() {
    if (difficulty === "easy") {
        return EASY_NAME;
    }
    else if (difficulty === "normal") {
        return NORMAL_NAME;
    }
    else /*if (difficulty === "hard")*/ {
        return HARD_NAME;
    }
}

const isPC = (function() {
    const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
    const isMobileByUa = mobileRegex.test(navigator.userAgent);
    const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
    return !(isMobileByUa || isMobileByClientHint);
})();

if (!isPC) {
    domNotice.style.display = "none";
    domGameCanvasWrapper.style.marginTop = "0";

    const showNoticeIfPortrait = () => {
        const angle = screen.orientation.angle;
        if (angle === 0 || angle === 180) {
            domNotice.style.display = "";
            domNotice.innerText = "スマホを横にして❤";
        }
        else {
            domNotice.style.display = "none";
            window.scrollTo(0, 0);
        }
    };
    showNoticeIfPortrait();
    window.addEventListener("orientationchange", showNoticeIfPortrait);
}

if (!isPC) {
    const adjustCanvas = () => {
        const deviceWidth = window.innerWidth;
        if (deviceWidth < canvas.width) {
            canvas.style.width = `${deviceWidth}px`;
            canvas.style.height = "auto";
        }
        else {
            canvas.style.width = "auto";
            canvas.style.height = "100svh";
        }
    };
    adjustCanvas();
    window.addEventListener("resize", adjustCanvas);
}

if (!/android/i.test(navigator.userAgent)) {
    const domAndroid = document.querySelector("#android");
    domAndroid.style.display = "none";
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        Howler.stop();
        const scene = SceneManager.scene();
        if (scene instanceof GameplayScene) {
            scene.save();
            SceneManager.start(new TitleScene(), false);
        }
    } else {
        // 音が取得できていないならばリロードする
        const scene = SceneManager.scene();
        if (scene instanceof GameplayScene && scene.state !== "loaded") {
            window.location.reload();
        }
    }
});

(function() {
    const $loading = document.querySelector("#loading");
    const $app = document.querySelector("#app");
    let isFirst = true;
    
    document.fonts.onloadingdone = () => {
        $loading.style.display = "none";
        $app.style.display = "";
        createTitleScene();
    };
    
    document.fonts.ready.then(() => {
        $loading.style.display = "none";
        $app.style.display = "";
        createTitleScene();
    });

    function createTitleScene() {
        if (!isFirst) return;
        isFirst = false;
        loadImage("asset/こちらを見つめる先輩.png").then(image => {
            drawLoading.backgroundImage = image;
            SceneManager.start(new TitleScene(true));
        });
    }
})();

// error

const domError = document.querySelector("#error");
window.addEventListener("error", e => {
    const text = `【${e.filename.split("/").pop()}:${e.lineno}】${e.message}`;
    domError.innerHTML += text + "<br>";
});

// debug

const debug = {
    canCreateEnemy: true,
    shouldDisplayFPS: true,
};

const domDebguText = document.querySelector("#debug-text");
const domDebguFps = document.querySelector("#debug-fps");
const debugBtn1 = document.querySelector("#create-enemy");
const debugBtn2 = document.querySelector("#sound-room");
const debugBtn3 = document.querySelector("#self-destruction");

debugBtn1.addEventListener("click", () => {
    debug.canCreateEnemy = !debug.canCreateEnemy;
    if (debug.canCreateEnemy) {
        debugBtn1.innerText = "敵生成停止";
    }
    else {
        debugBtn1.innerText = "敵生成再開";
    }
});

debugBtn2.addEventListener("click", () => {
    window.open("./test/sound.html", "_blank");
});

debugBtn3.addEventListener("click", () => {
    Howler.stop();
    SceneManager.start(new GameOverScene(114514), false);
});



