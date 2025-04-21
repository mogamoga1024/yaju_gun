
function lyrics(sound) {
    const message = {
        isTransient: true,
        text: ""
    };

    if (sound === null) {
        return message;
    }

    if (sound.name === "パラオナボーイ／feat.重音テト") {
        const seek = sound.seek();
        message.isTransient = false;

        if (seek < 1.5) {
            message.text = "";
        }
        else if (seek < 17) {
            message.text = "オチ〇ポ・パラダイス\nパラダイス・ラブ・ユー・ベイビー";
        }
        else if (seek < 25) {
            message.text = "パラダイス・オ〇ニー・ボーイ\n（略してパラオナボーイ）";
        }
        else if (seek < 31) {
            message.text = "泊まりのウリで　マジ狂いの天国さ";
        }
        else if (seek < 37) {
            message.text = "ホテル代も　バカにならないけどね";
        }
        else if (seek < 43) {
            message.text = "小遣い稼ぎなら　これが一番！";
        }
        else {
            message.text = "俺のケツ〇ンパラダイス";
        }
    }
    else if (sound.name === "「愛のカタチ」四部合唱【山崎まさゆき】") {
        const seek = sound.seek();
        message.isTransient = false;

        if (seek < 16.5) {
            message.text = "";
        }
        else if (seek < 20.5) {
            message.text = "人を好きになることいいこと";
        }
        else if (seek < 24.5) {
            message.text = "愛の表現はいろいろあるけど";
        }
        else if (seek < 28.5) {
            message.text = "愛のカタチはいろいろあるけど";
        }
        else if (seek < 32.5) {
            message.text = "決められたものじゃない";
        }
        else if (seek < 40.5) {
            message.text = "誰を愛そうがそれはいいこと";
        }
        else if (seek < 48.5) {
            message.text = "常識に縛られたものなどいらない";
        }
        else if (seek < 56.5) {
            message.text = "自由に生きよう恥じることじゃない";
        }
        else if (seek < 60.5) {
            message.text = "カタチにとらわれるな";
        }
        else if (seek < 64.5) {
            message.text = "常識に縛られるな";
        }
        else if (seek < 68.5) {
            message.text = "人目 気にするな";
        }
        else if (seek < 75) {
            message.text = "自由に恋しよう";
        }
        else if (seek < 80.5) {
            message.text = "";
        }
        else if (seek < 84.5) {
            message.text = "男と女 誰が決めたの";
        }
        else if (seek < 88.5) {
            message.text = "誰を好きになるか分からない";
        }
        else if (seek < 92.5) {
            message.text = "性別や年 イヌやネコ";
        }
        else if (seek < 96.5) {
            message.text = "なんでもいいんじゃないか";
        }
        else if (seek < 104.5) {
            message.text = "この夜空を見ようよ";
        }
        else if (seek < 112.5) {
            message.text = "小さなことに思えてくるよ";
        }
        else if (seek < 120.5) {
            message.text = "なにが大切か もう一度 振り返って";
        }
        else if (seek < 124.5) {
            message.text = "恋をしよう幅ひろく";
        }
        else if (seek < 128.5) {
            message.text = "恋をしよう自由に";
        }
        else if (seek < 132) {
            message.text = "下を向かなくていい";
        }
        else if (seek < 136.5) {
            message.text = "間違いじゃないから";
        }
        else if (seek < 140.5) {
            message.text = "カタチにとらわれるな";
        }
        else if (seek < 144.5) {
            message.text = "常識に縛られるな";
        }
        else if (seek < 148.5) {
            message.text = "人目 気にするな";
        }
        else if (seek < 154.5) {
            message.text = "自由に恋しよう";
        }
        else if (seek < 160.5) {
            message.text = "";
        }
        else if (seek < 168.5) {
            message.text = "カタチにとらわれるな";
        }
        else if (seek < 172.5) {
            message.text = "恋をしよう幅ひろく";
        }
        else if (seek < 176.5) {
            message.text = "恋をしよう自由に";
        }
        else if (seek < 180.5) {
            message.text = "下を向かなくていい";
        }
        else if (seek < 184.5) {
            message.text = "間違いじゃないから";
        }
        else if (seek < 188.5) {
            message.text = "カタチにとらわれるな";
        }
        else if (seek < 192.5) {
            message.text = "常識に縛られるな";
        }
        else if (seek < 196.5) {
            message.text = "人目 気にするな";
        }
        else if (seek < 203.5) {
            message.text = "自由に恋しよう";
        }
        else {
            message.text = "";
        }
    }
    else if (sound.name === "星空.flv") {
        const seek = sound.seek();
        message.isTransient = false;

        if (seek < 13.5) {
            message.text = "いつものように　本を読み終わり\n私は窓を開け　夜の星空を見上げる";
        }
        else if (seek < 22.4) {
            message.text = "";
        }
        else if (seek < 45) {
            message.text = "星たちが輝く夜空を見ながら　思い浮かぶのは\nあなたの星のように輝いた笑顔";
        }
        else if (seek < 55.5) {
            message.text = "まるで星のようなあなたに\n私はどうして届かないのだろう？";
        }
        else if (seek < 66.5) {
            message.text = "どうして振り向いてもらえないのだろう？";
        }
        else if (seek < 76.5) {
            message.text = "あなたは私のことをどう思っているの？";
        }
        else if (seek < 87.5) {
            message.text = "あなたのことを考えただけで　胸が苦しくなる";
        }
        else if (seek < 98.5) {
            message.text = "明日もまた　こうして夜の星空を見るだろう";
        }
        else if (seek < 105) {
            message.text = "そのたび　私はあなたを思い浮かべる";
        }
        else if (seek < 113.5) {
            message.text = "この夜空に輝く星のようなあなたを";
        }
        else {
            message.text = "";
        }
    }
    else if (sound.name === "シン・怪文書アレンジ／さとうささら") {
        const seek = sound.seek();
        message.isTransient = false;

        message.text = "おいおい、気安く呼ぶなよ！！\n一応同盟国だから来てやったんだぜ！\n尖閣守ってやらねーぞ！！"
    }

    return message;
}
