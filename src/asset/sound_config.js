
const soundConfig = {};
const bgmNameList = [];
const seNameList = [];
const kotodamaNameList = [];

(function() {
    function add1(nameList, name, ext = "mp3", option = null) {
        nameList.push(name);
        const path = `asset/${name}.${ext}`;
        soundConfig[name] = {path, option};
    }

    function add2(nameList, name, fileName, ext = "mp3", option = null) {
        nameList.push(name);
        const path = `asset/${fileName}.${ext}`;
        soundConfig[name] = {path, option};
    }

    const b = bgmNameList;
    const s = seNameList;
    const k = kotodamaNameList;

    // BGM
    add1(b, "ほのぼの神社", "mp3", {volume: 0.5, loop: true});
    add1(b, "Smart Boy(Daily Unchi Special Mix)", "mp3", {volume: 0.6, loop: true});

    // 効果音 gameplay
    add1(s, "ドンッ", "mp3", {volume: 0.8});
    add1(s, "銃声", "mp3", {volume: 0.3});
    add1(s, "大破", "mp3", {volume: 0.6});
    add1(s, "爆発", "m4a", {volume: 0.5});
    add1(s, "横向くんだよ90度！", "mp3", {volume: 0.3});
    add1(s, "レベルアップ", "mp3", {volume: 0.1});
    
    // 効果音 game over
    add1(s, "ブッチッパ！", "mp3", {volume: 0.5});
    add1(s, "は？", "mp3", {volume: 0.6});
    add1(s, "へなちょこ", "mp3", {volume: 0.6});
    add1(s, "もうちょっと力入れないとダメだね", "mp3", {volume: 0.9});
    add1(s, "ま、多少はね？", "mp3", {volume: 0.9});
    add1(s, "36…普通だな！", "mp3", {volume: 0.8});
    add1(s, "なんか足んねぇよなぁ？", "mp3", {volume: 0.4});
    add1(s, "いいゾ～これ", "mp3", {volume: 0.9});
    add1(s, "やりますねぇ！", "mp3", {volume: 0.7});
    
    // 野獣先輩
    add1(s, "息継ぎ", "m4a", {volume: 0.95, loop: true});
    add2(s, "ムキムキ息継ぎ", "息継ぎ", "m4a", {volume: 0.95, rate: 0.6, loop: true});
    add1(s, "ンアッー！（ねっとり）", "mp3", {volume: 0.25});
    add2(s, "ムキムキオォン！", "オォン！", "mp3", {volume: 0.4, rate: 0.7});
    add1(s, "謎の金属音", "mp3", {volume: 0.7});
    add1(s, "あーいいっすねー", "mp3", {volume: 1});
    add1(s, "アアッー！(高音)", "mp3", {volume: 0.8});

    // 言霊
    add1(k, "アイスティー", "mp3", {volume: 0.7});
    add1(k, "FOO↑気持ちいい", "mp3", {volume: 0.9});
})();
