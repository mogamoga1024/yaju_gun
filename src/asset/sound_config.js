
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
    add("PLUMBER", "m4a", {volume: 0.25});
    add("中華淫行", "m4a", {volume: 0.3});
    add("snow prizm (Ketsupine mix)", "mp3", {volume: 0.2});

    // 効果音
    add("ドンッ");
    add("銃声", "mp3", {volume: 0.3});
    add("大破", "mp3", {volume: 0.65});
    add("爆発", "m4a", {volume: 0.65});

    // 野獣先輩
    add("息継ぎ", "m4a", {volume: 1, loop: true});
    add2("ムキムキ息継ぎ", "息継ぎ", "m4a", {volume: 1, rate: 0.6, loop: true});
    add("ンアッー！（ねっとり）", "mp3", {volume: 0.3});
    add("アイスティー");
    add2("ムキムキオォン！", "オォン！", "mp3", {volume: 0.3, rate: 0.7});
})();
