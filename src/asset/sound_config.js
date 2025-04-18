
const soundConfig = {};

(function() {
    function add(name, ext = "mp3", option = null) {
        const path = `asset/${name}.${ext}`;
        soundConfig[name] = {path, option};
    }

    function add2(name, fileName, ext = "mp3", option = null) {
        const path = `asset/${fileName}.${ext}`;
        soundConfig[name] = {path, option};
    }

    // BGM
    add("パラオナボーイ／feat.重音テト", "mp3", {volume: 0.9});
    add("PLUMBER", "m4a", {volume: 0.3});
    add("中華淫行", "m4a", {volume: 0.3});
    add("snow prizm (Ketsupine mix)", "mp3", {volume: 0.2});
    add("「愛のカタチ」四部合唱【山崎まさゆき】", "mp3", {volume: 0.9});
    add("星空.flv", "m4a", {volume: 0.45});
    add("太いぜ。", "mp3", {volume: 0.6});
    add("Namagusa Monk", "m4a", {volume: 0.35});

    // 効果音
    add("ドンッ", "mp3", {volume: 0.8});
    add("銃声", "mp3", {volume: 0.3});
    add("大破", "mp3", {volume: 0.6});
    add("爆発", "m4a", {volume: 0.5});

    // 野獣先輩
    add("息継ぎ", "m4a", {volume: 0.95, loop: true});
    add2("ムキムキ息継ぎ", "息継ぎ", "m4a", {volume: 0.95, rate: 0.6, loop: true});
    add("ンアッー！（ねっとり）", "mp3", {volume: 0.25});
    add2("ムキムキオォン！", "オォン！", "mp3", {volume: 0.4, rate: 0.7});
    add("謎の金属音", "mp3", {volume: 0.7});
    add("あーいいっすねー", "mp3", {volume: 0.8});
    add("アアッー！(高音)", "mp3", {volume: 0.8});

    // 言霊
    add("アイスティー");
    add("FOO↑気持ちいい", "mp3", {volume: 0.9});
})();
