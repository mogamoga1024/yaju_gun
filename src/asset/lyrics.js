
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
    else {
        // todo
    }

    return message;
}
