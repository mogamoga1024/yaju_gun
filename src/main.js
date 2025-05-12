
const domNotice = document.querySelector("#notice");
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const COOKIE_PATH = "/yaju_gun";
const FPS = 30; // スマホの低電力モードだとブラウザの描画が30fpsになってしまうため

let level = 1;
let difficulty = "normal";

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

    const resizeCanvas = () => {
        const iw = Math.max(window.innerWidth, window.innerHeight);
        const ih = Math.min(window.innerWidth, window.innerHeight);
        const ch = iw * (canvas.height / canvas.width);
        if (ch > ih) {
            const cw = canvas.width * (ih / canvas.height);
            canvas.style.maxWidth = `${cw}px`;
        }
        else {
            canvas.style.maxWidth = `${iw}px`;
        }
    };
    resizeCanvas();
    window.addEventListener("scroll", () => {
        const angle = screen.orientation.angle;
        if (angle === 90 || angle === 270) {
            resizeCanvas();
        }
    });

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

// 開発者モード

const domDebug = document.querySelector("#debug");

domDebug.style.display = "block";

const domH1 = document.querySelector("h1");
let h1ClickCount = 0;
domH1.addEventListener("click", e => {
    h1ClickCount++;
    if (h1ClickCount >= 40) {
        alert("デバグ機能開放");
        domDebug.style.display = "block";
        h1ClickCount = Number.NEGATIVE_INFINITY;
    }
});

// error

window.addEventListener("error", e => {
    const point = `${e.filename.split("/").pop()}:${e.lineno}`;
    const message = e.message;
    alert(`ごめんエラー(TωT)\n${point}\n${message}`);
    const scene = SceneManager.scene();
    if (scene instanceof GameplayScene) {
        scene.save();
    }
    location.reload();
});

// debug

const debug = {
    isActive: true,
    canCreateEnemy: true,
    isMuteki: false,
};

const domDebugText = document.querySelector("#debug-text");
const debugBtn1 = document.querySelector("#create-enemy");
const debugBtn2 = document.querySelector("#sound-room");
const debugBtn3 = document.querySelector("#self-destruction");
const debugBtn4 = document.querySelector("#force-error");
const debugBtn5 = document.querySelector("#delete-cookie");
const debugBtn6 = document.querySelector("#muteki");

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

debugBtn4.addEventListener("click", () => {
    throw new Error("強制エラー発生");
});

debugBtn5.addEventListener("click", () => {
    Cookies.remove("easy_high_score", {path: COOKIE_PATH});
    Cookies.remove("normal_high_score", {path: COOKIE_PATH});
    Cookies.remove("hard_high_score", {path: COOKIE_PATH});
    Cookies.remove("difficulty", {path: COOKIE_PATH});
    Cookies.remove("level", {path: COOKIE_PATH});
    Cookies.remove("next_exp", {path: COOKIE_PATH});
    Cookies.remove("score", {path: COOKIE_PATH});
    Cookies.remove("hp", {path: COOKIE_PATH});
    Cookies.remove("mdkr", {path: COOKIE_PATH});
    alert("リロードします");
    location.reload();
});

debugBtn6.addEventListener("click", () => {
    debug.isMuteki = !debug.isMuteki;
    if (debug.isMuteki) {
        debugBtn6.innerText = "ダメージ有効化";
    }
    else {
        debugBtn6.innerText = "ダメージ無効化";
    }
});
