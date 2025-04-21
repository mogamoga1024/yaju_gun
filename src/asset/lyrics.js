
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

        if (seek < 1.5) {
            message.text = "";
        }
        else if (seek < 4) {
            message.text = "ウルトラマンが拉致されて";
        }
        else if (seek < 7) {
            message.text = "腹筋ボコボコにパンチ食らって";
        }
        else if (seek < 13.5) {
            message.text = "胸のランプが点滅すると あと3分で力尽き果てる";
        }
        else if (seek < 22) {
            message.text = "その時のウルトラマンの苦しむ姿にドキドキするって";
        }
        else if (seek < 25.5) {
            message.text = "ヒーロー〇〇だぜ！";
        }
        else if (seek < 36) {
            message.text = "";
        }
        else if (seek < 41.5) {
            message.text = "仮面かぶった拓也ゎ前見えねぇし\n息ゎ苦しいし";
        }
        else if (seek < 47) {
            message.text = "ウルトラマン最後の3分間ゎ30分以上にわたり";
        }
        else if (seek < 56.5) {
            message.text = "絶対負けるはずのないウルトラマンが倒れる";
        }
        else if (seek < 59) {
            message.text = "そんなのあり得ない！";
        }
        else if (seek < 65) {
            message.text = "力尽きたウルトラマンが〇される";
        }
        else if (seek < 67) {
            message.text = "マヂ苦しい";
        }
        else if (seek < 70) {
            message.text = "酸欠で死にそう";
        }
        else if (seek < 79) {
            message.text = "力が入らなくなったウルトラマンの股が大きく開かれて";
        }
        else if (seek < 85) {
            message.text = "ウルトラマ〇コにデカ〇ラが容赦なく突き刺さる";
        }
        else if (seek < 93) {
            message.text = "脳天まで突き上げるファ〇クに苦しみ喘ぐ\n息もマスクで塞がれて";
        }
        else if (seek < 98) {
            message.text = "最初ゎキュウキュウ締め付けていたウルトラマ〇コも";
        }
        else if (seek < 110) {
            message.text = "酸欠で意識が薄れてくると";
        }
        else if (seek < 115.5) {
            message.text = "最後ゎあの痙攣がやってくる";
        }
        else if (seek < 122.5) {
            message.text = "ウルトラマンだって死ぬときゎ射〇するんだよ";
        }
        else if (seek < 130.5) {
            message.text = "あー！！イク！！ ";
        }
        else if (seek < 136) {
            message.text = "ウルトラマ〇コにビクビクと\n弾丸が撃ち込まれると同時に";
        }
        else if (seek < 141) {
            message.text = "ウルトラマンも意識がぶっ飛び射〇";
        }
        else if (seek < 155) {
            message.text = "そのあとピクピクと痙攣したまま動かなくなった";
        }
        else if (seek < 162) {
            message.text = "";
        }
        else if (seek < 169) {
            message.text = "ウルトラマンの夢枕に現れたのゎ\nあの、ターミネーター";
        }
        else if (seek < 176.5) {
            message.text = "日本のウルトラマンは弱いな！！\nオレを見ろ！！絶対死なないぞ";
        }
        else if (seek < 181) {
            message.text = "あっ…あっ シュワちゃんだ";
        }
        else if (seek < 184) {
            message.text = "シュワッチ…シュワッチ！！";
        }
        else if (seek < 196) {
            message.text = "おいおい、気安く呼ぶなよ！！\n一応同盟国だから来てやったんだぜ！\n尖閣守ってやらねーぞ！！";
        }
        else if (seek < 209.5) {
            message.text = "シュワちゃんから強力なバワーをもらって帰ると\nウルトラマンの星で家族会議が始まった";
        }
        else if (seek < 211.5) {
            message.text = "";
        }
        else if (seek < 216.5) {
            message.text = "やっぱり シュワッチゎ変えた方が";
        }
        else if (seek < 217.5) {
            message.text = "よくね？";
        }
        else {
            message.text = "";
        }
    }

    return message;
}
