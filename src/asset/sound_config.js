
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

    function add3(nameList, name, ext = "mp3", option = null) {
        nameList.push(name);
        const path = `asset/bgm/${name}.${ext}`;
        soundConfig[name] = {path, option};
    }

    const b = bgmNameList;
    const s = seNameList;
    const k = kotodamaNameList;

    // BGM
    add3(b, "ほのぼの神社", "mp3", {volume: 0.6, loop: true});
    add3(b, "Smart Boy(Daily Unchi Special Mix)", "mp3", {volume: 0.6, loop: true});
    add3(b, "あの頃の夏の思い出神社", "m4a", {volume: 0.6, loop: true});

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
    add1(s, "やりますねぇ！", "mp3", {volume: 0.9});
    
    // 野獣先輩
    add1(s, "息継ぎ", "m4a", {volume: 0.95, loop: true});
    add2(s, "ムキムキ息継ぎ", "息継ぎ", "m4a", {volume: 0.95, rate: 0.6, loop: true});
    add1(s, "ンアッー！（ねっとり）", "mp3", {volume: 0.25});
    add2(s, "ムキムキオォン！", "オォン！", "mp3", {volume: 0.4, rate: 0.7});
    add1(s, "謎の金属音", "mp3", {volume: 0.7});
    add1(s, "あーいいっすねー", "mp3", {volume: 1});
    add1(s, "アアッー！(高音)", "mp3", {volume: 0.8});

    // パンチ
    // add1(k, "お前のことが好きだったんだよ！", "mp3", {volume: 0.7});
    add1(s, "暴れんなよ…", "mp3", {volume: 0.5});
    // add1(k, "いきますよ～イクイク", "mp3", {volume: 0.7});

    // KMR
    add1(s, "じゃ、流します", "mp3", {volume: 0.5});
    add1(s, "いや、見てないですよ", "mp3", {volume: 1});
    add1(s, "なんで見る必要なんかあるんですか", "mp3", {volume: 1});
    add1(s, "やめてくれよ…（絶望）", "mp3", {volume: 1});

    // 目力先輩
    add1(s, "目力先輩/ヌウン_ヘッヘッ", "mp3", {volume: 0.7});
    add1(s, "目力先輩/アー！", "mp3", {volume: 0.7});

    // MRU
    // add1(s, "チラチラ見てただろ", "mp3", {volume: 1});
    // add1(s, "うそつけ絶対見てたゾ", "mp3", {volume: 1});
    // add1(s, "見たけりゃ見せてやるよ", "mp3", {volume: 1});

    // AKYS
    add1(s, "人間の屑がこの野郎", "mp3", {volume: 1});

    // 言霊
    add1(k, "アイスティー", "mp3", {volume: 0.7});
    add1(k, "FOO↑気持ちいい", "mp3", {volume: 0.9});
    // add1(k, "いいよ！来いよ！胸にかけて胸に！", "mp3", {volume: 0.7});
    // add1(k, "おまたせ", "mp3", {volume: 1});
    // add1(k, "こ↑こ↓", "mp3", {volume: 0.8});
    // add1(k, "これもうわかんねぇな", "mp3", {volume: 1});
    add1(k, "じゃけん夜行きましょうね", "mp3", {volume: 0.9});
    add1(k, "ちょっと歯当たんよ～", "mp3", {volume: 0.6});
    // add1(k, "ほらいくどー", "mp3", {volume: 0.7});
    // add1(k, "やっぱ好きなんすねぇ", "mp3", {volume: 0.7});
    // add1(k, "イキスギィ！ンアッー！", "mp3", {volume: 0.7});
    add1(k, "オッスお願いしま～す", "mp3", {volume: 0.9});
    add1(k, "カンノミホ", "mp3", {volume: 0.9});
    // add1(k, "ファッ！？", "mp3", {volume: 1});
    add1(k, "学生です", "mp3", {volume: 0.9});
    // add1(k, "悔い改めて", "mp3", {volume: 0.7});
    // add1(k, "見とけよ見とけよ～", "mp3", {volume: 1});
})();
