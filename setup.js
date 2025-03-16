
// グローバル汚染回避
{
    // 画像先読み込み
    for (let i = 0; i <= 12; i++) {
        const image = new Image();
        image.src = `asset/走る野獣先輩/${i}.png`;
    }
}

