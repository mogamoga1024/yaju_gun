
// グローバル汚染回避
(function() {
    function preloadImage(src) {
        const image = new Image();
        image.src = src;
    }

    // 画像先読み込み
    for (let i = 0; i <= 12; i++) {
        preloadImage(`asset/走る野獣先輩/${i}.png`);
    }
})();

