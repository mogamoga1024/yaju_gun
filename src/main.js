
const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");

const isPC = (function() {
    const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
    const isMobileByUa = mobileRegex.test(navigator.userAgent);
    const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
    return !(isMobileByUa || isMobileByClientHint);
})();

loadImage("asset/こちらを見つめる先輩.png").then(image => {
    drawLoading.backgroundImage = image;
    SceneManager.start(new TitleScene());
});
