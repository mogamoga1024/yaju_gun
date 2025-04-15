
const domGameCanvasWrapper = document.querySelector("#game-canvas-wrapper");
const domNotice = document.querySelector("#notice");
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

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
            SceneManager.start(new TitleScene());
        });
    }
})();
